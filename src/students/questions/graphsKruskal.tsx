import React, { useState, useEffect} from 'react';
import {Link} from "react-router-dom"
import {Mafs,Coordinates, Line, Point, Polygon, Text} from "mafs"
import Delaunator from 'delaunator';
import { InputField, getCookie } from '../../variousUtils.tsx';
type Vector2 = [x: number, y: number];




function checkIfListsEquivalent(list1:any,list2:any):boolean{
  if(list1.length === list2.length){
    for(let i = 0; i < list1.length; i+=1){
      if(typeof list1[0] === "object"){
        console.log("Comparing Objects")
        if (JSON.stringify(list1[i]) != JSON.stringify(list2[i])){
          return false
        }
      }
      else{
        if(list1[i] != list2[i]){
          return false
        }
    }
    }
    return true
  }
  else{
    return false
  }
}


interface DisjointSet {
  parent: DisjointSet
  label : string
  rank: number
  find() : DisjointSet
  log(): void
  incRank(): void
  setParent(newParent: DisjointSet): void
}

function strSort(strInput:string):string{
  return [...strInput].sort().join("")
}

function union(set1:DisjointSet, set2:DisjointSet):void{
    if (set1.rank > set2.rank)
        set2.find().setParent(set1)
    else if (set2.rank > set1.rank){
        set1.find().setParent(set2)
        set2.incRank()
    }
    else{
        set2.find().setParent(set1)
        set1.incRank()
    }
}

function PickPair(props){
  const [node1,setNode1] = useState("A")
  const [node2,setNode2] = useState(Object.keys(props.adjList[node1])[0])
  const [inMST,setInMST] = useState(false)
  let nodeList = Array.from(Array(Object.keys(props.adjList).length).keys()).map(x => String.fromCharCode(65 + x))
  let index = props.index
  let setRow = props.setRow

  useEffect(() => {setRow(index,{edge:strSort(node1 + node2), inMST:false})}, [])

  function handleChange1(value){
    setNode1(value)
    setNode2(Object.keys(props.adjList[value])[0])
    setRow(index,{edge:strSort(value + Object.keys(props.adjList[value])[0]), inMST:inMST})
  }

  function handleChange2(value){
    setNode2(value) 
    setRow(index,{edge:strSort(node1 + value), inMST:inMST})
  }

  function handleBoxCheck(){
    setInMST(!inMST)
    setRow(index,{edge:strSort(node1 + node2), inMST:!inMST})
  }

  return(
    <>
      <div>
        <InputField type="select"
                    options={nodeList}
                    setter={handleChange1}
        />

        <InputField type="select"
                    options={Object.keys(props.adjList[node1])}
                    setter={handleChange2}/>
      </div>
      <div onClick={() => handleBoxCheck()} style={{cursor:'pointer',backgroundColor:inMST?"#005005":"#8e0000"}}>
      <svg width="5%" height="10%" viewBox='0 0 1 1 ' > </svg>                                                        
      </div>
    </>
  )
}

class DisjointSet{
    constructor(label:string){
        this.parent = this
        this.label = label
        this.rank = 1
    }
    find(): DisjointSet{
        if(this.parent.label === this.label){
            return this
        }
        else{
            return this.parent.find()
        }
    }
    log() : void {
        console.log(`My name is ${this.label} and my parent is ${this.parent.label}`)
    }
    setParent(newParent: DisjointSet): void {
        this.parent = newParent
    }
    incRank(): void {
        this.rank += 1
    }
}

function minimumSpanningTree(edges:{[name:string]:number} , n:number){
  let nodes: DisjointSet[] = Array.from(Array(n)).map((x,index) => new DisjointSet(String.fromCharCode(65 + index)))
  let result: string[] = []
  let edgesViewed: {edge:string,inMST:boolean}[] = []
  let cost: number = 0
  
  for(const[label, weight] of Object.entries(edges).sort((a,b) => a[1] - b[1])){
    if (result.length === n-1){break}
    let n1 = label.charCodeAt(0) - 65
    let n2 = label.charCodeAt(1) - 65
    if(nodes[n1].find() != nodes[n2].find()){
      union(nodes[n1],nodes[n2])
      result.push(strSort(label))
      cost += weight
      edgesViewed.push({edge:strSort(label), inMST:true})
    }
    else{
      edgesViewed.push({edge:strSort(label), inMST:false})
    }
  }  
  return {tree:result, viewed: edgesViewed, cost:cost}
}

