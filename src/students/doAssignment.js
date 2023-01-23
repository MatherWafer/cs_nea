import { getCookie, getResource, InputField, ListOfObjects } from '../variousUtils.js'
import { Link } from "react-router-dom";
import {useEffect, useState, useReducer} from "react"
import React from "react";




/*

    QuestionView(props: int questionNumber)

    render(questionTextList[questionNumber])

    InputField (type = math input)
    button onClick = set Answers[questionNumber] = userAnswer 
    LeftButton onClick = setQnum(-= 1)
    Rightbutton onClick = setQnum(+= 1)

*/

async function getSubmission(setQuestionList,setAnswers,setCompletion){
    const URLForSubmission= window.location.href + `&student=${getCookie("userName")}`
    let res = await fetch(URLForSubmission,{method:"GET"})
    try{
        let resJson = await res.json()  
        setQuestionList(resJson.questions)
        if(resJson.answers != "NULLANSWERS"){
            let newAnswers = JSON.parse(resJson.answers)
            setAnswers(newAnswers)
        }
        if(resJson.returned === 1){
            setCompletion("returned")
        }
        else if (resJson.dateSubmitted != "1970-01-01"){
            setCompletion("pending")
        }
    } 
    catch{
        console.log("FAIL!!")
    }
}

async function getDataForReview(setMarksAwarded,setCorrectAnswers){
    let URLParams = new URLSearchParams(window.location.search)
    let assignmentID = URLParams.get("assignmentID")
    const URLForReview = `/review-submission?assignment=${assignmentID}&student=${getCookie("userName")}`
    let res = await fetch(URLForReview,{method:"GET"})
    try{
        let resJson = await res.json()  
        if(resJson.answers != "NULLANSWERS"){
            setMarksAwarded(JSON.parse(resJson.marks))
            setCorrectAnswers(resJson.solutions)
        }}
    catch{
        console.log("FAIL!!")
    }    
}

async function submitAnswers(answers, setStatus){
    const URLForSubmission = window.location.href + `&student=${getCookie("userName")}`
    try{
        let res = await fetch(URLForSubmission,{method:"PUT",
                                                body:JSON.stringify({answers:answers})})
        let resJson = await res.json()
        setStatus(resJson.status)
    }
    catch{
        console.log("Server errror")
    }
}

/*
    props
    props.setAnswerForQuestion(num,answer)
*/
function QuestionView(props){
    const [answer,setAnswer] = useState("")
    return(
        <>
        {(!props.reviewMode)?
            <div style={{width:"50%",backgroundColor:"#002466b8", padding:"30px",outline:"solid",outlineColor:"rgba(255, 255, 255, 0.42)",}}>
                <h3>{props.questionText}</h3>
                <InputField inputValue={answer} setter={setAnswer} placeholder="Answer here"/>
                <button onClick={() => {props.setAnswerForQuestion(props.num,answer)}}>Save answer</button>
            </div>
        :
            <div style={{width:"50%",backgroundColor:"#006624b8", padding:"30px",outline:"solid",outlineColor:"rgba(255, 255, 255, 0.42)",}}>
                <h3>{props.questionText}</h3>
                <p>Solution: {props.solution}</p>
                <p>Yout put: {props.userAnswer}</p>
                <p>Marks received: {props.marksAwarded} {props.marksAwarded === 0? "LOLOLOLOL": null}</p>
            </div>
        }
        </>
    )
}



function DoAssignment(){
    const [questionNumber,setQuestionNumber] = useState(1)
    const [questionList, setQuestionList] = useState([])
    const [answers,setAnswers] = useState({})
    const [status,setStatus] = useState(-1)
    const [completion,setCompletion] = useState("")
    const [marksAwarded, setMarksAwarded] = useState({})
    const [correctAnswers,setCorrectAnswers] = useState({})
    let URLParams = new URLSearchParams(window.location.search)
    let assignmentID = URLParams.get('assignmentID')
    const submitLink = `/submit-assignment?assignment=${assignmentID}`
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

    function setAnswerForQuestion(number,answer){
        let currentState = {...answers}
        currentState[number] = answer
        setAnswers(currentState)
    }

    useEffect(() =>{getSubmission(setQuestionList,setAnswers, setCompletion)},[])
    useEffect((()=>{
        if(completion==="returned"){
            getDataForReview(setMarksAwarded,setCorrectAnswers)
        }
    }),[completion])
    switch (completion){
        case "":
            return(
                <header className="App-header">
                    <h1> Question {questionNumber} of {questionList.length}</h1>
                    <QuestionView num={questionNumber} questionText={questionList[questionNumber - 1]} setAnswerForQuestion={setAnswerForQuestion}/>
                    <div>
                        <button onClick={() => {changeQuestion(-1, questionList.length)}}>Previous</button>
                        <button style ={{margin:"10px"}} onClick={() => changeQuestion(1, questionList.length)}> Next </button>
                    </div>
                    <button onClick={() => {console.log(answers)}}>Check answers</button>
                        <button onClick={() => {submitAnswers(answers,setStatus)}}>Save answers </button>
                    {status===200?<p>Submitted</p> : null}
                    <button><Link to={submitLink}>Submit</Link></button>
                </header>
                )
        case 'returned':
            return(
                <header className="App-header">
                    <h1>Review of answers:</h1>
                    <h1> Question {questionNumber} of {questionList.length}</h1>
                    <QuestionView userAnswer={answers[questionNumber]} reviewMode={true} solution={correctAnswers[questionNumber - 1]} marksAwarded={marksAwarded[questionNumber]} num={questionNumber} questionText={questionList[questionNumber - 1]} setAnswerForQuestion={setAnswerForQuestion}/>
                    <div>
                        <button onClick={() => {changeQuestion(-1, questionList.length)}}>Previous</button>
                        <button style ={{margin:"10px"}} onClick={() => changeQuestion(1, questionList.length)}> Next </button>
                    </div>

                </header>
            )
        case 'pending':
            return(
                <header className="App-header" style={{backgroundColor:"#FF0000"}}>
                    <h1>WHAT THE FUCK IS WRONG WITH YOU!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1.</h1>
                </header>
            )
    }
}


export default DoAssignment;
