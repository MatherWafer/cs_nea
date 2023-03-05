import React, { useState, useEffect, SetStateAction, Dispatch} from 'react';
import {Link} from "react-router-dom"
import {Mafs,Coordinates, Line, Point, Polygon, Text, Plot} from "mafs"
import { InputField, getCookie } from '../../variousUtils.tsx';
import { isPropertySignature, resolveProjectReferencePath } from 'typescript';
import Latex from 'react-latex'
import "katex/dist/katex.min.css";

interface RootInputProps{
    index:number
    setRoots: (index:number,value:number) => void
}


function perms(nums: number[],r:number):number[][]{
    let found: number[][] = [];
    if(r === 0){
        return []
    }
    else{
        for(const num of nums){
            let newArr = JSON.parse(JSON.stringify(nums))  //Create deep copy of current list
            newArr.splice(newArr.indexOf(num),1)           //Remove first element from the list 
            let newPerms = perms(newArr,r-1)               //Get all the ways of permuting the remaining elements in the list
            if(newPerms.length === 0){                     //Base case reached, so only have to append current number to found
                found.push([num]) 
            }
            else{
                found = found.concat((newPerms.map(x => ([num].concat(x)).sort() ))) //Add all the ways of permuting the n-1 items and then put current number at the start of each
            }
        }
    }
    return found
}



function checkIfListsEquivalent(list1:any[],list2:any[]):boolean{
    return JSON.stringify(list1) === JSON.stringify(list2)
  }
  

function RootInput(props:RootInputProps){
    const [userAnswer,setUserAnswer] = useState<number>(0)
    let setRoots = props.setRoots
    let index = props.index
    const handleAnswerChange = (value) => {
        setRoots(index,value)
        setUserAnswer(value)
    }
    useEffect(() => {setRoots(index,userAnswer)})
    return(
        <>
          <div>
            <InputField type="number"
                        inputValue={userAnswer}
                        setter={handleAnswerChange}/>
          </div>
        </>
      )
}
function rootProduct(roots:number[],perm:number[]){
    let prod = 1
    for(const rootIndex of perm){
        prod *= roots[rootIndex]
    }
    return prod
}

function getCoeffs(roots: number[]):number[]{
    let rangeArr = Array.from(Array(roots.length).keys())
    let coeffs: number[] = []
    coeffs.push(1)
    for(let i = 1; i < roots.length; ++i){
        let rootPerms = perms(rangeArr,i).map(x => JSON.stringify(x)).filter((e,i,a) => i === a.indexOf(e)).map(x => JSON.parse(x))
        let coeff = 0
        for(const rootPerm of rootPerms){
            coeff += rootProduct(roots,rootPerm)
        }
        coeffs.push((-1) ** i * coeff)
    }
    let prod = roots.reduce((accum,current) => accum * current, 1)
    coeffs.push((-1) ** roots.length * prod)
    return coeffs
}

function getPoly(coeffs:number[]){
    let revPol = coeffs.reverse()
    let terms = revPol.map((coeff,index) => (coeff!=0) ? ('$ ' 
                                            + ((index < coeffs.length - 1 ) && coeff > 0? (" + ") : "") + 
                                                ((Math.abs(coeff) != 1 || index === 0)? coeff.toString() : (coeff === -1)?"-":"" ) + 
                                                ((index != 0) ? (("x" + ((index !=1)? ("^" +index.toString()):""))): "") + 
                                                '$')
                                            : '')
    return terms.reverse()
}

function randInt():number{
    return Math.floor(Math.random() * 4 + 1)}
    
function randRoot():number{
    return Math.floor(-10 + Math.random() * 20)
}
function randCoeffs(size:number):number[]{
    return Array.from(Array(size)).map(randInt)
}

function randRoots(size:number):number[]{
    return Array.from(Array(size)).map(randRoot)
}

function getComplementaryPoly(solution: number[],poly1: number[]): number[]{
    let compPol: number[] = []
    for(let i = 0; i < solution.length;++i){
        compPol.push(poly1[i] - solution[i])
    }
    return compPol
}


function polynomial(x,coeffs){
    return coeffs.reduce((sum,coeff,power) => sum + coeff * (x ** power),0)
}

