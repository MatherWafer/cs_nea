import { json } from "react-router-dom";
import getCookie from '../cookieutils.js';
import { useState } from "react";
function ViewStats(){
    const user = getCookie("userName")
    const [listOfSkills,setListOfSkills] = useState("No skills so far...")
    async function viewListOfSkills(){
        let res = await fetch(`/skills?user=${user}`);
        let resJson = await res.json()
        console.log(resJson.skills)
        setListOfSkills(resJson.skills)
        console.log(listOfSkills)
    }


    return(
        <header className="App-header">
            <button onClick={viewListOfSkills}>Load Skills</button>
            <p>{[listOfSkills]}</p>
        </header>
    )
}

export default ViewStats;