function dotP(e1,e2,points){
  let v1 = [points[e1[0]][0] - points[e1[1]][0], points[e1[0]][1] - points[e1[1]][1]]
  let v2 = [points[e2[0]][0] - points[e2[1]][0], points[e2[0]][1] - points[e2[1]][1]]
  let cosT = (v1[0] * v2[0] + v1[1]*v2[1]) / (Math.sqrt((v1[0]**2 + v1[1]**2) * (v2[0]**2 + v2[1]**2)))
  return (!(0.8 <= cosT && cosT <= 1) && !(-0.85 >= cosT && cosT >= -1))
}


function getTriangulation(setTriangulation, init=false, points: number[][]){
  let edges:number[][] = []
  let triangles = Delaunator.from(points).triangles
  if (triangles){
  for(let i = 0; i < triangles.length; i+=3){     
        for(let j = 0; j < 3; j+=1){
          let newEdge = [triangles[i + j],triangles[i + ((j+1) % 3)]]
          if (edges.filter((x) => (x[0] === newEdge.sort()[0] && x[1] === newEdge.sort()[1])).length === 0){
            let prevEdge = (j===0) ? [triangles[i+2],triangles[i+j]] : [triangles[i + ((j-1) % 3)], triangles[i + j]]
            if (dotP(prevEdge,newEdge,points)){
              edges.push(newEdge.sort())
            }
          }
        }
  }
  }
  if(init){
    return edges
  }
  else{
    setTriangulation(edges)
    return edges
  }
}

function generateGraphFromTriangulation(points:Vector2[],triangulation:number[][],/*setEdges, setAdjList,*/ init:boolean){
  let adjList = {}
  for(let i = 0; i < points.length;i+= 1){
    let label = String.fromCharCode(65 + i)
    adjList[label] = {}
  }
  let edges :{[name:string]:number}={}
  triangulation.forEach(edge => {
    let node1 = points[edge[0]]
    let node2 = points[edge[1]]
    let weight = Math.round((0.5 + Math.random() * 2.5) * ((Math.sqrt((node1[0] - node2[0]) ** 2 + (node1[1] - node2[1]) ** 2 ))))
    let label1 = String.fromCharCode(65 + edge[0])
    let label2 = String.fromCharCode(65 + edge[1])
    let edgeName = label1 + label2
    edges[edgeName] = weight
    adjList[label1][label2] = weight
    adjList[label2][label1] = weight
    //console.log(`${label1+label2}: ${weight}`)
    })
  if(init){
    return {edges :edges,
            adjList:adjList}}
  //setAdjList(adjList)
  //setEdges(edges)
  return {edges:edges,
          adjList:adjList}
}

function randomCoord(max): Vector2{
  return [((Math.random() * max  )),((Math.random() * max ))]
}

function shuffle(value): Vector2[]{
  return Array.from(Array(value)).map(x=>randomCoord(50))
}

