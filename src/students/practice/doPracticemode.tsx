import { Link, Navigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import KruskalsAlgorithm from "../questions/graphsKruskal.tsx";
import GraphIntersect from "../questions/graphsIntersection.tsx";
import { JsxElement } from "typescript";
import { parse } from "path";
const assignmentsToQuestions = {
    "KruskalAlgorithm": KruskalsAlgorithm,
    "GraphIntersections": GraphIntersect
}

function PracticeQuestion(props){
    return (
    <>
    {props.component}    
    </>
    )
}

function isEmptyObj(obj){
    for (var x in obj){return false}
    return true;
}

function setQuestionAmounts(){
    const URLparams = new URLSearchParams(window.location.search)
    let questionNumbers = {}
    for(const questionType of Object.keys(assignmentsToQuestions)){
        const amountForQuestionType = Number(URLparams.get(questionType) )
        if (amountForQuestionType){
            questionNumbers[questionType] = amountForQuestionType
        }
    }
    return questionNumbers
}

function getQuestionsInList(questionTypesAndCounts: {[qType:string]:number}, setUserResult:(any) => void, questionsCorrect:any):JSX.Element[]{
    let questions = new Array
    let qIndex = 0
    for(const typeAndCount of Object.entries(questionTypesAndCounts)){
        for(let i = 0; i < typeAndCount[1]; i++){
            let CurComponent= assignmentsToQuestions[typeAndCount[0]]
            questions.push(<CurComponent key={qIndex} setResult={setUserResult} qNum ={qIndex} questionsCorrect={questionsCorrect}/>)
            qIndex ++
            //questions.push(assignmentsToQuestions[typeAndCount[0]]({key:i,setResult:((isCorrect:boolean) => setUserResult(i,isCorrect))}))
        }
    }
    return questions;
}

function DoPracticeMode() {
    const[numsOfQuestions, setNumsOfQuestions] = useState<{[qName:string]:number} | {}>(setQuestionAmounts())
    const [questionsCorrect,setQuestionsCorrect] = useState<(boolean|null)[]>((new Array(Object.values(numsOfQuestions).reduce((x,i)=> x+ i,0))).fill(null))
    const setUserResult = (questionNumber:number,isCorrect:boolean) => {
        setQuestionsCorrect([
            ...questionsCorrect.slice(0,questionNumber),
            isCorrect,
            ...questionsCorrect.slice(questionNumber)

        ])
    }

    const [questionComponentsInList,setQuestions] = useState(getQuestionsInList(numsOfQuestions,setQuestionsCorrect,questionsCorrect))
    const [questionNumber,setQuestionNumber] = useState<number>(0)
    const incNum = (step) =>{
        let newQnum = questionNumber + step
        if(0 <= newQnum && newQnum < questionComponentsInList.length){
            setQuestionNumber(questionNumber + step)
        }
    }
    return (
        <header className="App-header">
            {!questionsCorrect.includes(null)?<button>Submit</button>:<p>Attempt every question to submit.</p>}
            <h1>Question {questionNumber + 1} / {questionComponentsInList.length}</h1>
            <button onClick={() => console.log(numsOfQuestions)}>I</button>
            <button onClick={() => console.log(questionsCorrect)}>H</button>
            <button onClick={() => {incNum(-1)}}>Previous</button>
            <button onClick={() => {incNum(1)}}>Next</button>
            <div style={{display:"flex"}}>
            {questionComponentsInList ?  [...Array(questionComponentsInList.length).keys()].map(x => <button onClick={() => setQuestionNumber(x)}>{x+1} {questionsCorrect[x]? "✔️" : questionsCorrect[x] === false?"❌":null}</button>)
                                      :null}
            <button onClick={() => console.log(questionsCorrect)}>HI</button>
            </div>                                    
            
            {questionComponentsInList ? questionComponentsInList.map((x,index) =>{
                                        let CurrentComponent = questionComponentsInList[index]
                                        return (
                                        <div style={index !=questionNumber ?{display:'none'}:undefined}>
                                            {CurrentComponent}
                                        </div>)})
                                      : null}

        </header>
    )
}



export default DoPracticeMode;