import React, { useState, useEffect} from 'react';
import {Link, Navigate} from "react-router-dom"
import {getCookie, InputField} from "../../variousUtils.tsx";

function Login(){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [response,setResponse] = useState(0)

    const msgs =  
            {209: <p style={{color:"white"}}>That username does not exist</p>,
             400: <p style={{color:"#CC0000"}}>Incorrect Password.</p>
            }

    const submitLoginDetails = async (event) => {
        const request_content = {
            "method": 'POST',
            "body": JSON.stringify({
                studentID: username,
                pwd:password
            }),
        }
        event.preventDefault();
        let res = await fetch("/login", request_content);

        
        try{
            let resJson = await res.json();
            if (resJson.status === 200)
            {
                let studentData = JSON.parse(resJson["user-data"]);
                const endDate = new Date();
                endDate.setTime(endDate.getTime() + (2*24*60*60*1000));
                let endTime = endDate.toUTCString()
                document.cookie = `userName=${studentData.StudentID};expires=${endTime}`
                document.cookie = `forename=${studentData.Forename};expires=${endTime}`
                document.cookie = `surname=${studentData.Surname};expires=${endTime}`
                document.cookie = `isTeacher=false;expires=${endTime}`
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
    
    return getCookie('userName') === null?
    <div className='App'>
        <header className="App-header">
            <h1>Log in</h1>
            <form onSubmit={submitLoginDetails}>
                <InputField inputValue={username} setter={setUsername} placeholder={"Username"}/>
                <InputField inputValue={password} setter={setPassword} placeholder="Password" type="password"/>
                <button type="submit">Log in</button>
            </form>
            {msgs[response]}
            <li><Link to="/teacher-login">Teacher login</Link></li>
        </header>
    </div>
    :
    <header className='App-header'>
        <h1>Logged in!</h1>
        <Navigate to="/">Homepage</Navigate>
    </header>

}

export default Login;