function GraphIntersect(props){
    const [roots, setRoots] = useState<number[]> (randRoots(2))
    const [coeffs, setCoeffs] = useState<number[]> (getCoeffs(roots))
    const [poly1, setPoly1] = useState<number[]>(randCoeffs(coeffs.length))
    const [poly2, setPoly2] = useState<number[]>(getComplementaryPoly(coeffs,poly1))
    const [numSolns,setNumSolns] = useState(1)
    const [userAnswers,setUserAnswers] = useState<number[]>([])
    const [isCorrect,setIsCorrect] = useState<boolean|null>(null)
    function shuffleRoots(numRoots){
        let newRoots = randRoots(numRoots)
        let newCoeffs = getCoeffs(newRoots).reverse()
        setRoots(newRoots)  
        setCoeffs(newCoeffs)
        let newPoly1 = randCoeffs(newCoeffs.length)
        setPoly1(newPoly1)
        setPoly2(getComplementaryPoly(newCoeffs,newPoly1))
    }

    const poly1Curve = (x) => polynomial(x,poly1)
    const poly2Curve = (x) => polynomial(x,poly2)

    const questionsCorrect = props.questionsCorrect
    const setResult = props.setResult
    const qNum = Number(props.qNum)
    const setUserAnswer = () =>{

    }

    const shufflePolys = () => {
        let newPoly1 = randCoeffs(coeffs.length)
        setPoly1(newPoly1)
        setPoly2(getComplementaryPoly(coeffs,newPoly1))
    }
    function isOdd(n: number) {
        return ((n % 5) + 5) % 5 === 0
      }

      
    function isTwenty(n:number){
        return((n % 20) + 20) % 20 === 0
    }


    const addRow = () =>{
        setNumSolns(numSolns + 1)
        setUserAnswers(userAnswers.concat(Array.from(Array(1))))
      }
  
  
    const removeRow = () => {
        if(numSolns > 1){
          setNumSolns(numSolns - 1)
          setUserAnswers(userAnswers.slice(0,-1)) 
        }
      }

    function setRoot(index:number,value:number){
        let newSoln = userAnswers   
        newSoln[index] = value
        setUserAnswers(newSoln)
    }

    function checkSoln():void{
        let val = checkIfListsEquivalent(Array.from(new Set(roots).keys()).sort(), Array.from(new Set(userAnswers).keys()).sort())    //Convert to sets and sort to account for repeated roots.
            setIsCorrect(val)
            questionsCorrect[qNum] = val
            setResult(questionsCorrect)    
    }

    return(
        <>
            <InputField type="number" setter={shuffleRoots}></InputField>
            <h1>Solution: <Latex>{getPoly(coeffs).join(" ")}</Latex></h1>
            <p>Find the points of intersection of <Latex>{getPoly(poly1).join(" ")}</Latex> and <br/> <Latex>{getPoly(poly2).join(" ")}</Latex> </p>
            <button onClick={checkSoln}>Check answer</button>
            <button onClick={() =>{console.log(roots)}}>Check roots</button>
            <button onClick={() =>{console.log(userAnswers)}}>Check roots</button>
            {isCorrect? <h1>Correct</h1>:isCorrect===false?<h1>Wrong</h1>:null}
            <div>
                {/*
                <div> 
                    <Mafs width={500} viewBox={{x:[-30,30], y:[-40,100]}}>
                        <Plot.OfX y={poly1Curve} weight={3} color="blue"/>
                        <Plot.OfX y={poly2Curve} weight={3} color="red"/>
                        <Coordinates.Cartesian  xAxis={{
                                                        lines: 5,
                                                        labels: (n) => (isTwenty(n) ? n : ""),}}
                                                                    
                                                yAxis={{
                                                        lines:5,
                                                        labels:(n) => (isTwenty(n)? n : "")
                                                }}/>
                    </Mafs>
                </div>
                                            */}
                    <button onClick={addRow}>Add</button>
                    <button onClick={removeRow}>Remove</button>
                        <table>
                        <tbody>
                            <tr>
                            {Array.from(Array(numSolns)).map((x,index) =>
                                                                        <td>
                                                                            <label style={{fontSize:"0.7em"}}>{index + 1} </label>
                                                                            <RootInput index={index} setRoots={setRoot}/>
                                                                        </td>
                                )}
                            </tr>
                            </tbody>                                                                  
                        </table>
            </div>
        </>
    )
}



export default GraphIntersect;