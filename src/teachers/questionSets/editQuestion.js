import { useEffect, useState } from "react";
import { getCookie, getResource, InputField, ListOfObjects } from "../../variousUtils";



async function getQuestionText(setPreviousText,setPrevMarks,setPrevSolution){
    const URLForQuestion = window.location.href
    getResource(URLForQuestion,["questionText","marks","solution"],{questionText:setPreviousText,
                                                                    marks:setPrevMarks,
                                                                    solution:setPrevSolution},true)
}

async function setNewText(textToAdd, newMarks, newSolution, setStatus, setQuestionText,setPrevMark, setPrevSolution){
    const URLForQuestion = window.location.href
    let requestParams = {
        method:'PUT',
        body:JSON.stringify({
            newText:textToAdd,
            newSolution:newSolution,
            newMarks:newMarks
        })
    }
    let res = await fetch(URLForQuestion, requestParams)
    try{
        let resJson = await res.json()
        setStatus(resJson.status)
        setQuestionText(textToAdd)
        setPrevMark(newMarks)
        setPrevSolution(newSolution)
    }
    catch{
        setStatus(-1)
    }
}

function EditQuestion(){
    const [textToAdd,setTextToAdd] = useState("")
    const [previousText,setPreviousText] = useState("")
    const [newMarks,setNewMarks] = useState(1)
    const [prevMarks,setPrevMarks] = useState(1)
    const [newSolution,setNewSolution] = useState("")
    const [prevSolution,setPrevSolution] = useState("")
    const [status,setStatus] = useState(0)
    useEffect((() => {getQuestionText(setPreviousText,setPrevMarks,setPrevSolution)}),[])
    return(
        <header className="App-header">
            <h1>Edit question</h1>
            <p>Previous text: {previousText}</p>
            <p>Previous marks: {prevMarks}</p>
            <p>Previous solution: {prevSolution}</p>
            <InputField inputValue={textToAdd} setter={setTextToAdd} placeholder="New question text:"></InputField>
            <InputField inputValue={newSolution} setter={setNewSolution} placeholder="New solution:"></InputField>
            <label>Marks <InputField type="number" minValue={1}  inputValue={newMarks} setter={setNewMarks}></InputField></label>
            <button onClick={() => setNewText(textToAdd,newMarks,newSolution, setStatus, setPreviousText, setPrevMarks,setPrevSolution)}>EDIT</button>
            {status===200? <p>Submitted!</p>:null}
        </header>
    )
}

export default EditQuestion;