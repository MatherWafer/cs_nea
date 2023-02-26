import React, { useState, useEffect} from 'react';
import {BrowserRouter} from "react-router-dom";



function TeacherRegistration() {
    const [currentTime, setCurrentTime] = useState("Day?");
    const [success,setSuccess] = useState(false)
    const [hasSubmitted,setHasSubmitted] = useState(false)
    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
        setCurrentTime(data.time)
        });   
    }, []);
    

    function RegistrationFormMessage() {
    if (success  && hasSubmitted){
        return <p style={{color:"green"}}>Signed up!</p>
    }
    else if (!success && hasSubmitted){ 
        return <p style={{color:"red"}}>That username already exists. Please select another</p>
    }

    }


    function TeacherRegistrationForm() {
    const [teacherID,setTeacherID] = useState("")
    const [pwd,setPwd] = useState("")
    const [forename,setForename] = useState("")
    const [surname,setSurname] = useState("")

        const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            let res = await fetch("/teacher-register", {
            method: "POST",
            headers: {contentType: 'application/json'},
            body: JSON.stringify({
                teacherID: teacherID,
                pwd: pwd,
                forename: forename,
                surname: surname,
            }),
            });

            console.log("Fetched");
            console.log(res);
            try{
            let resJson = await res.json();
            console.log("Received response");
            console.log(resJson.status);
            if (resJson.status === 200)
            {
                setSuccess(true);
                console.log("Green light")
                console.log(`ID = ${resJson.submittedID}`)
            }
            else{
                setSuccess(false); 
                console.log("Fail");
            }
            setHasSubmitted(true);
            }

            catch(err){
            console.log("Failed to parse response");
            console.log(err)
            }
        }
        catch (err) {
            console.log(err)
        }
        }

        return (
        <>
        <h1> Register an account:</h1>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={teacherID}
            placeholder="Username"
            onChange={(e) => setTeacherID(e.target.value)}
            />
            <input
            type="text"
            value={forename}
            placeholder="Forename"
            onChange={(e) => setForename(e.target.value)}
            />

            <input
            type="text"
            value={surname}
            placeholder="Surname"
            onChange={(e) => setSurname(e.target.value)}
            />
            <input
            type="password"
            value={pwd}
            placeholder = "Password"
            onChange = {(e) => setPwd(e.target.value)}
            />
            <button type="submit">Register</button>
            </form>
            

        </>
        )}
    return (
        <div className="App">
        <header className="App-header">
            <p> Current date is {currentTime}</p>
            <TeacherRegistrationForm></TeacherRegistrationForm>
            <RegistrationFormMessage></RegistrationFormMessage>
        </header>
        </div>
    );
}

export default TeacherRegistration;