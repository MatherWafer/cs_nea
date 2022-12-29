import Registration from './students/registration.js'
import Login from './students/login.js'
import Homepage from './students/homepage.js'
import ViewStats from'./students/viewstats.js'
import ViewAssignments from './students/viewAssignments.js'
import StartPractice from './students/startPractice.js'
import TeacherLogin from './teachers/teacherLogin.js'
import TeacherRegistration from './teachers/teacherRegistration.js'
import TeacherHomepage from './teachers/teacherHomepage.js'
import './styles/App.css';
import React, { useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import {getCookie, StudentTab, TeacherTab } from './variousUtils.js'




function App() {
  const [isTeacher, setIsTeacher] = useState(false);
  function Navbar(){
    return isTeacher ?
      <nav>
        <ul>
          <li><Link to="/teacher-homepage">Homepage</Link></li>
        </ul>
      </nav>
    :
      <nav>
        <ul>
          <li><Link to="/registration">Registration</Link></li>
          <li><Link to="/">Homepage</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
  }
  
  return (
    <Router>
      <div style={{backgroundColor:"#222222"}}>
        <Navbar></Navbar>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/registration' element= {<Registration/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/view-stats' element={<StudentTab component={<ViewStats/>}/>}/>
          <Route path='/assignments' element={<StudentTab component={<ViewAssignments/>}/>}/>
          <Route path='/skills' element={<StudentTab component={<ViewStats/>}/>}/>
          <Route path='/startPractice' element={<StudentTab component={<StartPractice/>}/>}/>
          <Route path='/teacher-login' element={<TeacherLogin setIsTeacher={setIsTeacher}/>}/>
          <Route path='/teacher-register' element={<TeacherRegistration/>}/>
          <Route path='teacher-homepage' element={<TeacherTab component={<TeacherHomepage/>}/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;