import { getCookie, Navigation } from "../../variousUtils.tsx";
import {Link} from "react-router-dom"
function PracticeNav(){
    let navData = [{url:"/graphs", prompt: "Graph intersections"},
                   {url:"/kruskals-algorithm", prompt: "Kruskal's Algorithm"},
                   {url:"/choose-topics", prompt:"Choose topics"}]                
    return (
        <div className='App'>
                <header className='App-header'>
                    <h1>Practice</h1>
                    <Navigation navData={navData}/>
                </header>
            </div>
    )
    
}


export default PracticeNav;