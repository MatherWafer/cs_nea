from flask import Flask, request, flash , jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import date
import json
import sqlite3
app = Flask(__name__)
db_file = "db.db"
from db import get_db, close_db

def query_as_json(query):
    conn = get_db()
    data = list([json.dumps(dict(currentRow)) for currentRow in conn.execute(query).fetchall()])
    return data

@app.route('/time')
def get_current_time():
    return {'time': str(date.today())}

@app.route('/register',methods=(['POST']))
def make_user():
    request_data = json.loads(request.data)
    this_id = request_data["studentID"]
    this_pwd = request_data["pwd"]
    this_forename = request_data["forename"]
    this_surname = request_data["surname"]
    hashed_pwd = generate_password_hash(this_pwd)
    conn = get_db()
    #TRY INSERT INTO DB. EXCEPT INTEGRITY ERROR AND RETURN THAT USER ALREADY EXISTS.
    try:
        conn.execute(f"""INSERT INTO tblStudent(StudentID,Forename,Surname,PasswordHash) \nVALUES ("{this_id}","{this_forename}","{this_surname}","{hashed_pwd}");""")
        conn.commit()
        return {"status":200}
    except conn.IntegrityError:
        return {"status":409}

@app.route('/teacher-register',methods=(['POST']))
def make_teacher():
    request_data = json.loads(request.data)
    this_id = request_data["teacherID"]
    this_pwd = request_data["pwd"]
    this_forename = request_data["forename"]
    this_surname = request_data["surname"]
    hashed_pwd = generate_password_hash(this_pwd)
    conn = get_db()
    try:
        conn.execute(f"""INSERT INTO tblTeacher \nVALUES ("{this_id}","{this_forename}","{this_surname}","{hashed_pwd}");""")
        conn.commit()
        return {"status":200}
    except conn.IntegrityError:
        return {"status":409}


@app.route('/create-class',methods=(['POST']))
def make_class():
    request_data = json.loads(request.data)
    this_classID = request_data["classID"]
    this_className = request_data["className"]
    this_teacherID = request_data["teacherID"]
    conn = get_db()
    try:
        conn.execute(f"""INSERT INTO tblClass \nVALUES("{this_classID}", "{this_className}", "{this_teacherID}")""")
        conn.commit()
        return {"status":200,
                "submittedID":this_classID}
    except conn.IntegrityError:
        return {"status":409}



@app.route('/login',methods=(['POST']))
def student_login():
    request_data = json.loads(request.data)
    conn = get_db()
    this_id = request_data["studentID"]
    this_pwd = request_data["pwd"]
    this_user = conn.execute(f"""SELECT * FROM tblStudent WHERE StudentID = "{this_id}";""").fetchone()
    if this_user is not None:
        row_dict = dict(this_user)
        row_json = json.dumps(row_dict)
        if check_password_hash(this_user['PasswordHash'],this_pwd):
            return{"status":200,"user-data":row_json}
        else:
            return{"status":400}
    return {"status":209}
            

@app.route('/teacher-login',methods=(['POST']))
def teacher_login():
    request_data = json.loads(request.data)
    conn = get_db()
    this_id = request_data["teacherID"]
    this_pwd = request_data["pwd"]
    this_user = conn.execute(f"""SELECT * FROM tblTeacher WHERE TeacherID = "{this_id}";""").fetchone()
    if this_user is not None:
        row_dict = dict(this_user)
        row_json = json.dumps(row_dict)
        if check_password_hash(this_user['PasswordHash'],this_pwd):
            return{"status":200,"user-data":row_json}
        else:
            return{"status":400}
    return {"status":209}
            


@app.route('/assignments',methods=(['GET']))
def get_assignments():
    this_id = request.args.get('user',type = str)
    conn = get_db()
    assignments = list([json.dumps(dict(currentRow)) for currentRow in conn.execute(f"""SELECT AssignmentID, DateSet, DateDue FROM tblAssignment, tblStudent WHERE tblStudent.StudentID =  "{this_id}" AND tblAssignment.ClassID = tblStudent.ClassID;""").fetchall()])
    return{"status":200,
           "assignments":assignments}


@app.route('/skills',methods=(['GET']))
def get_skills():
    this_id = request.args.get('user',type = str)
    conn = get_db()
    skills = list([json.dumps(dict(currentRow)) for currentRow in conn.execute(f"""SELECT SubjectName, Proficiency FROM tblSubjectSkill WHERE StudentID = "{this_id}"; """).fetchall()])
    return{"status":200,
           "skills":skills}


@app.route('/select-class',methods=(['GET']))
def get_classes():
    this_id = request.args.get('user',type = str)
    print(this_id)
    classes = query_as_json(f"""SELECT ClassID, ClassName FROM tblClass WHERE TeacherID = "{this_id}" """)
    return{"status":200,
           "classes":classes}

