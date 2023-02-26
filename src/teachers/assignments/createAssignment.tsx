import React, { useState, useEffect} from 'react';
import { getCookie, getResource, InputField } from '../../variousUtils.tsx';
import {
    Link
  } from "react-router-dom";
  


async function createAssignment(e, assignmentID, classID, questionSetID,today, dateDue, setSubmitStatus){
  e.preventDefault();
  try{
    let res = await fetch("/create-assignment",{
      body: JSON.stringify({
        assignmentID:assignmentID,
        classID:classID,
        questionSetID:questionSetID,
        dateSet:today,
        dateDue:dateDue
      }),
      method:'POST',
      headers: {contentType: 'application/json'}
    })
    let resJson = await res.json();
    setSubmitStatus(resJson.status)
  }
  catch{
    console.log("Failed to parse response")
    setSubmitStatus(300)
  }
}

function CreateAssignment(){
  //Initialise state
  const [assignmentID,setAssignmentID] = useState("")
  const [classID,setClassID] = useState("")
  const [dateDue,setDateDue] = useState("")
  const [questionSetID, setQuestionSetID] = useState("")
  const [classList, setClassList] = useState([])
  const [questionSetList, setQuestionSetList]  = useState([])
  const [submitStatus,setSubmitStatus] = useState(0)
  let teacherID = getCookie("userName")
  //Get lists to be selected from
  const classURL = `/select-class?user=${teacherID}`
  const questionSetURL = `/select-questionSet?teacherID=${teacherID}`
  useEffect( (() => {getResource(classURL,"classes",setClassList)}),[]  ) //Get list of classes to select from
  useEffect( (() => {getResource(questionSetURL, "questionSets", setQuestionSetList)}),[]) //As above but for questionSets
  const msgs= {200: <p style={{color:"green"}}>Successfully set {assignmentID}</p>,
  409: <p style={{color:"#CC0000"}}>An assignment already exists with that assignment code</p>,
  300: <p style={{color:"#C60000"}}>Error talking to our server</p>
  }
  let today = new Date().toISOString().split("T")[0];
  return(
    <header className="App-header">
      <h1>Create an assignment</h1>
      <form onSubmit={(e) => createAssignment(e, assignmentID,classID, questionSetID,today, dateDue, setSubmitStatus)}>
        <InputField inputValue={assignmentID} setter={setAssignmentID} placeholder="Assignment ID"/>
        <label>Due date:
        <InputField inputValue={dateDue} setter={setDateDue} type="date" minValue={today}></InputField>
        </label>
        <label>
          Class:
        <InputField type="select" inputValue={classID} setter={setClassID} options={classList} identifier="ClassID" displayName="ClassName"/>
        </label>
        <label>
          Question Set:
        <InputField type="select" inputValue={questionSetID} setter={setQuestionSetID} options={questionSetList} identifier="QuestionSetID" displayName="SetName"/>
        </label>
        <button type="submit" >Submit</button>
      </form>      
      {msgs[submitStatus]}
    </header>
  )
}


export default CreateAssignment;
