import json
import sqlite3
from datetime import date, datetime, timedelta ,timezone
import flask
from flask import Flask, flash, jsonify, request, g
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
app = Flask(__name__)
db_file = "db.db"
from db import close_db, get_db


@app.before_request
def create_conn():
    conn = get_db()
    g.db = conn    
    
@app.after_request
def refresh_expiring_jwts(response):
    close_db()
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity(),additional_claims=get_jwt(),expires_delta=False)
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response

app.config["JWT_SECRET_KEY"] = 'b\x8c\xcb\xf0f\xb0\r\xbe\xda\x00J\xd5\x14t\xe8A\xc4\x94\xed\xd8\xac\xbfIC'
jwt = JWTManager(app)
def query_as_json(query):
    #conn = get_db()
    data = list([json.dumps(dict(currentRow)) for currentRow in g.db.execute(query).fetchall()])
    return data

@app.route('/time')
@jwt_required()
def get_current_time():
    return {'time': str(date.today())}


@app.route('/logout', methods=(['POST']))
@jwt_required()
def sign_out():
    response = jsonify({"status":200})
    unset_jwt_cookies(response)
    return response

@app.route('/register',methods=(['POST']))
def make_user():
    request_data = json.loads(request.data)
    this_id = get_jwt_identity()
    this_pwd = request_data["pwd"]
    this_forename = request_data["forename"]
    this_surname = request_data["surname"]
    hashed_pwd = generate_password_hash(this_pwd)
    #conn = get_db()
    #TRY INSERT INTO DB. EXCEPT INTEGRITY ERROR AND RETURN THAT USER ALREADY EXISTS.
    try:
        g.db.execute(f"""INSERT INTO tblStudent(StudentID,Forename,Surname,PasswordHash) \nVALUES ("{this_id}","{this_forename}","{this_surname}","{hashed_pwd}");""")
        g.db.commit()
        return {"status":200}
    except g.db.IntegrityError:
        return {"status":409}

@app.route('/teacher-register',methods=(['POST']))
def make_teacher():
    request_data = json.loads(request.data)
    this_id = get_jwt_identity()
    this_pwd = request_data["pwd"]
    this_forename = request_data["forename"]
    this_surname = request_data["surname"]
    hashed_pwd = generate_password_hash(this_pwd)
    #conn = get_db()
    try:
        g.db.execute(f"""INSERT INTO tblTeacher \nVALUES ("{this_id}","{this_forename}","{this_surname}","{hashed_pwd}");""")
        g.db.commit()
        return {"status":200}
    except g.db.IntegrityError:
        return {"status":409}


@app.route('/create-class',methods=(['POST']))
@jwt_required()
def make_class():
    request_data = json.loads(request.data)
    this_classID = request_data["classID"]
    this_className = request_data["className"]
    this_teacherID = get_jwt_identity()
    print(this_teacherID)
    #conn = get_db()
    try:
        g.db.execute(f"""INSERT INTO tblClass \nVALUES("{this_classID}", "{this_className}", "{this_teacherID}")""")
        g.db.commit()
        return {"status":200,
                "submittedID":this_classID}
    except g.db.IntegrityError:
        return {"status":409}



@app.route('/login',methods=(['POST']))
def student_login():
    request_data = json.loads(request.data)
    #conn = get_db()
    this_id = request_data["studentID"]
    this_pwd = request_data["pwd"]
    this_user = g.db.execute(f"""SELECT * FROM tblStudent WHERE StudentID = "{this_id}";""").fetchone()
    if this_user is not None:
        row_dict = dict(this_user)
        del row_dict["StudentID"]
        row_json = json.dumps(row_dict)
        if check_password_hash(this_user['PasswordHash'],this_pwd):
            additional_claims = {"is_teacher":False}
            access_token = create_access_token(identity=this_id,additional_claims=additional_claims, expires_delta=False)
            return{"status":200,"user-data":row_json, "access_token":access_token}
        else:
            return{"status":400}
    return {"status":209}



@app.route('/check-stored-token',methods=(['GET']))
@jwt_required()
def test_jwt():
    
    try:
        is_teacher = get_jwt()["is_teacher"]
        return {"status":200, "is_teacher":is_teacher}
    except:
        return {"status":401}

@jwt.invalid_token_loader
def unauth_token(_err):
    return {"status":401}


