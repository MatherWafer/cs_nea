import { getCookie, getResource, InputField, ListOfObjects } from "../../variousUtils";
import { Link } from "react-router-dom";
import {useState} from "react"
import React from "react";


//LIST OF STUDENTS => MANAGE EACH STUDENT
//LIST OF ASSIGNMENTS => ADD AN ASSIGNMENT.


async function getStudents(setStudents){
    let  URLParams = new URLSearchParams(window.location.search)
    let classID = URLParams.get('class')
    getResource(`manage-class?class=${classID}`,"students",setStudents)
}

async function getAssignments(setAssignments){
    let URLParams = new URLSearchParams(window.location.search)
    let classID = URLParams.get('class')
    getResource(`get-assignments?class=${classID}`,"assignments",setAssignments)
}

function AssignmentOverview(props){
    let assignmentID = props.AssignmentID
    let dateSet = props.DateSet
    let dateDue = props.DateDue
    return(
        <div className="listContent">
            <p> {assignmentID}</p>
            <p> Date Set: {dateSet}</p>
            <p> Date Due: {dateDue}</p>
        </div>
    )
}

function AssignmentList(props){
    let assignments = props.assignments;
    return(<div>
        {assignments.map(x => AssignmentOverview(x))}
    </div>)
}

const enrollStudent = async (event,IDtoAdd) =>{
    let URLParams = new URLSearchParams(window.location.search)
    let classID = URLParams.get('class')
    event.preventDefault()
    try{
        let res = await fetch(`/manage-class?class=${classID}`,{
            method: 'PUT',
            body: JSON.stringify({studentID:IDtoAdd})
        });
        let resJson = await res.json()
        if (resJson.status === 200){
            console.log("All good")
        }
        else if (resJson.status === 404){
            console.log("That username does not exist")
        }
    }
    catch{
        console.log("FUCK")
    }
}

function ManageClass(){
    const [students,setStudents] = useState([])
    const [assignments,setAssignments] = useState([])
    const [IDtoAdd,setIDtoAdd] = useState("")
    let URLParams = new URLSearchParams(window.location.search)
    let classID = URLParams.get('class')
    const studentPrompts={
        Forename:"Forename",
        Surname:"Surname"
    }
    const baseStudentURL = "/manage-student?student="
    const assignmentPrompts={
        DateSet:"Date set",
        DateDue:"Date due"
    }
    const baseAssignmentURL =`/view-submissions?classID=${classID}&assignment=`
    //Add lastEnrolled,setLastEnrolled to give message to user after student has been enrolled.
    return(
        <header className="App-header">
            <button type="submit" onClick={() => getStudents(setStudents)}>Get students</button>
            <ListOfObjects resourceList={students}
                           prompts={studentPrompts}
                           baseManageURL={baseStudentURL}
                           identifier="StudentID"/>
            <button type="submit" onClick={() => getAssignments(setAssignments)}>Get assignments</button>
            <ListOfObjects resourceList={assignments}
                           prompts={assignmentPrompts}
                           baseManageURL={baseAssignmentURL}
                           identifier="AssignmentID"/>
            <p>Enrol a student:</p>
            <form>
                 <InputField inputValue={IDtoAdd} setter = {setIDtoAdd} placeholder={"ID of student to enrol"}/>
                 <button type="submit" onClick={(e) => enrollStudent(e,IDtoAdd)}>Enrol student</button>
            </form>
        </header>
    )
}

export default ManageClass;
/*
fetch('/manage-class?class=TESTCLASS',{
    method: 'PUT',
    body:JSON.stringify({
        studentID:"ASDA"
    })
})*/