import { getCookie, getResource, InputField, ListOfObjects } from "../../../variousUtils";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react"
import React from "react";

async function getDataForMarking(setQuestionList,setAnswers,setMarks){
    const URLForSubmission = window.location.href
    let res = await fetch(URLForSubmission,{method:"GET"})
    try{
        let resJson = await res.json()  
        setQuestionList(resJson.questions)
        if(resJson.answers != "NULLANSWERS"){
            let userAnswers = JSON.parse(resJson.answers)
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
    console.log(URLForSubmission)
    try{
        let requestParams = {method:'PUT',
                         body:JSON.stringify({marks:marks})}
        let res = await fetch(URLForSubmission,requestParams)
        let resJson = await res.json()
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
    let questionText = q.questionText
    let questionAnswer =  q.questionAnswer
    let maxMarks = q.marksAvailable
    let userAnswer = props.question.userAnswer
    const [mark,setMark] = useState(0)
    return(
        <div style={{width:"50%",backgroundColor:"#242424b8", padding:"30px",outline:"solid",outlineColor:"rgba(255, 255, 255, 0.42)",}}>
            <h3>{questionText}</h3>
            <h3>Answer: {questionAnswer}</h3>
            <h3>User answered: {props.userAnswer}</h3>
            <h3>Max marks: {maxMarks}</h3>
            <InputField minValue={0} maxValue={maxMarks}type="number" inputValue={mark} setter={setMark} placeholder="Marks to award"/>
            <button onClick={() => {setMarkForQuestion(questionNum,mark)}}>SaveMarks</button>
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
    return(
        <header className="App-header">
            <h1>{studentID} {assignmentID}</h1>
            <h1> Question {questionNumber} of {questionList.length}</h1>
            {questionList.length > 0 ? <QuestionView num={questionNumber}
                                         question={questionList[questionNumber - 1]} 
                                         userAnswer={answers[questionNumber]}
                                         setMarkForQuestion={setMarkForQuestion}/>
             :
             null}
            <div>
                <button onClick={() => {changeQuestion(-1, questionList.length)}}>Previous</button>
                <button style ={{margin:"10px"}} onClick={() => changeQuestion(1, questionList.length)}> Next </button>
            </div>

            <button onClick={()=>{console.log(questionList)}}>QUESTIOSN</button>
            <button onClick={() =>{console.log(answers)}}>ANSWERS</button>
            <button onClick={() => {console.log(marks)}}>Marks</button>
            <button><Link to={returnAssignmentURL}>Return assignment</Link></button>
            <button onClick={() => {returnSubmission(marks,setStatus)}}>HI</button>
            {status===200? <p>Successs</p>:null}
        </header>
    )
}

export default MarkSubmission;