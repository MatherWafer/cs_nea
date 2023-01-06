import { getCookie } from "../../variousUtils";
import {Link} from "react-router-dom"
function ClassesNav(){
    
    return (
        <div className='App'>
                <header className='App-header'>
                    <h1>Classes</h1>
                    <a><Link to="/select-class">Manage a class</Link></a>
                    <a><Link to="/create-class">Create a class</Link></a>
                </header>
            </div>
    )
    
}


export default ClassesNav;