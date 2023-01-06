import React, { useState, useEffect} from 'react';
import {getCookie} from '../variousUtils.js'
import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";
  
function TeacherHomepage (){
    console.log(getCookie("userName"))
    console.log(document.cookie)
    if (getCookie("userName") === "notSet"){
        return(
            <header className='App-header'>
                <div>
                    <h1 style={{color:"white"}}>Not Logged in Yet</h1>
                    <li><Link to="/login">Log in</Link></li>
                </div>
            </header>
        )
    }
    else{
        console.log("Getting name cookies")
        let forename = getCookie("forename");
        console.log("Got forename")
        let surname = getCookie("surname");
        console.log("Got Surname")
        return( <div className='App'>
                <header className='App-header'>
                    <h1>Hi {forename} {surname}</h1>
                    <p>YIPPEE!</p> 
                    <a><Link to="/assignments-nav">Assignments</Link></a>
                    <a><Link to="/classes-nav">Classes</Link></a>
                </header>
                </div>
        )
    }
}
export default TeacherHomepage;