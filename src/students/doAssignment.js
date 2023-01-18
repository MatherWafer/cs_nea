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

async function getSubmission(setQuestionList,setAnswers){
    const URLForSubmission= window.location.href + `&student=${getCookie("userName")}`
    let res = await fetch(URLForSubmission,{method:"GET"})
    try{
        let resJson = await res.json()  
        setQuestionList(resJson.questions)
        if(resJson.answers != "NULLANSWERS"){
            let newAnswers = JSON.parse(resJson.answers)
            setAnswers(newAnswers)
        }
    } 
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
    let questionNum = props.num
    let setAnswerForQuestion = props.setAnswerForQuestion
    let questionText = props.questionText
    const [answer,setAnswer] = useState("")
    return(
        <div style={{width:"50%",backgroundColor:"#242424b8", padding:"30px",outline:"solid",outlineColor:"rgba(255, 255, 255, 0.42)",}}>
            <h3>{questionText}</h3>
            <InputField inputValue={answer} setter={setAnswer} placeholder="Answer here"/>
            <button onClick={() => {setAnswerForQuestion(questionNum,answer)}}>Save answer</button>
        </div>
    )
}



function DoAssignment(){
    const [questionNumber,setQuestionNumber] = useState(1)
    const [questionList, setQuestionList] = useState([])
    const [answers,setAnswers] = useState({})
    const [status,setStatus] = useState(-1)
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

    useEffect((() =>{getSubmission(setQuestionList,setAnswers)}),[])
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
}


export default DoAssignment;