function KruskalsAlgorithm(){
    const [numPoints,setNumPoints] = useState(6)
    const [points,setPoints] = useState(Array.from(Array(6)).map(x=>randomCoord(50)))
    const [triangulation,setTriangulation] = useState(getTriangulation(null,true,points))
    const [graphData,setGraphData] = useState(generateGraphFromTriangulation(points,triangulation,true))
    const [mst,setMST] = useState(minimumSpanningTree(graphData.edges,points.length))
    const [viewToggle,setViewToggle] = useState(true)
    const [numRows,setNumrows] = useState(5)
    const [userEdgesChecked,setUserEdgesChecked] = useState(Array.from(Array(numRows)))
    const [correctCheckedEdges, setCorrectCheckedEdges] = useState(false)
    const addRow = () =>{
      setNumrows(numRows + 1)
      setUserEdgesChecked(userEdgesChecked.concat(Array.from(Array(1))))
    }


    const removeRow = () => {
      if(numRows > 1){
        setNumrows(numRows - 1)
        setUserEdgesChecked(userEdgesChecked.slice(0,-1)) 
      }
    }

    const checkViewedEdges = () => checkIfListsEquivalent(userEdgesChecked,mst.viewed)

    function setRow(index,value){
      let newUserEdgesChecked = userEdgesChecked
      newUserEdgesChecked[index] = value
      setUserEdgesChecked(newUserEdgesChecked)
    }

    return(
      <header className='App-header'>
          <button onClick={() => {setViewToggle(!viewToggle)}}>{viewToggle? "MST" : "Whole Graph"}</button>
          <button onClick={() => {console.log(userEdgesChecked)}}>Answers</button>
          <button onClick={() => {console.log(mst.viewed)}}>Actual nodes viewed</button>
          <button onClick={() => {setCorrectCheckedEdges(checkViewedEdges)}}>Check</button>
          <p>Find the minimum spanning tree of this graph using Kruskal's Algorithm. </p>
          <p>Show your working by inputting each edge which you inspect in the order 
            you do so, and whether or not you include it in the tree and include the tree's weight.</p>
              <div style={{overflow:"auto",width:"1000px", backgroundColor:"#14207825" }}>
                <div style={{float:"left"}}>
                  <button onClick={() => console.log(mst.viewed)}>VIewed</button>
                  <button onClick={addRow}>Add</button>
                  <button onClick={removeRow}>Remove</button>
                  <table>
                    <tbody>
                      {Array.from(Array(numRows)).map((x,index) =><tr>
                                                                    <td>
                                                                      <label style={{fontSize:"0.7em"}}>{index + 1} </label>
                                                                      <PickPair index={index} adjList={graphData.adjList} setRow={setRow}/>
                                                                    </td>
                                                                  </tr>)}
                      </tbody>                                                                  
                  </table>
                  {correctCheckedEdges? <p style={{color:"Green"}}>Win</p>:<p>L</p>}
                </div>
                <div style={{float:"right", right:"0"}}>
                  <Mafs width={500} viewBox={{x:[0,50], y:[0,55]}}>
                    <Coordinates.Cartesian xAxis={false} yAxis={false} />
                    {viewToggle? 
                                triangulation.map(edge => 
                                <>
                                  <Line.Segment opacity={0.5} point1={points[edge[0]]} point2={points[edge[1]]}/>
                                    <Text 
                                      x={0.5 * (points[edge[0]][0] + points[edge[1]][0])}
                                      y={0.5 * (points[edge[0]][1] + points[edge[1]][1])}
                                      size={12}
                                    >
                                    {graphData.edges ? graphData.edges[String.fromCharCode(65 + edge[0]) + String.fromCharCode(65 + edge[1])] : null}
                                    </Text>
                                  
                                  </> )
                              :
                              mst.tree.map(edge =>
                                <>
                                  <Line.Segment opacity={0.5} point1={points[edge.charCodeAt(0) - 65]} point2={points[edge.charCodeAt(1) - 65]}/>
                                  <Text 
                                      x={0.5 * (points[edge.charCodeAt(0) - 65 ][0] + points[edge.charCodeAt(1) - 65 ][0])}
                                      y={0.5 * (points[edge.charCodeAt(0) - 65 ][1] + points[edge.charCodeAt(1) - 65 ][1])}
                                      size={12}
                                    >
                                    {graphData.edges ? graphData.edges[edge] :null}
                                  </Text>
                                </>
                              )                          
                            }
                    {points.map((k,index)=> 
                            <>  
                              <Point svgCircleProps={{r:8}} color="#EEEEEE" opacity={1} x={k[0]} y={k[1]}/>
                              <Text
                                  x={k[0]}
                                  y={k[1]-.25}
                                  color="black"
                                  attachDistance={0}
                                  size={10}
                                >
                                  {String.fromCharCode(65+index)}
                              </Text>
                            </>                    
                            )}
                  </Mafs>  
                </div>
              </div>
      </header>
    )
}


export default KruskalsAlgorithm;