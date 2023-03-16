import React, { useState, useEffect} from 'react';
import { fetchProtected, getCookie,Navigation } from "../../variousUtils.tsx";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";


async function submitAssignment(setStatus: (value:any) => void ){
    const URLForSubmission= window.location.href + `&student=${getCookie("userName")}`
    console.log(URLForSubmission)
    try{
        let resJson = await fetchProtected(URLForSubmission,{method:'PUT'})
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
            {status===200? <a><Link to="/assignments">Back to other assignments</Link></a>: null}
        </header>
    )
}


export default SubmitAssignment;