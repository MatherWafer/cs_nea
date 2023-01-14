import React, { useState, useEffect} from 'react';
import {getCookie, Navigation} from '../variousUtils.js'
import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";
  
function TeacherHomepage (){
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
        let forename = getCookie("forename");
        let surname = getCookie("surname");
        console.log("Got Surname")
        const navData = [{url:"/assignments-nav",prompt:"Assignments"},
                         {url:"/classes-nav",prompt:"Classes"},
                         {url: "/questionSets-nav", prompt: "Question Sets"}]
        return( <div className='App'>
                <header className='App-header'>
                    <h1>Hi {forename} {surname}</h1>
                    <p>YIPPEE!</p> 
                    <Navigation navData={navData}/>
                </header>
                </div>
        )
    }
}
export default TeacherHomepage;