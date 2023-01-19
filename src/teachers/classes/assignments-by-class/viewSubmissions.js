import { getCookie, getResource, InputField, ListOfObjects } from "../../../variousUtils";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react"
import React from "react";

async function getSubmissions(setSubmissionList){
    let URLParams = new URLSearchParams(window.location.search)
    let assignmentID = URLParams.get('assignment')
    getResource(`/view-submissions?assignment=${assignmentID}`,"submissions",setSubmissionList)
}

async function getStudents(setStudentlist){
    let URLParams = new URLSearchParams(window.location.search)
    let classID = URLParams.get('classID')
    getResource(`/manage-class?class=${classID}`,"students",setStudentlist)
}

function SubmissionsAsList(props){
    let submissionList = props.submissionList
    let URLParams = new URLSearchParams(window.location.search)
    let assignmentID = URLParams.get('assignment')
    let baseMarkURL = `/mark-submission?assignment=${assignmentID}&student=`
    return(
        <table style={{padding:"10px"}}>
            <tr>
                <td>Name</td>
                <td>Submitted on:</td>
            </tr>
            {submissionList.map((x) =>
                <tr style={{}}>
                    <td>{x.Forename} {x.Surname}</td>
                    {
                        x.DateSubmitted != "1970-01-01"?
                            <td><Link to={baseMarkURL + x.StudentID}>{x.DateSubmitted}</Link></td>
                        :
                            <td>Not submitted</td>
                    }   
                </tr>)}
        </table>
    )
    }
function ViewSubmissions(){
    const [submissionList,setSubmissionList] = useState([])
    const [studentList,setStudentlist] = useState([])
    const submittedIDs = submissionList.map((x) => x.StudentID)
    useEffect((() => {getSubmissions(setSubmissionList)}),[])
    useEffect((() => {getStudents(setStudentlist)}),[])
    const submissionPrompts={Forename: "Forename",
                             Surname: "Surname",
                             UserAnswers: "Answers",
                             DateSubmitted: "Submitted on"}
    return(
        <header className ="App-header">
            <button onClick={() => console.log(studentList)}>HI</button>
            <SubmissionsAsList submissionList={submissionList} ></SubmissionsAsList>
         </header>
    )
}
export default ViewSubmissions;