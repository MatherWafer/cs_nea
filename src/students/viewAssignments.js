import { useEffect, useState } from "react";
import { json } from "react-router-dom";
import {getCookie, getResource, ListOfObjects} from '../variousUtils.js'


async function getAssignments(setAssignmentList){
    const user = getCookie("userName")
    let assignmentsURL = `/assignments?user=${user}`
    getResource(assignmentsURL,"assignments",setAssignmentList)

}
 

function ViewAssignments(){
    const user = getCookie("userName")
    const [assignmentList,setAssignmentList] = useState([])
    let assignmentPrompts={AssignmentID:"ID:",
                           DateDue:"Due on:"}
    const baseAssignmentURL = "/do-assignment?assignmentID="
    useEffect((() => {getAssignments(setAssignmentList)}),[])
    return(
        <header className="App-header">
            <ListOfObjects resourceList={assignmentList} prompts={assignmentPrompts} baseManageURL= {baseAssignmentURL} identifier="AssignmentID"/>
        </header>
    )
}

export default ViewAssignments;
