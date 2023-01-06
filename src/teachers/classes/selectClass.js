import { getCookie } from "../../variousUtils";
import { Link } from "react-router-dom"
import { useState } from "react"


function ClassOverview(props){
    const className = props.ClassName
    const classID = props.ClassID
    const classURL = `/manage-class?class=${classID}`
    return <div className="listContent">
        <p>{className}</p>
        <a><Link to={classURL}>Manage Class</Link></a>
    </div>

}


async function getClasses(setClasses){
    const teacherID = getCookie("userName")
    let res = await fetch (`/select-class?user=${teacherID}`)
    let resJson = await res.json()
    let parsedClasses = resJson.classes.map(x=>JSON.parse(x))
    setClasses(parsedClasses)
}




function SelectClass(){
    const [classes,setClasses] = useState([])
    return(
    <header className="App-header">
        <button type="submit" onClick={() => getClasses(setClasses)}>Get classes</button>
        {classes.map(x => ClassOverview(x))}
    </header>
    )
}



export default SelectClass;





//REFACTOR TOMORROW. FIRST CREATE SELECT CLASS SCREEN - COMPONENT TAKES IN CLASS AS A PROP AND RETURNS LINK TO MANAGE THAT CLASS. SAME IDEA FOR STUDENTS