@app.route('/teacher-login',methods=(['POST']))
def teacher_login():
    request_data = json.loads(request.data)
    #conn = get_db()
    this_id = request_data["teacherID"]
    this_pwd = request_data["pwd"]
    this_user = g.db.execute(f"""SELECT * FROM tblTeacher WHERE TeacherID = "{this_id}";""").fetchone()
    if this_user is not None:
        row_dict = dict(this_user)
        del row_dict["TeacherID"]
        row_json = json.dumps(row_dict)
        if check_password_hash(this_user['PasswordHash'],this_pwd):
            additional_claims = {"is_teacher":True}
            access_token = create_access_token(identity=this_id,additional_claims=additional_claims,expires_delta=False)
            return{"status":200,"user-data":row_json, "access_token":access_token}
        else:
            return{"status":400}
    return {"status":209}
            


@app.route('/assignments',methods=(['GET']))
@jwt_required()
def get_assignments():
    this_id = get_jwt_identity()
    #conn = get_db()
    assignments = list([json.dumps(dict(currentRow)) for currentRow in g.db.execute(f"""SELECT AssignmentID, DateSet, DateDue FROM tblAssignment, tblStudent WHERE tblStudent.StudentID =  "{this_id}" AND tblAssignment.ClassID = tblStudent.ClassID;""").fetchall()])
    return{"status":200,
           "assignments":assignments}


@app.route('/skills',methods=(['GET']))
@jwt_required()
def get_skills():
    this_id = get_jwt_identity()
    #conn = get_db()
    skills = list([json.dumps(dict(currentRow)) for currentRow in g.db.execute(f"""SELECT SubjectName, TotalCorrect, TotalAnswered, (100 * CAST(TotalCorrect AS REAL) / TotalAnswered) AS PercentCorrect  FROM tblSubjectSkill WHERE StudentID = "{this_id}"; """).fetchall()])
    return{"status":200,
           "skills":skills}


@app.route('/select-class',methods=(['GET']))
@jwt_required()
def get_classes():
    this_id = get_jwt_identity()
    classes = query_as_json(f"""SELECT ClassID, ClassName FROM tblClass WHERE TeacherID = "{this_id}" """)
    return{"status":200,
           "classes":classes}


@jwt.unauthorized_loader
def custom_unauthorized_response(_err):
    return {"status":501}

@app.route('/manage-class',methods=(['GET','PUT']))
@jwt_required()
def get_students():
    if request.method == 'GET':
        this_id = request.args.get("class",type = str)
        #conn = get_db()
        students = query_as_json(f"""SELECT StudentID, Forename, Surname from tblStudent WHERE ClassID = "{this_id}"  """)
        return{"status":200,
            "students":students}
    elif request.method == 'PUT':
        #method != GET => method = PUT
        request_data = json.loads(request.data)
        this_studentID = get_jwt_identity()
        this_classID = request.args.get("class", type = str)
        #conn = get_db()
        doesExist = g.db.execute(f"""SELECT EXISTS(SELECT 1 FROM tblStudent WHERE StudentID = "{this_studentID}");""").fetchone()[0]
        if doesExist == 0: return {"status":404}
        g.db.execute(f"""UPDATE tblStudent
                            SET ClassID = "{this_classID}" WHERE StudentID = "{this_studentID}";""")
        g.db.commit()
        return {"status":200}



   
@app.route('/enroll-student',methods=(['PUT']))
@jwt_required()
def enrol_student():
    #method != GET => method = PUT
    request_data = json.loads(request.data)
    this_studentID = this_id = request.args.get("studentID",type = str)
    this_classID = request.args.get("class", type = str)
    #conn = get_db()
    doesExist = g.db.execute(f"""SELECT EXISTS(SELECT 1 FROM tblStudent WHERE StudentID = "{this_studentID}");""").fetchone()[0]
    if doesExist == 0: return {"status":404}
    g.db.execute(f"""UPDATE tblStudent
                        SET ClassID = "{this_classID}" WHERE StudentID = "{this_studentID}";""")
    g.db.commit()
    return {"status":200}


