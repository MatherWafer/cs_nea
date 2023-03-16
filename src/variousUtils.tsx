import {useState, Component } from "react";
import {Navigate,Link} from "react-router-dom"



const checkStoredToken = async ():Promise<[boolean,boolean]> => {
    let storedToken = localStorage.getItem('token')
    console.log(storedToken)
    if (storedToken != null){
        let authHeader = {
          Authorization: 'Bearer ' + storedToken
        }
        let res = await fetch('/check-stored-token',{headers:authHeader})
        let resJSON = await res.json()
        if (resJSON.status == 200){
          return [true,resJSON["is_teacher"]]
        }
    }
      return [false,false]
  }


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
    return null
}

interface TabProps{
    component:JSX.Element
}

const TeacherTab = (props:TabProps) => {
    /*if(getCookie("isTeacher") === "true"){
        return props.component
    }*/
    return props.component
    return <Navigate to="/teacher-login" replace/>
}

const StudentTab = (props:TabProps) => {
    /*if (getCookie("userName") !== "notSet" && getCookie("isTeacher") === "false"){
        return props.component
    }*/
    return props.component
    return <Navigate to="/login" replace/>
}

interface NavigationProps {
    navData: {url:string,
               prompt:string}[]
}

function Navigation(props:NavigationProps){
    let navData = props.navData
    return <>
        {navData.map(x => <a><Link to={x.url}>{x.prompt}</Link></a>)}
        </>
}


interface numFieldProps{
    inputValue:number
    setter: (number) => void
    placeholder: number
    minValue: number
    maxValue?: number
    type:string
}

interface identifiedObject{
    identifier:string
    displayName:string
}

interface SelectFieldProps<Type>{
    inputValue:string
    setter:(string) => void
    options: Type[]
    identifier?: Type extends Object ? string: never
    displayName?: Type extends Object ? string: never
    type?: string
}


function InputField(props){
    let inputValue = props.inputValue
    let setter = props.setter
    let placeholder= props.placeholder
    let type = props.type
    if (!type){
        type = "text"
    }
    if (type === "select"){
        let options = props.options
        if (typeof options[0] === "object"){
            let identifier = props.identifier
            let displayName = props.displayName
            return(
                <select value={inputValue} onChange={(e) => setter(e.target.value)}>
                    {options.map((x) => <option value={x[identifier]}> {x[displayName]}</option>)}
                </select>
            )}
        else if (typeof options[0] === "string"){
            return(
                <select value={inputValue} onChange={(e) => setter(e.target.value)}>
                    {options.map((x) => <option value={x}> {x}</option>)}
                </select>
            )
        }
    }
    else{
        let minValue = props.minValue
        let maxValue = props.maxValue
    return(
        <input type={type}
        value={inputValue}
        min={minValue}
        max={maxValue}
        placeholder={placeholder}
        onChange={(e) => setter(type==="number"?parseInt(e.target.value):e.target.value)}/>
    )}
    return(
        <></>
    )
}

function  SelectField(props:SelectFieldProps<string> | SelectFieldProps<object>){
    return InputField(props)
}


function NumberField(props:numFieldProps){
    return InputField(props)
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

async function getResource(resourceURL,resourceName,setter,multipleResources=false){
    let bearerField = 'Bearer ' + localStorage.getItem('token')
    let authHeader = {Authorization: bearerField}
    let res = await fetch(resourceURL, {headers:authHeader, method:'GET'})
    let resJson = await res.json()
    if (resJson.status === 401){
        window.location.href= "/"
        return
    }
    if(!multipleResources){
        if(typeof resJson[resourceName] === "object"){
            let resourceList = resJson[resourceName].map((x) => JSON.parse(x))
            setter(resourceList)
        }
        else{
            let resource = resJson[resourceName]
            setter(resource)
        }
    }
    else{
        resourceName.forEach((resource) => {
            setter[resource](resJson[resource])});
    }
}

async function fetchProtected (url,options){
    let bearerField = 'Bearer ' + localStorage.getItem('token')
    options.headers = {Authorization: bearerField}
    let res = await fetch(url,options)
    let resJSON = await res.json()
    if (resJSON.status === 501){
        window.location.href = "/"
    }
    else{
        return resJSON
    }
}


interface objectListProps{

    resourceList:object[]
    prompts:{[propertyName:string]:string}
    baseManageURL: string
    identifier:string
}

function ObjectOverview(props){
    let thisObject = props.thisObject
    let listOfKeys = Object.getOwnPropertyNames(thisObject)
    let prompts = props.prompts
    let manageURL = props.manageURL
    return(
        <div style={{    width: "calc(33% - 2em)"}}className="listContent">
            {listOfKeys.map((x) => prompts[x]? (<p> {prompts[x]} {thisObject[x]} </p>)
                                             : null)}
            {manageURL? <a style={{
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign:"center",}}><Link to={manageURL}>Manage</Link></a>:null}
        </div>
    )
}

function ListOfObjects(props:objectListProps){
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
       <div style={{margin:"auto", display:'flex',flexDirection:'row',gap:"30px",flexWrap:"wrap",width:"50%"}}>
            {resourceList.map((x) => <ObjectOverview 
                thisObject={x} 
                prompts={prompts}
                manageURL={baseManageURL + x[identifier]}
                />)}
       </div>
    )
}



function useToken() {

  function getToken() {
    const userToken = localStorage.getItem('token');
    return userToken && userToken
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  function removeToken() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return {
    setToken: saveToken,
    token,
    removeToken
  }

}






export {getCookie,TeacherTab,StudentTab,Navigation,InputField, SelectField, NumberField, getResource,ObjectOverview, ListOfObjects, useToken, fetchProtected, checkStoredToken};
