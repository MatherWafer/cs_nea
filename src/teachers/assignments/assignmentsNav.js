import React, { useState, useEffect} from 'react';
import { getCookie, Navigation } from '../../variousUtils';
import {
    Link
  } from "react-router-dom";
  
function AssignmentsNav(){
  let navData = [{url: "/questionSets-nav", prompt: "Question Sets"},
                 {url: "/select-assignment", prompt: "View existing assignments"},
                 {url: "/create-assignment", prompt: "Create an assignment"}]
  return (
    <div className='App'>
            <header className='App-header'>
                <h1>Assignments</h1>
                <Navigation navData={navData}/>
            </header>
        </div>
)}

export default AssignmentsNav;