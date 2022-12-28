import Registration from './students/registration.js'
import Login from './students/login.js'
import Homepage from './students/homepage.js'
import ViewStats from'./students/viewstats.js'
import ViewAssignments from './students/viewAssignments.js'
import StartPractice from './students/startPractice.js'
import TeacherLogin from './teachers/teacherLogin.js'
import './styles/App.css';
import React, { useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import getCookie from './cookieutils.js'



function App() {
  const logOut = () => {
    document.cookie = 'nae'
  }
  return (
    <Router>
      <div style={{backgroundColor:"#222222"}}>
        <nav >
          <ul>
            <li><Link to="/registration">Registration</Link></li>
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>


        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/registration' element= {<Registration/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/view-stats' element={<ViewStats/>}/>
          <Route path='/assignments' element={<ViewAssignments/>}/>
          <Route path='/skills' element={<ViewStats/>}/>
          <Route path='/startPractice' element={<StartPractice/>}/>
          <Route path='/teacher-login' element={<TeacherLogin/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;