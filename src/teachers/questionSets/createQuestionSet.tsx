import React, { useState, useEffect} from 'react';
import {getCookie, InputField, fetchProtected} from "../../variousUtils.tsx";
import {
    Link
  } from "react-router-dom";
  

  

async function createQuestionSet(event,questionSetID,numberOfQuestions,questionSetDescription, setResponse){
    let teacherID = getCookie("userName")
    event.preventDefault();
    let resJson = await fetchProtected("/create-questionSet",{
        method:'POST',
        body:JSON.stringify({
            questionSetID:questionSetID,
            teacherID: teacherID,
            numberOfQuestions:numberOfQuestions,
            questionSetDescription: questionSetDescription
        })
    })
    setResponse(resJson.status)
}


function CreateQuestionSet(){
    const [questionSetID, setQuestionSetID] = useState("")
    const [numberOfQuestions,setNumberOfQuestions] = useState(5)
    const [questionSetDescription, setQuestionSetDescription] = useState("")
    const [response,setResponse] = useState<null|number>(null)

    const msgs = {200:<p>Success!</p>, 409:<p>There is already a question set with that ID.</p>}

    return(
        <header className='App-header'>
            <form onSubmit = {(e) => createQuestionSet(e,questionSetID,numberOfQuestions,questionSetDescription,setResponse)}>
                <InputField inputValue={questionSetID} setter={setQuestionSetID} placeholder="Question set ID"/>
                <InputField inputValue={numberOfQuestions} type="number" setter={setNumberOfQuestions} placeholder="Number of questions(Default is 5)"/>
                <InputField inputValue={questionSetDescription} setter={setQuestionSetDescription} placeholder={"Name / description of question set"}/>
            <button type="submit">Create</button>
            </form>
            {response && msgs[response]}
        </header>
    )
    }

export default CreateQuestionSet;