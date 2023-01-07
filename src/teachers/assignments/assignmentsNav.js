import React, { useState, useEffect} from 'react';
import { getCookie } from '../../variousUtils';
import {
    Link
  } from "react-router-dom";
  
function AssignmentsNav(){
  return (
    <div className='App'>
            <header className='App-header'>
                <h1>Assignments</h1>
                <a><Link to="/select-assignment">View existing assignments</Link></a>
                <a><Link to="/create-assignment">Create an assignment</Link></a>
            </header>
        </div>
)}

export default AssignmentsNav;