import { getCookie, InputField } from "../../variousUtils.tsx";
import { Link } from "react-router-dom";
import {useState} from "react"
import React from "react";

function CreateClass() {
    const [classID, setClassID] = useState(null)
    const [className,setClassName] = useState(null)
    const [lastStatus, setLastStatus] = useState(null)
    const teacherID = getCookie("userName")
    const msgs =  
    {200: <p style={{color:"green"}}>Successfully created class {classID}</p>,
     409: <p style={{color:"#CC0000"}}>A class already exists with that class code</p>
    }
    const submitClassDetails = async (event) =>{
        event.preventDefault();
        try{
            let res = await fetch("/create-class",{
                method: "POST",
                headers: {contentType: 'application/json'},
                body: JSON.stringify({
                    classID : classID,
                    className: className,
                    teacherID: teacherID
                })
            });
            
            console.log("Submitted Class Details To API")
            console.log(res);
            try{
                let resJson = await res.json();
                console.log(`Received with status ${resJson.status}`)
                setLastStatus(resJson.status)
                if (resJson.status === 200)
                {
                    console.log("Green light")
                    console.log(`ID = ${resJson.submittedID}`)
                }
                else{
                    console.log("Green light")
                }
            }

            catch(err){
                console.log("Failed to parse response")
                console.log(err)
            }
        }
        catch(err){
            console.log(err)
        }
    }    

    
    return<header className="App-header">
        <h1>Create a Class</h1>        
        <form onSubmit={submitClassDetails}>
            <InputField inputValue={classID} setter={setClassID} placeholder="Class ID"/>
            <InputField inputValue={className} setter={setClassName} placeholder="Display Name"/>
            <button type="submit">Submit</button>
        </form>        
        {msgs[lastStatus]}
    </header>
    
}   

export default CreateClass;
