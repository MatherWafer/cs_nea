from flask import Flask, request, flash , jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import date,datetime
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
        list_of_studentIDs = list(map(lambda x: (this_assignmentID, x["StudentID"]),conn.execute(f"""SELECT StudentID from tblStudent WHERE ClassID = "{this_classID}" ;""")))
        empty_assignments = ",\n".join([str(x) for x in list_of_studentIDs])
        conn.execute(f"""INSERT INTO tblAssignment
                            VALUES("{this_assignmentID}", "{this_classID}", "{this_questionSetID}", "{this_dateSet}", "{this_dateDue}");""")
        conn.execute(f"""INSERT INTO tblUserSubmission (AssignmentID,StudentID) VALUES {empty_assignments};""")
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
        conn.execute(f"""INSERT INTO tblQuestionSet (QuestionSetID,TeacherID,NoOfQuestions, SetName) VALUES("{this_questionSetID}", "{this_teacherID}", {this_numberOfQuestions}, "{this_setName}"); """)
        blank_questions = [(this_questionSetID,i+1,"Empty question") for i in range(this_numberOfQuestions)] 
        questions_to_insert = ",\n".join([str(x) for x in blank_questions])
        conn.execute(f"""INSERT INTO tblQuestion (QuestionSetID,QuestionNumber,QuestionText) VALUES {questions_to_insert};""")
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
    submissions = query_as_json(f"""SELECT Forename, Surname, tblStudent.StudentID, DateSubmitted 
                                    FROM tblUserSubmission 
                                    INNER JOIN tblStudent 
                                    ON tblStudent.StudentID = tblUserSubmission.StudentID
                                    WHERE AssignmentID = "{this_assignmentID}"; """)
    return{"status":200,
           "submissions":submissions}                                        

@app.route('/edit-question',methods=(['GET','PUT']))
def edit_question():
    this_questionSetID = request.args.get('questionSetID', type = str)
    this_questionNumber = request.args.get('questionNumber', type = str)
    if request.method == 'GET':
        conn = get_db()
        stored_question_details = conn.execute(f"""SELECT QuestionText, Answer, MarksAvailable
                                        FROM tblQuestion 
                                        WHERE QuestionSetID = "{this_questionSetID}" 
                                         AND QuestionNumber = {this_questionNumber};""").fetchone()
        questionText = stored_question_details["QuestionText"]
        solution = stored_question_details["Answer"]
        marksAvailable = stored_question_details["MarksAvailable"]
        return {"status":200,
                "questionText":questionText,
                "solution": solution,
                "marks": marksAvailable}
    elif request.method =='PUT':
        conn = get_db()
        requestData = json.loads(request.data)
        this_newText = requestData["newText"]
        this_newSolution = requestData["newSolution"]
        this_newMarks = requestData["newMarks"]
        conn.execute(f"""UPDATE tblQuestion
                            SET QuestionText = "{this_newText}",
                                Answer = "{this_newSolution}",
                                MarksAvailable = {this_newMarks}
                            WHERE QuestionSetID = "{this_questionSetID}"
                              AND QuestionNumber = {this_questionNumber};""")
        conn.commit()
        return{"status":200}

@app.route('/do-assignment',methods=(['GET','PUT']))
def get_submission_and_questions():
    this_assignmentID = request.args.get('assignmentID', type = str)
    this_studentID = request.args.get('student', type = str)
    if request.method == 'GET':
        conn = get_db()
        submissionData = conn.execute(f"""SELECT UserAnswers, DateSubmitted, Returned 
                                          FROM tblUserSubmission 
                                          WHERE AssignmentID = "{this_assignmentID}"
                                                AND StudentID = "{this_studentID}"; """).fetchone()
        userAnswers = submissionData[0].replace("''",'"')
        dateSubmitted = submissionData[1]
        returned = submissionData[2]
        questions = conn.execute(f"""SELECT QuestionText 
                                    FROM tblQuestion
                                    INNER JOIN tblQuestionSet
                                    ON tblQuestion.QuestionSetID = tblQuestionSet.QuestionSetID
                                    INNER JOIN tblAssignment 
                                        ON AssignmentID = "{this_assignmentID}" 
                                        AND tblAssignment.QuestionSetID = tblQuestionSet.QuestionSetID
                                    ORDER BY QuestionNumber;""").fetchall()
        question_list = list(map(lambda x: x[0],questions))
        conn.commit()
        return{"status":200, "questions": question_list, "answers":userAnswers, "dateSubmitted":dateSubmitted, "returned":returned}
    elif request.method == 'PUT':
        requestData = json.loads(request.data)
        answers = json.dumps(requestData["answers"]).replace('"',"''")
        print(answers)
        conn = get_db()
        conn.execute(f"""UPDATE tblUserSubmission
                            SET UserAnswers = "{answers}" 
                            WHERE (AssignmentID,StudentID) = ("{this_assignmentID}","{this_studentID}")  ;""")
        conn.commit()
        return{"status":200}