@app.route('/create-assignment',methods=(['POST']))
@jwt_required()
def create_assignment():
    request_data = json.loads(request.data)
    this_assignment_id = request_data["assignmentID"]
    this_classID = request_data["classID"]
    this_questionSetID = request_data["questionSetID"]
    this_dateSet = request_data["dateSet"]
    this_dateDue = request_data["dateDue"]
    #conn = get_db()
    try:
        list_of_studentIDs = list(map(lambda x: (this_assignment_id, x["StudentID"]),g.db.execute(f"""SELECT StudentID from tblStudent WHERE ClassID = "{this_classID}" ;""")))
        empty_assignments = ",\n".join([str(x) for x in list_of_studentIDs])
        g.db.execute(f"""INSERT INTO tblAssignment
                            VALUES("{this_assignment_id}", "{this_classID}", "{this_questionSetID}", "{this_dateSet}", "{this_dateDue}");""")
        g.db.execute(f"""INSERT INTO tblUserSubmission (AssignmentID,StudentID) VALUES {empty_assignments};""")
        g.db.commit()
        return{"status":200}
    except g.db.IntegrityError:
        return {"status":409,
                "errorType": "integrity"}



@app.route('/get-assignments',methods=(['GET']))
@jwt_required()
def get_assignments_for_class():
    this_ClassID = request.args.get('class',type = str)
    #conn = get_db()
    assignments = list([json.dumps(dict(currentRow)) for currentRow in g.db.execute(f"""SELECT AssignmentID, DateSet, DateDue from tblAssignment WHERE ClassID = "{this_ClassID}" """)])
    return{"status":200,
           "assignments":assignments}


@app.route('/create-questionSet', methods=(['POST']))
@jwt_required()
def create_questionSet():
    request_data = json.loads(request.data)
    this_questionSetID = request_data["questionSetID"]
    this_teacherID = get_jwt_identity()
    this_numberOfQuestions = int(request_data["numberOfQuestions"])
    this_setName = request_data["questionSetDescription"]
    #conn = get_db()
    try:
        g.db.execute(f"""INSERT INTO tblQuestionSet (QuestionSetID,TeacherID,NoOfQuestions, SetName) VALUES("{this_questionSetID}", "{this_teacherID}", {this_numberOfQuestions}, "{this_setName}"); """)
        blank_questions = [(this_questionSetID,i+1,"Empty question") for i in range(this_numberOfQuestions)] 
        questions_to_insert = ",\n".join([str(x) for x in blank_questions])
        g.db.execute(f"""INSERT INTO tblQuestion (QuestionSetID,QuestionNumber,QuestionText) VALUES {questions_to_insert};""")
        g.db.commit()
        return {"status":200}
    except g.db.IntegrityError:
        return {"status":409}


@app.route('/select-questionSet', methods=(['GET'])) 
@jwt_required()
def get_questionSet():
    this_id = get_jwt_identity()
    questionSets = query_as_json(f"""SELECT QuestionSetID, NoOfQuestions, SetName FROM tblQuestionSet WHERE TeacherID = "{this_id}" """ )
    return{"status":200,
           "questionSets":questionSets}

@app.route('/manage-questionSet',methods=(['GET']))
@jwt_required()
def get_questions_to_manage():
    this_id = request.args.get('questionSetID', type = str)
    questions = query_as_json(f"""SELECT QuestionNumber, QuestionText FROM tblQuestion WHERE QuestionSetID ="{this_id}" """)
    return{"status":200,
 
          "questions":questions}
@app.route('/view-submissions', methods=(['GET']))
@jwt_required()
def view_submissions_for_assignment():
    this_assignment_id = request.args.get('assignment', type = str)
    submissions = query_as_json(f"""SELECT Forename, Surname, tblStudent.StudentID, DateSubmitted 
                                    FROM tblUserSubmission 
                                    INNER JOIN tblStudent 
                                    ON tblStudent.StudentID = tblUserSubmission.StudentID
                                    WHERE AssignmentID = "{this_assignment_id}"; """)
    return{"status":200,
           "submissions":submissions}                                        

