import React, { useState, useEffect} from 'react';
import {Link} from "react-router-dom"
import getCookie from '../cookieutils.js';

function Login(){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [response,setResponse] = useState(0)

    const msgs =  {200: (   <>
                            <p style={{color:"#00CC00"}}>Welcome!</p>
                            <li><Link to='/'>Access Homepage</Link></li>
                            </>),
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
                let studentData = JSON.parse(resJson["user-data"]);
                document.cookie = `userName=${studentData.TeacherID}`
                document.cookie = `forename=${studentData.Forename}`
                document.cookie = `surname=${studentData.Surname}`
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
    
    
    return getCookie('userName') === "notSet" ?
        <div className='App'>
            <header className="App-header">
                <h1>Teacher log in:</h1>
                <form onSubmit={submitLoginDetails}>
                    <input type="text"
                        value={username}
                        onChange= {(e) => (setUsername(e.target.value))}
                        placeholder = "Username"
                    />
                    <input type="password"
                        value={password}
                        onChange = {(e) => (setPassword(e.target.value))}
                        placeholder = "Password  "
                    />
                    <button type="submit">Log in</button>
                </form>
                {msgs[response]}

            </header>
        </div>


        :
        <header className='App-header'>
            <h1>Logged in!</h1>
            <li><Link to="/">Homepage</Link></li>
        </header>
    

    
}

export default Login;