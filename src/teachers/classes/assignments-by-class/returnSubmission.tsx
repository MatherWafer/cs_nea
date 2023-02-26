import React, { useState, useEffect} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";


async function returnSubmission(setStatus){
    const URLForSubmission= window.location.href 
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

function ReturnSubmission(){
    const [status,setStatus] = useState(-1);
    useEffect((() => {returnSubmission(setStatus)}),[])

    return(
        <header className='App-header'>
            <h1>{status===-1?"Submitting...": "Submitted"}</h1>
            
        </header>
    )
}


export default ReturnSubmission;