@app.route('/edit-question',methods=(['GET','PUT']))
@jwt_required()
def edit_question():
    this_questionSetID = request.args.get('questionSetID', type = str)
    this_questionNumber = request.args.get('questionNumber', type = str)
    if request.method == 'GET':
        #conn = get_db()
        stored_question_details = g.db.execute(f"""SELECT QuestionText, Answer, MarksAvailable
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
        #conn = get_db()
        requestData = json.loads(request.data)
        this_newText = requestData["newText"]
        this_newSolution = requestData["newSolution"]
        this_newMarks = requestData["newMarks"]
        g.db.execute(f"""UPDATE tblQuestion
                            SET QuestionText = "{this_newText}",
                                Answer = "{this_newSolution}",
                                MarksAvailable = {this_newMarks}
                            WHERE QuestionSetID = "{this_questionSetID}"
                              AND QuestionNumber = {this_questionNumber};""")
        g.db.commit()
        return{"status":200}

@app.route('/do-assignment',methods=(['GET','PUT']))
@jwt_required()
def get_submission_and_questions():
    this_assignment_id = request.args.get('assignmentID', type = str)
    this_studentID = get_jwt_identity()
    if request.method == 'GET':
        #conn = get_db()
        submissionData = g.db.execute(f"""SELECT UserAnswers, DateSubmitted, Returned 
                                          FROM tblUserSubmission 
                                          WHERE AssignmentID = "{this_assignment_id}"
                                                AND StudentID = "{this_studentID}"; """).fetchone()
        userAnswers = submissionData[0].replace("''",'"')
        dateSubmitted = submissionData[1]
        returned = submissionData[2]
        questions = g.db.execute(f"""SELECT QuestionText 
                                    FROM tblQuestion
                                    INNER JOIN tblQuestionSet
                                    ON tblQuestion.QuestionSetID = tblQuestionSet.QuestionSetID
                                    INNER JOIN tblAssignment 
                                        ON AssignmentID = "{this_assignment_id}" 
                                        AND tblAssignment.QuestionSetID = tblQuestionSet.QuestionSetID
                                    ORDER BY QuestionNumber;""").fetchall()
        question_list = list(map(lambda x: x[0],questions))
        g.db.commit()
        return{"status":200, "questions": question_list, "answers":userAnswers, "dateSubmitted":dateSubmitted, "returned":returned}
    elif request.method == 'PUT':
        requestData = json.loads(request.data)
        answers = json.dumps(requestData["answers"]).replace('"',"''")
        
        #conn = get_db()
        g.db.execute(f"""UPDATE tblUserSubmission
                            SET UserAnswers = "{answers}" 
                            WHERE (AssignmentID,StudentID) = ("{this_assignment_id}","{this_studentID}")  ;""")
        g.db.commit()
        return{"status":200}

@app.route('/submit-assignment', methods=(['PUT']))
@jwt_required()
def submit_assignment():
    this_assignment_id = request.args.get('assignment', type = str)
    this_studentID = get_jwt_identity()
    current_date = datetime.now()
    today = current_date.strftime('%Y-%m-%d')
    
    #conn = get_db()
    g.db.execute(f"""UPDATE tblUserSubmission
                        SET DateSubmitted = "{today}" 
                        WHERE (AssignmentID,StudentID) = ("{this_assignment_id}","{this_studentID}")   ;""")
    g.db.commit()
    return{"status":200}


@app.route('/mark-submission',methods=(['GET','PUT']))
@jwt_required()
def mark_submission():
    this_assignment_id = request.args.get('assignment', type = str)
    this_studentID = request.args.get('student', type = str)
    
    if request.method == 'GET':
        #conn = get_db()
        submissionDataAndMarks = g.db.execute(f"""SELECT UserAnswers, MarksForQuestions 
                                                  FROM tblUserSubmission 
                                                  WHERE (AssignmentID,StudentID) = ("{this_assignment_id}","{this_studentID}"); """).fetchone()
        submissionData =  submissionDataAndMarks[0].replace("''",'"')
        userMarks = submissionDataAndMarks[1].replace("''",'"')
        questions = g.db.execute(f"""SELECT QuestionText, Answer, MarksAvailable
                                    FROM tblQuestion
                                    INNER JOIN tblQuestionSet
                                    ON tblQuestion.QuestionSetID = tblQuestionSet.QuestionSetID
                                    INNER JOIN tblAssignment 
                                        ON AssignmentID = "{this_assignment_id}" 
                                        AND tblAssignment.QuestionSetID = tblQuestionSet.QuestionSetID
                                    ORDER BY QuestionNumber;""").fetchall()
        question_list = list(map(lambda x: {"questionText": x[0],
                                            "questionAnswer": x[1],
                                            "marksAvailable": x[2]}, questions))
        g.db.commit()
        return{"status":200, 
               "questions": question_list, 
               "answers": submissionData, 
               "marks": userMarks}
    elif request.method == 'PUT':
        #conn = get_db()
        request_data = json.loads(request.data)
        marks = json.dumps(request_data["marks"]).replace('"',"''")
        print(marks)
        g.db.execute(f"""UPDATE tblUserSubmission
                            SET Returned = 1,
                                MarksForQuestions = "{marks}"
                            WHERE  (AssignmentID,StudentID) = ("{this_assignment_id}","{this_studentID}");""")
        g.db.commit()
        return{"status":200}

@app.route('/review-submission', methods=(['GET']))
@jwt_required()
def review_submission():
    this_assignment_id = request.args.get('assignment', type = str)
    this_studentID = get_jwt_identity()
    #conn = get_db()
    solutions = g.db.execute(f"""SELECT Answer
                                    FROM tblQuestion
                                    INNER JOIN tblQuestionSet
                                    ON tblQuestion.QuestionSetID = tblQuestionSet.QuestionSetID
                                    INNER JOIN tblAssignment 
                                        ON AssignmentID = "{this_assignment_id}" 
                                           AND tblAssignment.QuestionSetID = tblQuestionSet.QuestionSetID
                                    ORDER BY QuestionNumber;""").fetchall()
    marksAwarded = g.db.execute(f"""SELECT MarksForQuestions 
                                    FROM tblUserSubmission 
                                    WHERE (AssignmentID,StudentID) = ("{this_assignment_id}","{this_studentID}"); """).fetchone()[0].replace("''",'"')                     
    solutions = list(map(lambda x:x[0],solutions))
    g.db.commit()
    return {"status":200, "marks":marksAwarded, "solutions":solutions}


@app.route('/practice-mode',methods=(['POST']))
@jwt_required()
def submit_practice_mode_results():
    this_studentID = get_jwt_identity()
    request_data = json.loads(request.data)
    subject_results = request_data
    subject_names = list(subject_results.keys())
    current_date = datetime.now()
    date_for_query = current_date.strftime("%Y-%m-%d")
    subject_names_for_query = ','.join([f"'{x}'" for x in subject_names])
    #conn = get_db()
    skill_exists =  list(map(lambda x: x[0],g.db.execute(f"""SELECT SubjectName FROM tblSubjectSkill WHERE StudentID = "{this_studentID}" AND SubjectName in({subject_names_for_query}) ;""").fetchall()))
    if skill_exists:
        existing_skills_for_query = ','.join([f"'{x}'" for x in skill_exists])
        case_statement_for_update = "\n".join([f"WHEN '{subject_name}' THEN TotalAnswered + {subject_results[subject_name]['questionsAnswered']}" for subject_name in skill_exists]) + f"\nEND\nWHERE SubjectName in ({existing_skills_for_query})"
        query_string = f"""UPDATE tblSubjectSkill
                SET TotalAnswered = CASE SubjectName
                    {case_statement_for_update}
                AND StudentID="{this_studentID}";
        """
        g.db.execute(query_string)

        case_statement_for_update = "\n".join([f"WHEN '{subject_name}' THEN TotalCorrect + {subject_results[subject_name]['questionsCorrect']}" for subject_name in skill_exists]) + f"\nEND\nWHERE SubjectName in ({existing_skills_for_query})"

        query_string = f"""UPDATE tblSubjectSkill
            SET TotalCorrect = CASE SubjectName
                {case_statement_for_update}
            AND StudentID="{this_studentID}" ;"""
        g.db.execute(query_string)
    current_percentages_dict = {}    
    current_percentages_rows = g.db.execute(f"""SELECT SubjectName, (100 * CAST(TotalCorrect AS REAL) / TotalAnswered) AS PercentCorrect  FROM tblSubjectSkill
                            WHERE StudentID = "{this_studentID}"
                            AND SubjectName IN ({subject_names_for_query})""").fetchall()
        
    for row in current_percentages_rows:
        current_percentages_dict[row[0]] = row[1]
    milestone_exists = list(map(lambda x:x[0], g.db.execute(f"""SELECT SkillName FROM tblSkillMileStone WHERE StudentID = "{this_studentID}" AND SkillName in({subject_names_for_query}) GROUP BY SkillName""").fetchall()))
    
    print(current_percentages_dict)
    if milestone_exists:
        milestone_names_for_query = ','.join([f"'{x}'" for x in milestone_exists])
        latest_milestones_dict = {}
        latest_milestones_rows = g.db.execute(f"""
                            SELECT tblSkillMilestone.SkillName,Percentage
                            FROM tblSkillMilestone 
                            INNER JOIN     
                                (
                                    SELECT    SkillName, Max(DateAchieved) as DateAchieved
                                    FROM      tblSkillMilestone
                                    WHERE StudentID = "{this_studentID}"
                                    GROUP BY SkillName
                                ) AS maxTimes
                            ON            tblSkillMilestone.SkillName = maxTimes.SkillName
                            AND           tblSkillMilestone.DateAchieved = maxTimes.DateAchieved
                            WHERE tblSkillMilestone.SkillName in({milestone_names_for_query})                  
             """)
        for row in latest_milestones_rows:
            latest_milestones_dict[row[0]] = row[1]

        print(latest_milestones_dict)
        new_milestones= []
        for skill_name in milestone_exists:
            if abs(current_percentages_dict[skill_name] - latest_milestones_dict[skill_name]) > 5:
                new_milestones.append(skill_name)
        new_milestone_records = "\n".join(list(map( lambda cur_skill_name: f"('{this_studentID}', '{cur_skill_name}', '{date_for_query}', {current_percentages_dict[cur_skill_name]})"
        ,milestone_exists)))
        print(milestone_exists)
        print(new_milestone_records)
        g.db.execute(f"""INSERT INTO tblSkillMilestone
                          VALUES {new_milestone_records} """)
    
    milestone_not_exists = [x for x in subject_names if x not in milestone_exists]
    if milestone_not_exists:
            new_milestone_records = "\n".join(list(map(lambda cur_skill_name: f"('{this_studentID}', '{cur_skill_name}', '{date_for_query}', {current_percentages_dict[cur_skill_name]})",milestone_not_exists)))
            g.db.execute(f"""INSERT INTO tblSkillMilestone
                             VALUES{new_milestone_records}
            ;""")
    skill_not_exists = [x for x in subject_names if x not in skill_exists]
    if skill_not_exists:
        newSkillValues = list(map(lambda skill_name: f"('{this_studentID}', '{skill_name}', {subject_results[skill_name]['questionsAnswered']}, {subject_results[skill_name]['questionsCorrect']})",skill_not_exists))
        skills_to_add = "\n".join(newSkillValues)
        g.db.execute(f"""INSERT INTO  tblSubjectSkill 
                            VALUES {skills_to_add}""")
    g.db.commit()
    return{"status":200}

@app.route("/view-milestones",methods=(['GET']))
@jwt_required()
def view_milestones():
    this_studentID = get_jwt_identity()
    this_skillName = request.args.get('skillName', type = str)
    try:
        milestones = query_as_json(f"""SELECT DateAchieved, Percentage FROM tblSkillMilestone
                                       WHERE StudentID = "{this_studentID}"
                                       AND SkillName = "{this_skillName}"; """)
        return{
            "status":200,
            "milestones":milestones
        }
    except:
        return{"status":500}



#def get_submission_and_questions():
#    this_assignment_id = request.args.get('assignmentID', type = str)
#    this_studentID = get_jwt_identity()
#    if request.method == 'GET':
##        conn = get_db()
##        submissionData = g.db.execute(f"""SELECT UserAnswers FROM tblUserSubmission WHERE AssignmentID = "{this_assignment_id}" AND StudentID = "{this_studentID}"; """).fetchone()[0].replace("''",'"')
 #       questions = g.db.execute(f"""SELECT QuestionText 
#                                    FROM tblQuestion
#                                    INNER JOIN tblQuestionSet
##                                    ON tblQuestion.QuestionSetID = tblQuestionSet.QuestionSetID
#                                    INNER JOIN tblAssignment 
#                                        ON AssignmentID = "{this_assignment_id}" AND tblAssignment.QuestionSetID = tblQuestionSet.QuestionSetID
#                                    ORDER BY QuestionNumber;""").fetchall()
 #       question_list = list(map(lambda x: x[0],questions))
 #       return{"status":200, "questions": question_list, "answers":submissionData}
  #  elif request.method == 'PUT':
   #     requestData = json.loads(request.data)
   #     answers = json.dumps(requestData["answers"]).replace('"',"''")
   #     print(answers)
   ##     conn = get_db()
   #     g.db.execute(f"""UPDATE tblUserSubmission
   #                         SET UserAnswers = "{answers}" WHERE (AssignmentID,StudentID) = ("{this_assignment_id}","{this_studentID}")  ;""")
    #    g.db.commit()
    #    return{"status":200}
#
#REFACTOR WEBSITE => TWO NAVS FOR STUDENT / TEACHER??
#

	    #SET QuestionText = "dsw" WHERE QuestionSetID = "TestSet2kk" AND QuestionNumber = 3;
