import Registration from './students/registration.js'
import Login from './students/login.js'
import Homepage from './students/homepage.js'
import ViewStats from'./students/viewstats.js'
import ViewAssignments from './students/viewAssignments.js'
import StartPractice from './students/startPractice.js'
import TeacherLogin from './teachers/teacherLogin.js'
import TeacherRegistration from './teachers/teacherRegistration.js'
import TeacherHomepage from './teachers/teacherHomepage.js'
import ClassesNav from './teachers/classes/classesNav.js'
import CreateClass from './teachers/classes/createClass.js'
import SelectClass from './teachers/classes/selectClass.js'
import ManageClass from './teachers/classes/manageClass.js'
import AssignmentsNav from './teachers/assignments/assignmentsNav.js'
import QuestionSetNav from './teachers/assignments/questions/questionsNav.js'
import CreateQuestionSet from './teachers/assignments/questions/createQuestionSet.js'
import './styles/App.css';
import React, { useState, useEffect} from 'react';


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import {getCookie, StudentTab, TeacherTab } from './variousUtils.js'
import SelectQuestionSet from './teachers/assignments/questions/selectQuestionSet.js'
import ManageQuestionSet from './teachers/assignments/questions/manageQuestionSet.js'





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
      <nav className="noBullet">
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

          {/*
            ROUTES FOR STUDENT SIDE
          */}
          <Route path='/' element={<Homepage/>}/>
          <Route path='/registration' element= {<Registration/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/view-stats' element={<StudentTab component={<ViewStats/>}/>}/>
          <Route path='/assignments' element={<StudentTab component={<ViewAssignments/>}/>}/>
          <Route path='/skills' element={<StudentTab component={<ViewStats/>}/>}/>
          <Route path='/startPractice' element={<StudentTab component={<StartPractice/>}/>}/>


          {/*
          --------------------------------------------------------------------------------------------------------------------
            ROUTES FOR TEACHER SIDE
          */}

          <Route path='/teacher-login' element={<TeacherLogin setIsTeacher={setIsTeacher}/>}/>
          <Route path='/teacher-register' element={<TeacherRegistration/>}/>
          <Route path='/teacher-homepage' element={<TeacherTab component={<TeacherHomepage/>}/>}/>
          {/*
            Routes for teacher class functionality
          */}
          <Route path='/classes-nav' element={<TeacherTab component= {<ClassesNav/>}/>}/>
          <Route path='/create-class' element={<TeacherTab component={<CreateClass/>}/>}/>
          <Route path='/select-class' element={<TeacherTab component={<SelectClass/>}/>}/>
          <Route path='/manage-class' element={<TeacherTab component={<ManageClass/>}/>}/>
          {/*
            Routes for assignment functionality
          */}
          <Route path="/assignments-nav" element={<TeacherTab component={<AssignmentsNav/>}/>}/>

          {/*
            Routes for question sets functionality
          */}
          <Route path="/questionSets-nav" element={<TeacherTab component={<QuestionSetNav/>}/>}/>
          <Route path="/create-questionSet" element={<TeacherTab component={<CreateQuestionSet/>}/>}/>
          <Route path="/select-questionSet" element={<TeacherTab component={<SelectQuestionSet/>}/>}/>  
          <Route path="/manage-questionSet" element={<TeacherTab component={<ManageQuestionSet/>}/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;