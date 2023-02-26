import { getCookie, getResource, ListOfObjects } from "../../variousUtils.tsx";
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"


function ClassOverview(props){
    const className = props.ClassName
    const classURL = `/manage-class?class=`
    const classID = props.ClassID
    return <div className="listContent">
        <p>{className}</p>
        <a><Link to={classURL}>Manage Class</Link></a>
    </div>

}


async function getClasses(setClasses){
    let teacherID = getCookie("userName")
    getResource(`/select-class?user=${teacherID}`,"classes",setClasses)
}




function SelectClass(){
    const [classes,setClasses] = useState([])
    useEffect((()=>{getClasses(setClasses)}),[])
    const classURL = `/manage-class?class=`
    const classPrompts={"ClassID":"Name"}
    return(
    <header className="App-header">
        <h1>Classes:</h1>
        <ListOfObjects resourceList={classes} prompts={classPrompts} baseManageURL={classURL} identifier="ClassID" />
    </header>
    )
}



export default SelectClass;





//REFACTOR TOMORROW. FIRST CREATE SELECT CLASS SCREEN - COMPONENT TAKES IN CLASS AS A PROP AND RETURNS LINK TO MANAGE THAT CLASS. SAME IDEA FOR STUDENTS