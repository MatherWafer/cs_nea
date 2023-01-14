import { useState } from "react";
import { getCookie, getResource, InputField, ListOfObjects } from "../../variousUtils";
function getQuestionList(setQuestionList){
    let URLParams = new URLSearchParams(window.location.search)
    let questionSetID = URLParams.get('questionSetID')
    const setsURL= `/manage-questionSet?questionSetID=${questionSetID}`
    getResource(setsURL,"questions",setQuestionList)
}

function ManageQuestionSet(){
    const [questionList,setQuestionList] = useState([])
    const questionPrompts={
     QuestionNumber: "Question",
     QuestionText: "txt"
    }
    return(
        <header className="App-header">
            <button type="submit" onClick={() => getQuestionList(setQuestionList)}>HELP</button>
            <ListOfObjects resourceList={questionList} prompts={questionPrompts}/>
        </header>
    )
}

export default ManageQuestionSet;