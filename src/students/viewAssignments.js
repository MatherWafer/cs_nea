import { useState } from "react";
import { json } from "react-router-dom";
import {getCookie} from '../variousUtils.js'


async function viewAssignment(setAssignmentList,user){
    let res = await fetch(`/assignments?user=${user}`);
    let resJson = await res.json()
    setAssignmentList(resJson.assignments.map(x =>JSON.parse(x)))
}


function ViewAssignments(){
    const user = getCookie("userName")
    const [assignmentList,setAssignmentList] = useState([])
    return(
        <header className="App-header">
            <button onClick={() => viewAssignment(setAssignmentList,user)}>Load Assignments</button>
            <p>{[assignmentList.map(x => JSON.stringify(x))]}</p>
        </header>
    )
}

export default ViewAssignments;