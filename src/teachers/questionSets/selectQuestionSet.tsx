import { useEffect, useState } from "react";
import { getCookie, getResource, InputField, ListOfObjects } from "../../variousUtils.tsx";


function getListOfSets(setListOfSets){
    let teacherID = getCookie("userName")
    const setsURL= `/select-questionSet?teacherID=${teacherID}`
    getResource(setsURL,"questionSets",setListOfSets)
}

function SelectQuestionSet(){
    const[listOfSets,setListOfSets] = useState([])
    const questionSetPrompts={NoOfQuestions:"Number of questions",
                        SetName: "Set name"}
    const baseSetURL = "/manage-questionSet?questionSetID="
    useEffect((()=>{getListOfSets(setListOfSets)}),[])
    return(
        <header className="App-header">
            <button type="submit" onClick={() => console.log(listOfSets)}>HELP</button>
            <ListOfObjects  resourceList={listOfSets} prompts={questionSetPrompts} baseManageURL={baseSetURL} identifier="QuestionSetID"/>
        </header>
    )
}


export default SelectQuestionSet;