import React, { useState, useEffect} from 'react';
import {getCookie, InputField} from "../../variousUtils.tsx";
import {
    Link
  } from "react-router-dom";
  

  
async function createQuestionSet(event,questionSetID,numberOfQuestions,questionSetDescription){
    let teacherID = getCookie("userName")
    event.preventDefault();
    let resJson = await fetch("/create-questionSet",{
        method:'POST',
        body:JSON.stringify({
            questionSetID:questionSetID,
            teacherID: teacherID,
            numberOfQuestions:numberOfQuestions,
            questionSetDescription: questionSetDescription
        })
    })
}


function CreateQuestionSet(){
    const [questionSetID, setQuestionSetID] = useState("")
    const [numberOfQuestions,setNumberOfQuestions] = useState(5)
    const [questionSetDescription, setQuestionSetDescription] = useState("")

    return(
        <header className='App-header'>
            <form onSubmit = {(e) => createQuestionSet(e,questionSetID,numberOfQuestions,questionSetDescription)}>
                <InputField inputValue={questionSetID} setter={setQuestionSetID} placeholder="Question set ID"/>
                <InputField inputValue={numberOfQuestions} type="number" setter={setNumberOfQuestions} placeholder="Number of questions(Default is 5)"/>
                <InputField inputValue={questionSetDescription} setter={setQuestionSetDescription} placeholder={"Name / description of question set"}/>
            <button type="submit">Create</button>
            </form>
        </header>
    )
    }

export default CreateQuestionSet;