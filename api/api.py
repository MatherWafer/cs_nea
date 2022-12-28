from flask import Flask, request, flash , jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import date
import json
import sqlite3
app = Flask(__name__)
db_file = "db.db"
from db import get_db, close_db

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
    """
    except:
        return{"status":200,
               "submittedID": "anushka smells"}
    """

@app.route('/manageClasses',methods=(['POST']))
def make_class():
    request_data = json.loads(request.data)
    this_id = request_data["classID"]
    this_className = request_data["className"]
    conn = get_db()
    try:
        conn.execute(f"""INSERT INTO tblClass \nVALUES("{this_id}", "{this_className}")""")
        conn.commit()
        return {"status":200}
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
    print(this_id)
    conn = get_db()
    assignments = list([json.dumps(dict(currentRow)) for currentRow in conn.execute(f"""SELECT AssignmentID,NoOfQuestions FROM tblAssignment, tblStudent WHERE tblStudent.StudentID =  "{this_id}" AND tblAssignment.ClassID = tblStudent.ClassID;""").fetchall()])
    return{"status":200,
           "assignments":assignments}


@app.route('/skills',methods=(['GET']))
def get_skills():
    this_id = request.args.get('user',type = str)
    conn = get_db()
    skills = list([json.dumps(dict(currentRow)) for currentRow in conn.execute(f"""SELECT SubjectName, Proficiency FROM tblSubjectSkill WHERE StudentID = "{this_id}"; """).fetchall()])
    return{"status":200,
           "skills":skills}


#REFACTOR WEBSITE => TWO NAVS FOR STUDENT / TEACHER??
#