import { getCookie } from "../../variousUtils";
import { Link } from "react-router-dom";
import {useState} from "react"
import React from "react";



//LIST OF STUDENTS => MANAGE EACH STUDENT
//LIST OF ASSIGNMENTS => ADD AN ASSIGNMENT.


async function getStudents(setStudents){
    let  URLParams = new URLSearchParams(window.location.search)
    let classID = URLParams.get('class')

    let res = await fetch(`/get-students?class=${classID}`)
    let resJson = await res.json()
    let listOfStudents = resJson.students.map((x) => JSON.parse(x))

    setStudents(listOfStudents)
    
}

function StudentOverview(props){
    let studentID = props.studentID
    let studentName = `${props.Forename} ${props.Surname}`
    let studentLink = `/manage-student?class=${studentID}`
    return(
        <div className="listContent">
        <p>{studentName}</p>
        <a><Link to={studentLink}>Manage student</Link></a>
        </div>
    )
    }
function StudentList(props){
    let students = props.students
    return(
        <div>
            {students.map((x) => StudentOverview(x))}
        </div>
    )
}

async function getAssignments(setAssignments){
    let URLParams = new URLSearchParams(window.location.search)
    let classID = URLParams.get('class')

    let res = await fetch(`/get-assignments?class=${classID}`)
    let resJson = await res.json()
    let listOfAssignments= resJson.assignments.map((x) => JSON.parse(x))
    
    setAssignments(listOfAssignments)
}

function AssignmentOverview(props){
    let assignmentID = props.AssignmentID
    let noOfQuestions = props.NoOfQuestions
    return(
        <div className="listContent">
            <p> {assignmentID}</p>
            <p> Number of questions: {noOfQuestions}</p>
        </div>
    )
}

function AssignmentList(props){
    let assignments = props.assignments;
    return(<div>
        {assignments.map(x => AssignmentOverview(x))}
    </div>)
}

function ManageClass(){
    const [students,setStudents] = useState([])
    const [assignments,setAssignments] = useState([])
    let classID = 15;
    return(
        <header className="App-header">
            <button type="submit" onClick={() => getStudents(setStudents)}>Get students</button>
            <StudentList students={students}></StudentList>
            <button type="submit" onClick={() => getAssignments(setAssignments)}>Get assignments</button>
            <AssignmentList assignments ={assignments}></AssignmentList>
        </header>
    )
}

export default ManageClass;