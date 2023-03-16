import React, { useState, useEffect} from 'react';
import {Link,Navigate} from "react-router-dom"
import {getCookie, InputField, useToken, checkStoredToken} from '../variousUtils.tsx'

interface TeacherLoginProps{
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
    setIsTeacher: React.Dispatch<React.SetStateAction<boolean>>
}

const checkIfAlreadyLoggedIn = async () =>{
    let [isSignedIn,isTeacher] = await checkStoredToken()
    if (isSignedIn){
        window.location.href = "/"
    }
}

function TeacherLogin(props:TeacherLoginProps){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [response,setResponse] = useState(0)
    const {setToken, token, removeToken} = useToken()
    const msgs =  {
             209: <p style={{color:"white"}}>That username does not exist</p>,
             400: <p style={{color:"#CC0000"}}>Incorrect Password.</p>
    }

    const submitLoginDetails = async (event) => {
        console.log("Here we go");
        const request_content = {
            "method": 'POST',
            "body": JSON.stringify({
                teacherID: username,
                pwd:password
            }),
        }
        event.preventDefault();
        let res = await fetch("/teacher-login", request_content);
        console.log("Received response");
        console.log(res);

        
        try{
            let resJson = await res.json();
            console.log("Received status");
            if (resJson.status === 200)
            {
                console.log("Successful Login")
                console.log(resJson["user-data"])
                let teacherData = JSON.parse(resJson["user-data"]);
                document.cookie = `userName=${teacherData.TeacherID}`
                document.cookie = `forename=${teacherData.Forename}`
                document.cookie = `surname=${teacherData.Surname}`
                props.setIsTeacher(true)
                props.setSignedIn(true)
                console.log(resJson.access_token)
                setToken(resJson.access_token)
                document.cookie = "isTeacher=true"
                window.location.href = "/"
            }
            else if(resJson.status === 400){
                console.log("Incorrect Password")
            }
            else if(resJson.status === 209){
                console.log("User does not exist")
            }
            setResponse(resJson.status);
        }
        catch(err){
            console.log(err)
        }
        }
    
    useEffect(()=>{checkIfAlreadyLoggedIn()},[])
    return (
        <div className='App'>
            <header className="App-header">
                <h1>Teacher log in:</h1>
                <li><Link to="/teacher-register">Teacher Register</Link></li>
                <form onSubmit={submitLoginDetails}>
                    <InputField inputValue={username} setter={setUsername} placeholder="Username"/>
                    <InputField inputValue={password} setter={setPassword} placeholder="Password" type="password"/>
                    <button type="submit">Log in</button>
                </form>
                {msgs[response]}

            </header>
        </div>
    )
}

export default TeacherLogin;