@app.route('/manage-class',methods=(['GET','PUT']))
def get_students():
    if request.method == 'GET':
        this_id = request.args.get('class', type = str)
        conn = get_db()
        students = query_as_json(f"""SELECT StudentID, Forename, Surname from tblStudent WHERE ClassID = "{this_id}"  """)
        return{"status":200,
            "students":students}
    elif request.method == 'PUT':
        #method != GET => method = PUT
        request_data = json.loads(request.data)
        print(request_data)
        this_studentID = request_data["studentID"]
        this_classID = request.args.get("class", type = str)
        print(this_studentID)
        conn = get_db()
        doesExist = conn.execute(f"""SELECT EXISTS(SELECT 1 FROM tblStudent WHERE StudentID = "{this_studentID}");""").fetchone()[0]
        print(doesExist)
        if doesExist == 0: return {"status":404}
        conn.execute(f"""UPDATE tblStudent
                            SET ClassID = "{this_classID}" WHERE StudentID = "{this_studentID}";""")
        conn.commit()
        return {"status":200}


    
@app.route('/enroll-student',methods=(['PUT']))
def enrol_student():
    #method != GET => method = PUT
    request_data = json.loads(request.data)
    this_studentID = request_data["studentID"]
    this_classID = request.args.get("class", type = str)
    conn = get_db()
    doesExist = conn.execute(f"""SELECT EXISTS(SELECT 1 FROM tblStudent WHERE StudentID = "{this_studentID}");""").fetchone()[0]
    if doesExist == 0: return {"status":404}
    conn.execute(f"""UPDATE tblStudent
                        SET ClassID = "{this_classID}" WHERE StudentID = "{this_studentID}";""")
    conn.commit()
    return {"status":200}


@app.route('/create-assignment',methods=(['POST']))
def create_assignment():
    request_data = json.loads(request.data)
    this_assignmentID = request_data["assignmentID"]
    this_classID = request_data["classID"]
    this_questionSetID = request_data["questionSetID"]
    this_dateSet = request_data["dateSet"]
    this_dateDue = request_data["dateDue"]
    conn = get_db()
    try:

        conn.execute(f"""INSERT INTO tblAssignment
                            VALUES("{this_assignmentID}", "{this_classID}", "{this_questionSetID}", "{this_dateSet}", "{this_dateDue}");""")
        conn.commit()
        return{"status":200}
    except conn.IntegrityError:
        return {"status":409,
                "errorType": "integrity"}



@app.route('/get-assignments',methods=(['GET']))
def get_assignments_for_class():
    this_id = request.args.get('class', type = str)
    conn = get_db()
    assignments = list([json.dumps(dict(currentRow)) for currentRow in conn.execute(f"""SELECT AssignmentID, DateSet, DateDue from tblAssignment WHERE ClassID = "{this_id}" """)])
    return{"status":200,
           "assignments":assignments}


@app.route('/create-questionSet', methods=(['POST']))
def create_questionSet():
    request_data = json.loads(request.data)
    this_questionSetID = request_data["questionSetID"]
    this_teacherID = request_data["teacherID"]
    this_numberOfQuestions = int(request_data["numberOfQuestions"])
    this_setName = request_data["questionSetDescription"]
    conn = get_db()
    try:
        conn.execute(f"""INSERT INTO tblQuestionSet VALUES("{this_questionSetID}", "{this_teacherID}", {this_numberOfQuestions}, "{this_setName}"); """)
        blank_questions = [(this_questionSetID,i+1,"Empty question") for i in range(this_numberOfQuestions)] 
        questions_to_insert = ",\n".join([str(x) for x in blank_questions])
        conn.execute(f"""INSERT INTO tblQuestion VALUES {questions_to_insert};""")
        conn.commit()
        return {"status":200}
    except conn.IntegrityError:
        return {"status":409}


@app.route('/select-questionSet', methods=(['GET'])) 
def get_questionSet():
    this_id = request.args.get('teacherID', type = str)
    questionSets = query_as_json(f"""SELECT QuestionSetID, NoOfQuestions, SetName FROM tblQuestionSet WHERE TeacherID = "{this_id}" """ )
    return{"status":200,
           "questionSets":questionSets}

@app.route('/manage-questionSet',methods=(['GET']))
def get_questions_to_manage():
    this_id = request.args.get('questionSetID', type = str)
    questions = query_as_json(f"""SELECT QuestionNumber, QuestionText FROM tblQuestion WHERE QuestionSetID ="{this_id}" """)
    return{"status":200,
           "questions":questions}
@app.route('/view-submissions', methods=(['GET']))
def view_submissions_for_assignment():
    this_assignmentID = request.args.get('assignment', type = str)
    submissions = query_as_json(f"""SELECT Forename, Surname, tblStudent.StudentID, UserAnswers, DateSubmitted 
                                    FROM tblUserSubmission 
                                    INNER JOIN tblStudent 
                                    ON tblStudent.StudentID = tblUserSubmission.StudentID
                                    WHERE AssignmentID = "{this_assignmentID}"; """)
    return{"status":200,
           "submissions":submissions}                                        
#REFACTOR WEBSITE => TWO NAVS FOR STUDENT / TEACHER??
#

