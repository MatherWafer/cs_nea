import { useEffect, useState } from "react";
import { getCookie, getResource, InputField, ListOfObjects } from "../../variousUtils.tsx";
function getQuestionList(setQuestionList) {
    let URLParams = new URLSearchParams(window.location.search)
    let questionSetID = URLParams.get('questionSetID')
    const setsURL = `/manage-questionSet?questionSetID=${questionSetID}`
    getResource(setsURL, "questions", setQuestionList)
}

function ManageQuestionSet() {
    const [questionList, setQuestionList] = useState([])
    const questionPrompts = {
        QuestionNumber: "Question",
        QuestionText: " "
    }
    let URLParams = new URLSearchParams(window.location.search)
    let questionSetID = URLParams.get('questionSetID')
    const baseQuestionURL = `/edit-question?questionSetID=${questionSetID}&questionNumber=`
    useEffect((() => { getQuestionList(setQuestionList) }), [])
    return (
        <header className="App-header">
            <ListOfObjects resourceList={questionList}
                prompts={questionPrompts}
                baseManageURL={baseQuestionURL}
                identifier="QuestionNumber" />
        </header>
    )
}

export default ManageQuestionSet;