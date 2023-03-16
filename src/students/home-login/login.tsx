import React, { useState, useEffect} from 'react';
import {Link, Navigate} from "react-router-dom"
import {getCookie, InputField, useToken, checkStoredToken} from "../../variousUtils.tsx";
import { prependOnceListener } from 'process';

const checkIfAlreadyLoggedIn = async (setSignedIn) =>{
    let [isSignedIn,isTeacher] = await checkStoredToken()
    if (isSignedIn){
        setSignedIn(true)
    }
}


const testQuery = async (token) => {
    let authHeader = {
        Authorization :'Bearer ' + token
    }
    let res = await fetch('/jwt-test',{headers:authHeader,body:JSON.stringify({A:"HI"}),method:'POST'})
    let resJson = await res.json()
}

interface LoginProps{
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
}

function Login(props:LoginProps){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [response,setResponse] = useState(0)
    const [signedIn,setSignedIn] = useState(false)
    const { token, removeToken, setToken } = useToken();
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
                let userToken = resJson.access_token
                const endDate = new Date();
                endDate.setTime(endDate.getTime() + (2*24*60*60*1000));
                let endTime = endDate.toUTCString()
                //document.cookie = `userName=${studentData.StudentID};expires=${endTime}`
                setToken(userToken)
                props.setSignedIn(true)
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
    useEffect(() => {checkIfAlreadyLoggedIn(setSignedIn)},[])
    return(!signedIn?
    <div className='App'>
        <header className="App-header">
            <h1>Log in</h1>
            <form onSubmit={submitLoginDetails}>
                <InputField inputValue={username} setter={setUsername} placeholder={"Username"}/>
                <InputField inputValue={password} setter={setPassword} placeholder="Password" type="password"/>
                <button type="submit">Log in</button>
            </form>
            <button onClick={() => {testQuery(token)}}>cheky</button>
            <button onClick={() => {console.log(token)}}>check token</button>
            <button onClick ={removeToken}>Unfortunate</button>
            <li><Link to="/teacher-login">Teacher login</Link></li>
        </header>
    </div>
    :
    <Navigate to="/"/>
    )

}

export default Login;