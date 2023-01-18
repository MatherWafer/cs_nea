import React, { useState, useEffect} from 'react';
import {getCookie, Navigation} from '../variousUtils.js'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";


async function submitAssignment(setStatus){
    const URLForSubmission= window.location.href + `&student=${getCookie("userName")}`
    console.log(URLForSubmission)
    try{
        let res = await fetch(URLForSubmission,{method:'PUT'})
        let resJson = await res.json()
        setStatus(resJson.status)
    }
    catch{
        console.log("Failed to make API call")
    }
}

function SubmitAssignment(){
    const [status,setStatus] = useState(-1);
    useEffect((() => {submitAssignment(setStatus)}),[])

    return(
        <header className='App-header'>
            <h1>{status===-1?"Submitting...": "Submitted"}</h1>
            
        </header>
    )
}


export default SubmitAssignment;