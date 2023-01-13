import React, { useState, useEffect} from 'react';
import { getCookie, Navigation } from '../../variousUtils';

function QuestionSetNav(){
  let navData = [{url:"/select-questionSet", prompt:"View existing question sets"},
                 {url:"/create-questionSet", prompt:"Create a question set"}]
  return (
    <div className='App'>
            <header className='App-header'>
                <h1>Question sets</h1>
                <Navigation navData={navData} ></Navigation>
            </header>
        </div>
)}



export default QuestionSetNav;