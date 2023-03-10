import React, { useState, useEffect} from 'react';
import { getCookie, Navigation } from '../../variousUtils.tsx';
import {
    Link
  } from "react-router-dom";
  
function AssignmentsNav(){
  let navData = [{url: "/questionSets-nav", prompt: "Question Sets"},
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