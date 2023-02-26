import Registration from './students/registration.tsx'
import Login from './students/login.tsx'
import Homepage from './students/homepage.tsx'
import ViewStats from'./students/viewstats.tsx'
import ViewAssignments from './students/viewAssignments.tsx'
import StartPractice from './students/startPractice.jsx'
import TeacherLogin from './teachers/teacherLogin.tsx'
import TeacherRegistration from './teachers/teacherRegistration.tsx'
import TeacherHomepage from './teachers/teacherHomepage.tsx'
import ClassesNav from './teachers/classes/classesNav.tsx'
import CreateClass from './teachers/classes/createClass.tsx'
import SelectClass from './teachers/classes/selectClass.tsx'
import ManageClass from './teachers/classes/manageClass.tsx'
import AssignmentsNav from './teachers/assignments/assignmentsNav.tsx'
import QuestionSetNav from './teachers/questionSets/questionsNav.tsx'
import CreateQuestionSet from './teachers/questionSets/createQuestionSet.tsx'
import SelectQuestionSet from './teachers/questionSets/selectQuestionSet.tsx'
import ManageQuestionSet from './teachers/questionSets/manageQuestionSet.tsx'
import CreateAssignment from './teachers/assignments/createAssignment.tsx'
import GraphIntersect from './students/questions/graphsIntersection.tsx'
import './styles/App.css';
import React, { useState, useEffect} from 'react';


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import {getCookie, StudentTab, TeacherTab } from './variousUtils.tsx'
import ViewSubmissions from './teachers/classes/assignments-by-class/viewSubmissions.tsx'
import EditQuestion from './teachers/questionSets/editQuestion.tsx'
import DoAssignment from './students/doAssignment.tsx'
import SubmitAssignment from './students/submitAssignment.tsx'
import MarkSubmission from './teachers/classes/assignments-by-class/markSubmissions.tsx'
import ReturnSubmission from './teachers/classes/assignments-by-class/returnSubmission.tsx'
import PracticeNav from './students/practiceNav.tsx'
import KruskalsAlgorithm from './students/questions/graphsKruskal.tsx'



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
          <Route path='/do-assignment' element={<StudentTab component={<DoAssignment/>}/>}/>
          <Route path='/submit-assignment' element={<StudentTab component={<SubmitAssignment/>}/>}/>
          <Route path='/skills' element={<StudentTab component={<ViewStats/>}/>}/>
          <Route path='/startPractice' element={<StudentTab component={<PracticeNav/>}/>}/>


          {/*
          -----------------------------------------------------------------------------------------------------------
          Routes for Questions
        */}
          <Route path="/graphs" element={<GraphIntersect/>}/>
          <Route path="/kruskals-algorithm" element={<KruskalsAlgorithm/>}/>
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
          <Route path="/create-assignment" element={<TeacherTab component={<CreateAssignment/>}/>}/>
          <Route path="/view-submissions" element={<TeacherTab component={<ViewSubmissions/>}/>}/>
          <Route path="/mark-submission" element={<TeacherTab component={<MarkSubmission/>}/>}/>
          <Route path="/return-submission" element={<TeacherTab component={<ReturnSubmission/>}/>}/>
          {/*
            Routes for question sets functionality
          */}
          <Route path="/questionSets-nav" element={<TeacherTab component={<QuestionSetNav/>}/>}/>
          <Route path="/create-questionSet" element={<TeacherTab component={<CreateQuestionSet/>}/>}/>
          <Route path="/select-questionSet" element={<TeacherTab component={<SelectQuestionSet/>}/>}/>  
          <Route path="/manage-questionSet" element={<TeacherTab component={<ManageQuestionSet/>}/>}/>
          <Route path="/edit-question" element={<TeacherTab component={<EditQuestion/>}/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;