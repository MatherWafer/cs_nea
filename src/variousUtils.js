import {Navigate,Link} from "react-router-dom"
function getCookie(nameOfCookie){
    let nameToFind = nameOfCookie +"=";
    let cleanedCookie = decodeURIComponent(document.cookie)
    let listOfCookies = cleanedCookie.split(";")

    for (let i = 0; i<listOfCookies.length; i++){
        let thisCookie = listOfCookies[i];

        while(thisCookie.charAt(0) === ' '){
            thisCookie = thisCookie.substring(1)
        }
        if (thisCookie.indexOf(nameToFind) === 0){
            return thisCookie.substring(nameToFind.length, thisCookie.length)
        }
    }
}

const TeacherTab = ({component}) => {
    if (getCookie("isTeacher") === "true"){
        return component
    }
    return <Navigate to="/teacher-login" replace/>
}

const StudentTab = ({component}) => {
    if (getCookie("userName") !== "notSet" && getCookie("isTeacher") === "false"){
        return component
    }
    return <Navigate to="/login" replace/>
}

function Navigation(props){
    let navData = props.navData
    return <>
        {navData.map(x => <a><Link to={x.url}>{x.prompt}</Link></a>)}
        </>
}

function TextInput(props){
    let inputValue = props.inputValue
    let setter = props.setter
    let placeholder= props.placeholder
    let type = props.type
    if (!type){
        type = "text"
    }
    return(
        <input type={type}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setter(e.target.value)}/>
    )
}

//PARAMETERISE GETTING LISTS OF OBJECTS???
//  PASS IN URL, RETURN PARSED LIST
//  Pass in descriptor text for each attribute, manageLink as optional argument? 
//  Use Object.getOwnPropertyNames + Squarebracket nottaion
//  K.getOwnPropertyNames().map(x => <p> {prompts[x]: K[x]})


/*
    async function getResource(resourceURL,resourceName){
        let res = await fetch(resourceURL)
        let resJson = await fetch res.json()
        let listOfResources = resJson[resourceName].map((x) => JSON.parse(x))
        return listOfStudents
    }

    function ObjectOverview(props){
        let thisObject = props.thisObject
        let listOfKeys = thisObject.getOwnPropertyNames()
        let prompts = props.prompts
        let manageURL = props.manageURL
        return{
            
        }
    }
*/

async function getResource(resourceURL,resourceName,setter){
    let res = await fetch(resourceURL)
    let resJson = await res.json()
    let resourceList = resJson[resourceName].map((x) => JSON.parse(x))
    setter(resourceList)
}

function ObjectOverview(props){
    let thisObject = props.thisObject
    let listOfKeys = Object.getOwnPropertyNames(thisObject)
    let prompts = props.prompts
    let manageURL = props.manageURL
    console.log(listOfKeys)
    return(
        <div className="listContent">
            {listOfKeys.map((x) => prompts[x]? (<p> {prompts[x]}: {thisObject[x]} </p>)
                                             : null)}
            {manageURL? <a><Link to={manageURL}>Manage</Link></a>:null}
        </div>
    )
}

function ListOfObjects(props){
    let resourceList = props.resourceList
    let prompts = props.prompts
    let baseManageURL = props.baseManageURL
    let identifier = props.identifier
    return(
        /*
        <div>
            {students.map((x) => StudentOverview(x))}
        </div>
        */
       <div>
            {resourceList.map((x) => <ObjectOverview 
                thisObject={x} 
                prompts={prompts}
                manageURL={baseManageURL + x[identifier]}
                />)}
       </div>
    )
}



export {getCookie,TeacherTab,StudentTab,Navigation,TextInput,getResource,ObjectOverview, ListOfObjects };