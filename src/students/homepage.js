import React, { useState, useEffect} from 'react';
import {getCookie, Navigation} from '../variousUtils.js'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
var Latex = require('react-latex');
function Homepage (){
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
        let navData = [{url:"/assignments", prompt:"Assignments"},
                       {url:"/skills", prompt:"Skills"},
                       {url:"/startPractice", prompt:"Start practice"}]
        console.log("Getting name cookies")
        let forename = getCookie("forename");
        console.log("Got forename")
        let surname = getCookie("surname");
        console.log("Got Surname")
        return( <div className='App'>
                <header className='App-header'>
                    <h1>Hi {forename} {surname}</h1>
                    <Navigation navData={navData}/>
                </header>
                </div>
        )
    }
}
export default Homepage;