@app.route('/submit-assignment', methods=(['PUT']))
def submit_assignment():
    this_assignmentID = request.args.get('assignment', type = str)
    this_studentID = request.args.get('student', type = str)
    current_date = datetime.now()
    today = current_date.strftime('%Y-%m-%d')
    print(today)
    conn = get_db()
    conn.execute(f"""UPDATE tblUserSubmission
                        SET DateSubmitted = "{today}" 
                        WHERE (AssignmentID,StudentID) = ("{this_assignmentID}","{this_studentID}")   ;""")
    conn.commit()
    return{"status":200}


@app.route('/mark-submission',methods=(['GET','PUT']))
def mark_submission():
    this_assignmentID = request.args.get('assignment', type = str)
    this_studentID = request.args.get('student', type = str)
    print(this_assignmentID,this_studentID)
    if request.method == 'GET':
        conn = get_db()
        submissionDataAndMarks = conn.execute(f"""SELECT UserAnswers, MarksForQuestions 
                                                  FROM tblUserSubmission 
                                                  WHERE (AssignmentID,StudentID) = ("{this_assignmentID}","{this_studentID}"); """).fetchone()
        submissionData =  submissionDataAndMarks[0].replace("''",'"')
        userMarks = submissionDataAndMarks[1].replace("'",'"')
        questions = conn.execute(f"""SELECT QuestionText, Answer, MarksAvailable
                                    FROM tblQuestion
                                    INNER JOIN tblQuestionSet
                                    ON tblQuestion.QuestionSetID = tblQuestionSet.QuestionSetID
                                    INNER JOIN tblAssignment 
                                        ON AssignmentID = "{this_assignmentID}" 
                                        AND tblAssignment.QuestionSetID = tblQuestionSet.QuestionSetID
                                    ORDER BY QuestionNumber;""").fetchall()
        question_list = list(map(lambda x: {"questionText": x[0],
                                            "questionAnswer": x[1],
                                            "marksAvailable": x[2]}, questions))
        conn.commit()
        return{"status":200, 
               "questions": question_list, 
               "answers": submissionData, 
               "marks": userMarks}
    elif request.method == 'PUT':
        conn = get_db()
        request_data = json.loads(request.data)
        marks = json.dumps(request_data["marks"]).replace('"',"''")
        print(marks)
        conn.execute(f"""UPDATE tblUserSubmission
                            SET Returned = 1,
                                MarksForQuestions = "{marks}"
                            WHERE  (AssignmentID,StudentID) = ("{this_assignmentID}","{this_studentID}");""")
        conn.commit()
        return{"status":200}

@app.route('/review-submission', methods=(['GET']))
def review_submission():
    this_assignmentID = request.args.get('assignment', type = str)
    this_studentID = request.args.get('student', type = str)
    conn = get_db()
    solutions = conn.execute(f"""SELECT Answer
                                    FROM tblQuestion
                                    INNER JOIN tblQuestionSet
                                    ON tblQuestion.QuestionSetID = tblQuestionSet.QuestionSetID
                                    INNER JOIN tblAssignment 
                                        ON AssignmentID = "{this_assignmentID}" 
                                           AND tblAssignment.QuestionSetID = tblQuestionSet.QuestionSetID
                                    ORDER BY QuestionNumber;""").fetchall()
    marksAwarded = conn.execute(f"""SELECT MarksForQuestions 
                                    FROM tblUserSubmission 
                                    WHERE (AssignmentID,StudentID) = ("{this_assignmentID}","{this_studentID}"); """).fetchone()[0].replace("''",'"')                     
    solutions = list(map(lambda x:x[0],solutions))
    conn.commit()
    return {"status":200, "marks":marksAwarded, "solutions":solutions}
#def get_submission_and_questions():
#    this_assignmentID = request.args.get('assignmentID', type = str)
#    this_studentID = request.args.get('student', type = str)
#    if request.method == 'GET':
#        conn = get_db()
##        submissionData = conn.execute(f"""SELECT UserAnswers FROM tblUserSubmission WHERE AssignmentID = "{this_assignmentID}" AND StudentID = "{this_studentID}"; """).fetchone()[0].replace("''",'"')
 #       questions = conn.execute(f"""SELECT QuestionText 
#                                    FROM tblQuestion
#                                    INNER JOIN tblQuestionSet
##                                    ON tblQuestion.QuestionSetID = tblQuestionSet.QuestionSetID
#                                    INNER JOIN tblAssignment 
#                                        ON AssignmentID = "{this_assignmentID}" AND tblAssignment.QuestionSetID = tblQuestionSet.QuestionSetID
#                                    ORDER BY QuestionNumber;""").fetchall()
 #       question_list = list(map(lambda x: x[0],questions))
 #       return{"status":200, "questions": question_list, "answers":submissionData}
  #  elif request.method == 'PUT':
   #     requestData = json.loads(request.data)
   #     answers = json.dumps(requestData["answers"]).replace('"',"''")
   #     print(answers)
   #     conn = get_db()
   #     conn.execute(f"""UPDATE tblUserSubmission
   #                         SET UserAnswers = "{answers}" WHERE (AssignmentID,StudentID) = ("{this_assignmentID}","{this_studentID}")  ;""")
    #    conn.commit()
    #    return{"status":200}
#
#REFACTOR WEBSITE => TWO NAVS FOR STUDENT / TEACHER??
#

	    #SET QuestionText = "dsw" WHERE QuestionSetID = "TestSet2kk" AND QuestionNumber = 3;