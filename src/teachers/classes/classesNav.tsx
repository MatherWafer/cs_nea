import { getCookie, Navigation } from "../../variousUtils.tsx";
import {Link} from "react-router-dom"
function ClassesNav(){
    let navData = [{url:"/select-class", prompt: "Manage a class"},
                   {url:"/create-class", prompt: "Create a class"}]                
    return (
        <div className='App'>
                <header className='App-header'>
                    <h1>Classes</h1>
                    <Navigation navData={navData}/>
                </header>
            </div>
    )
    
}


export default ClassesNav;