import { json } from "react-router-dom";
import { getCookie , ListOfObjects, getResource} from "../../variousUtils.tsx";
import { useEffect, useState } from "react";


async function viewListOfSkills(setListOfSkills,user){
    let skillURL = `/skills?user=${user}`;
    getResource(skillURL,"skills",setListOfSkills)
}
    
function ViewStats(){
    const user = getCookie("userName")
    const [listOfSkills,setListOfSkills] = useState([])
    const statPrompts ={SubjectName:"Subject Name:",
                        TotalCorrect:"Number of questions answered correctly",
                        TotalAnswered:"Questions answered",
                        PercentCorrect: "Percent correct:"}
    useEffect(() => {viewListOfSkills(setListOfSkills,user)},[])
    return(
        <header className="App-header">
            <button onClick={() => console.log(listOfSkills)}>HIegwjipjS</button>
            <ListOfObjects resourceList={listOfSkills} prompts={statPrompts} baseManageURL="/view-milestones?skillName=" identifier="SubjectName"/>
            <p>{[listOfSkills.map(x => JSON.stringify(x))]}</p>
        </header>
    )
}

export default ViewStats;