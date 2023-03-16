import { getCookie, getResource, InputField, ListOfObjects, fetchProtected } from "../../../variousUtils.tsx";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react"
import React from "react";
import { markAsUntransferable } from "worker_threads";

async function getDataForMarking(setQuestionList,setAnswers,setMarks){
    const URLForSubmission = window.location.href
    
    try{
        let resJson = await fetchProtected(URLForSubmission,{method:"GET"})
        setQuestionList(resJson.questions)
        if(resJson.answers != "NULLANSWERS"){
            let userAnswers = JSON.parse(resJson.answers)
            console.log(userAnswers)
            setAnswers(userAnswers)
        }
        if(resJson.marks != "NullMarks"){
            let userMarks = JSON.parse(resJson.marks)
            setMarks(userMarks)
        }
    } 
    catch{
        console.log("FAIL!!")
    }
}


async function returnSubmission(marks,setStatus){
    const URLForSubmission= window.location.href 
    try{
        let requestParams = {method:'PUT',
                         body:JSON.stringify({marks:marks})}
        let resJson = await fetchProtected(URLForSubmission,requestParams)
        setStatus(resJson.status)
    }
    catch{
        console.log("Failed to make API call")
    }
}




function QuestionView(props){
    let questionNum = props.num
    let setMarkForQuestion= props.setMarkForQuestion
    let q = props.question
    let mark:number = props.mark
    return(
        <div style={{width:"50%",backgroundColor:"#242424b8", padding:"30px",outline:"solid",outlineColor:"rgba(255, 255, 255, 0.42)",}}>
            <h3>{q.questionText}</h3>
            <h3>Answer: {q.questionAnswer}</h3>
            <h3>User answered: {q.userAnswer}</h3>
            <h3>Max marks: {q.marksAvailable}</h3>
            {(q.marksAvailable === 1)? 
              (
              <>
              <button onClick={() => {setMarkForQuestion(questionNum + 1,(mark + 1) % 2)}}>{mark===0?"Award mark": "Remove mark"}</button>
              <p>Marks given: {mark}</p>
              </>
              )
             :(
            <>
             <InputField minValue={0} maxValue={q.marksAvailable}type="number" inputValue={mark} setter={(e) => setMarkForQuestion(questionNum + 1,e)} placeholder="Marks to award"/>
             <p>Marks given: {mark}</p>
            </>)
              }
        </div>
    )
}


function MarkSubmission(){
    const [marks,setMarks] = useState({})
    const [questionList,setQuestionList] = useState([])
    const [answers,setAnswers] = useState({})
    const [questionNumber,setQuestionNumber] = useState(1)
    const [status,setStatus] = useState(-1)
    const urlParams = new URLSearchParams(window.location.search)
    let studentID = urlParams.get("student")
    let assignmentID = urlParams.get("assignment")
    const returnAssignmentURL = `/return-submission?student=${studentID}&assignmentID=${assignmentID}`
    const changeQuestion = (increment,max) =>{             //Handles incrementing of questions
        let newVal = increment + questionNumber
        if(newVal <= 0){                                   //Back to last if going back from 1
            newVal = max
        }
        else if(newVal > max){                             //Back to start if going forward from last question
            newVal -= max
        }
        setQuestionNumber(newVal)
    }

    function setMarkForQuestion(number,mark){
        let currentState = {...marks}
        currentState[number] = mark
        setMarks(currentState)
    }
    useEffect((() => {getDataForMarking(setQuestionList,setAnswers,setMarks)}),[])
    
    let questionsForView = questionList.map((question,index) => <QuestionView num={index}
                                                                              question={question}
                                                                              userAnswer={answers[String(index+1)]}
                                                                              setMarkForQuestion={setMarkForQuestion}
                                                                              mark={marks[questionNumber] || 0}
                                                                              marksAwarded = {marks}
                                                                              setMarksAwarded ={setMarks}
                                                                              />)
                                                                
    return(
        <header className="App-header">
            <h1>{studentID} {assignmentID}</h1>
            <h1> Question {questionNumber} of {questionList.length}</h1>
            {questionList.length > 0 ? questionsForView[questionNumber - 1]
             :
             null}
            <div>
                <button onClick={() => {changeQuestion(-1, questionList.length)}}>Previous</button>
                <button style ={{margin:"10px"}} onClick={() => changeQuestion(1, questionList.length)}> Next </button>
            </div>
            <button onClick={() => {returnSubmission(marks,setStatus)}}>Return to user</button>
            {status===200? 
            <>
            <p>Successs</p>
            </>:null}
        </header>
    )
}

export default MarkSubmission;