import { useEffect, useState } from 'react'
import ViewAssignments from './students/assignments/viewAssignments.tsx'
import Homepage from './students/home-login/homepage.tsx'
import Login from './students/home-login/login.tsx'
import Registration from './students/home-login/registration.tsx'
import GraphIntersect from './students/questions/graphsIntersection.tsx'
import ViewStats from './students/datascience/viewstats.tsx'
import './styles/App.css'
import AssignmentsNav from './teachers/assignments/assignmentsNav.tsx'
import CreateAssignment from './teachers/assignments/createAssignment.tsx'
import ClassesNav from './teachers/classes/classesNav.tsx'
import CreateClass from './teachers/classes/createClass.tsx'
import ManageClass from './teachers/classes/manageClass.tsx'
import SelectClass from './teachers/classes/selectClass.tsx'
import CreateQuestionSet from './teachers/questionSets/createQuestionSet.tsx'
import ManageQuestionSet from './teachers/questionSets/manageQuestionSet.tsx'
import QuestionSetNav from './teachers/questionSets/questionsNav.tsx'
import SelectQuestionSet from './teachers/questionSets/selectQuestionSet.tsx'
import TeacherHomepage from './teachers/teacherHomepage.tsx'
import TeacherLogin from './teachers/teacherLogin.tsx'
import TeacherRegistration from './teachers/teacherRegistration.tsx'


import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom"
import DoAssignment from './students/assignments/doAssignment.tsx'
import SubmitAssignment from './students/assignments/submitAssignment.tsx'
import ChooseTopics from './students/practice/chooseTopics.tsx'
import DoPracticeMode from './students/practice/doPracticemode.tsx'
import PracticeNav from './students/practice/practiceNav.tsx'
import KruskalsAlgorithm from './students/questions/graphsKruskal.tsx'
import MarkSubmission from './teachers/classes/assignments-by-class/markSubmissions.tsx'
import ReturnSubmission from './teachers/classes/assignments-by-class/returnSubmission.tsx'
import ViewSubmissions from './teachers/classes/assignments-by-class/viewSubmissions.tsx'
import EditQuestion from './teachers/questionSets/editQuestion.tsx'
import { StudentTab, TeacherTab, fetchProtected, getCookie, checkStoredToken } from './variousUtils.tsx'
import ViewMilestone from './students/datascience/viewMilestones.tsx'
import { rmSync } from 'fs'

const logoutUser = async (setSignedIn,setIsTeacher) => {
  let currentToken = localStorage.getItem('token')
  let resJSON = await fetchProtected('/logout',{method:'POST'})
  document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  console.log(resJSON)
  if (resJSON.status == 200){
    setSignedIn(false)
    setIsTeacher(false)
    localStorage.removeItem('token')
    window.location.href = '/'
  }
}

interface LogoutButtonProps{
  setSignedIn: (boolean) => void
  setIsTeacher: (boolean) => void
}


function Navbar(props){
  return props.signedIn ?
    (props.isTeacher?
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
    )
    :
    <></>
}



const setLoginFromStoredToken = async (setSignedIn,setIsTeacher) =>{
  let [signedIn,isTeacher] = await checkStoredToken()
  setSignedIn(signedIn)
  setIsTeacher(isTeacher)
}

function App() {
  const [isTeacher, setIsTeacher] = useState(false);
  const [signedIn,setSignedIn] = useState(false)

  useEffect(() => {setLoginFromStoredToken(setSignedIn,setIsTeacher)},[])
  return (
    <Router>
      <div style={{backgroundColor:"#222222"}}>
        <Navbar isTeacher={isTeacher} signedIn={signedIn}/>
        {signedIn && <button onClick={() => logoutUser(setSignedIn,setIsTeacher)}>Log out </button>}
        <Routes>
          {/*
            ROUTES FOR STUDENT SIDE
          */}
          <Route path='/' element={signedIn?(!isTeacher?<StudentTab component={<Homepage/>}/>: <TeacherTab component={<TeacherHomepage/>}/>):<Login setSignedIn={setSignedIn}/>}/>
          <Route path='/registration' element= {<Registration/>}/>
          <Route path='/login' element={<Login setSignedIn={setSignedIn}/>}/>

          {/* 
          --------------------------------------------------------------------------------------------------------------------------------
          Routes for assignments
          */}
          <Route path='/assignments' element={<StudentTab component={<ViewAssignments/>}/>}/>
          <Route path='/do-assignment' element={<StudentTab component={<DoAssignment/>}/>}/>
          <Route path='/submit-assignment' element={<StudentTab component={<SubmitAssignment/>}/>}/>

          {/*
          -------------------------------------------------------------------------------------------------------------------------------- 
          Routes for skill levels & milestones
        */}
          <Route path='/skills' element={<StudentTab component={<ViewStats/>}/>}/>
          <Route path='/view-milestones' element={<StudentTab component={<ViewMilestone/>}/>}/>

            {/*
          -----------------------------------------------------------------------------------------------------------
          Routes for Practice
        */}
          <Route path='/startPractice' element={<StudentTab component={<PracticeNav/>}/>}/>
          <Route path='/choose-topics' element={<StudentTab component={<ChooseTopics/>}/>}/>
          <Route path='/practice-mode' element={<StudentTab component={<DoPracticeMode/>}/>}/>
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

          <Route path='/teacher-login' element={<TeacherLogin setIsTeacher={setIsTeacher} setSignedIn={setSignedIn}/>}/>
          <Route path='/teacher-register' element={<TeacherRegistration/>}/>
          <Route path='/teacher-homepage' element={<TeacherHomepage/>}/>
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