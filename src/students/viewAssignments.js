import { useState } from "react";
import { json } from "react-router-dom";
import {getCookie} from '../variousUtils.js'
function ViewAssignments(){
    const user = getCookie("userName")
    const [assignmentList,setAssignmentList] = useState([])
    async function viewAssignment(){
        let res = await fetch(`/assignments?user=${user}`);
        let resJson = await res.json()
        console.log(resJson.assignments)
        setAssignmentList(resJson.assignments)
        console.log(assignmentList)
    }


    return(
        <header className="App-header">
            <button onClick={viewAssignment}>Load Assignments</button>
            <p>{[assignmentList]}</p>
        </header>
    )
}

export default ViewAssignments;