import { json } from "react-router-dom";
import {getCookie} from '../variousUtils.js'
import { useState } from "react";


async function viewListOfSkills(setListOfSkills,user){
    let res = await fetch(`/skills?user=${user}`);
    let resJson = await res.json()
    setListOfSkills(resJson.skills.map(x => JSON.parse(x)))
}

function ViewStats(){
    const user = getCookie("userName")
    const [listOfSkills,setListOfSkills] = useState([])
    return(
        <header className="App-header">
            <button onClick={() => viewListOfSkills(setListOfSkills,user)}>Load Skills</button>
            <p>{[listOfSkills.map(x => JSON.stringify(x))]}</p>
        </header>
    )
}

export default ViewStats;