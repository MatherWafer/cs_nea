import { getCookie, Navigation, InputField, NumberField, SelectField } from "../../variousUtils.tsx";
import {Link} from "react-router-dom"
import { useState } from "react";
interface topic{
    topicCode:string
    topicName:string
}

interface twoWayMap{
    map:{[key:string]:string}
    revMap:{[value:string]:string}
}

class twoWayMap{
    constructor(map){
        this.map = map
        this.revMap = {}
        Object.keys(this.map).forEach((key) => {this.revMap[this.map[key]] = key})
    }
    get(key){
        return this.map[key]
    }
    revGet(key){
        return this.revMap[key]
    }
}

function isEmptyObj(obj){
    for (var x in obj){return false}
    return true;
}

function getQueryString(topics:{[topicCode:string]:number}):string{
    let assignmentArgs = ""
    for (const entry of Object.entries(topics)){
        assignmentArgs += entry[0] + "=" + entry[1] + "&"
    }
    return "/practice-mode?" + assignmentArgs.slice(0,-1)
}

function ChooseTopics(){
    const topicsList: twoWayMap = new twoWayMap({"KruskalAlgorithm":"Kruskal's Algorithm",
                                             "GraphIntersections":"Finding intersections of graphs"})
    const [topics,setTopics] = useState<{[topicName:string]:number}>({})
    const [topicToAdd,setTopicToAdd] = useState<string>(Object.keys(topicsList.revMap)[0])
    const [numToAdd, setNumToAdd] = useState<number>(1)
    const addTopics = (topic:string,numQuestions:number) =>{
        let curState = {...topics}
        curState[topicsList.revGet(topic)] = numQuestions
        setTopics(curState)
    }

    const removeTopic = (topic:string) =>{
        let newState = {...topics}
        delete newState[topic]
        console.log(newState)
        setTopics(newState)
    }

    const handleTopicChange = (topicName:string) => {
        let topicId = topicsList.revGet(topicName)
        setTopicToAdd(topicName)
        console.log(topicId)
        if (Object.keys(topics).includes(topicId)){
            console.log("Here")
            setNumToAdd(topics[topicId])   
        }
        else{
            setNumToAdd(1)
        }
    }

    const handleNumberChange = (number:number) =>{
        setNumToAdd(number)
        addTopics(topicToAdd,number)
    }


    return(
        <header className="App-header">
            <h1>Choose topics</h1>
            <SelectField setter={handleTopicChange} 
                         options={Object.values(topicsList.map)}
                         inputValue={topicToAdd}
                         type="select"></SelectField>
            <p>Amount of questions:</p>
            <NumberField setter={handleNumberChange} 
                         inputValue={numToAdd}
                         placeholder={1}
                         minValue={1} 
                         type="number"/>
            {!isEmptyObj(topics) ?(
            <>
            <table>Your assignment will contain:
                {Object.keys(topics).map(x => 
                    <tr>
                        <td>{topicsList.get(x)}</td>
                        <td>{topics[x]}</td>
                        <button onClick={() => removeTopic(x)}>Remove</button>
                    </tr>
                    )}
            </table>
            <a><Link to={getQueryString(topics)}>Start</Link></a>
            </>
            )
            : null}
        <button onClick={()=>{console.log(topics)}}>Check</button>
        </header>
    )
}


export default ChooseTopics;