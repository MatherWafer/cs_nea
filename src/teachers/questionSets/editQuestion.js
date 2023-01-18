import { useEffect, useState } from "react";
import { getCookie, getResource, InputField, ListOfObjects } from "../../variousUtils";



async function getQuestionText(setPreviousText){
    const URLForQuestion = window.location.href
    getResource(URLForQuestion,"questionText",setPreviousText)
}

async function setNewText(textToAdd, setStatus, setQuestionText){
    const URLForQuestion = window.location.href
    let requestParams = {
        method:'PUT',
        body:JSON.stringify({
            newText:textToAdd
        })
    }
    let res = await fetch(URLForQuestion, requestParams)
    try{
        let resJson = await res.json()
        setStatus(resJson.status)
        setQuestionText(textToAdd)
    }
    catch{
        setStatus(-1)
    }
}

function EditQuestion(){
    const [textToAdd,setTextToAdd] = useState("")
    const [previousText,setPreviousText] = useState("")
    const [status,setStatus] = useState(0)
    useEffect((() => {getQuestionText(setPreviousText)}),[])
    return(
        <header className="App-header">
            <h1>Edit question</h1>
            <p>Previous text: {previousText}</p>
            <InputField inputValue={textToAdd} setter={setTextToAdd} placeholder="New question text:"></InputField>
            <button onClick={() => setNewText(textToAdd, setStatus, setPreviousText)}>HI</button>
            {status===200? <p>Submitted!</p>:null}
        </header>
    )
}

export default EditQuestion;