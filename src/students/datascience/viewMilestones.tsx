import { useEffect, useState } from "react";
import { getCookie, getResource } from "../../variousUtils.tsx";
import {AxisBottom,AxisLeft} from '@visx/axis'
import { AreaClosed, Line, LinePath } from '@visx/shape';
import {extent, max} from 'd3-array'
import { scaleLinear, scaleTime } from '@visx/scale';
import {Group} from '@visx/group'

import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip
} from "@visx/xychart";

async function getMilestones(setMilestones){
    let studentID = getCookie("userName")
    const milestoneURL = document.location.pathname + document.location.search + `&student=${studentID}`
    getResource(milestoneURL,"milestones",setMilestones)
}



interface Milestone{
    DateAchieved:string
    Percentage:number
}


const data1 = [
  { x: "2020-01-01", y: 50 },
  { x: "2020-01-02", y: 10 },
  { x: "2020-01-03", y: 20 }
];

const data2 = [
  { x: "2020-01-01", y: 30 },
  { x: "2020-01-02", y: 40 },
  { x: "2020-01-03", y: 80 }
];

const accessors = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y
};

const LineChart = () => {
  return (
    <XYChart height={300} xScale={{ type: "band" }} yScale={{ type: "linear" }}>
      <AnimatedAxis orientation="bottom" />
      <AnimatedGrid columns={false} numTicks={4} />
      <AnimatedLineSeries dataKey="Line 1" data={data1} {...accessors} />
      <AnimatedLineSeries dataKey="Line 2" data={data2} {...accessors} />
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
              {tooltipData.nearestDatum.key}
            </div>
            {accessors.xAccessor(tooltipData.nearestDatum.datum)}
            {", "}
            {accessors.yAccessor(tooltipData.nearestDatum.datum)}
          </div>
        )}
      />
    </XYChart>
  );
};


const width = 750;
const height = 400;

const margin = {
    top: 60,
    bottom: 60,
    left: 80,
    right: 80,
  };
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;
const getX = (m:Milestone) => new Date(m.DateAchieved)
const getY = (m:Milestone) => m.Percentage


function ViewMilestone(){
    const [milestones,setMilestones] = useState<Milestone[]>([])
    useEffect(()=>{getMilestones(setMilestones)},[])

    const xScale = scaleTime({range:[0,xMax], domain:extent(milestones,getX)})
    const yScale = scaleLinear({range:[yMax,0], domain:max(milestones,getY)})
    return(
        <header className="App-header">
     

            <svg width={widt.h} height={height}>
            <Group top={margin.top} left={margin.left}>
                <LineChart/>
            </Group>
            </svg>

            <h1>PRWIJGWOIRji</h1>
            <button onClick={()=>console.log(milestones)}>PWIRMGPWRJG</button>
            
        </header>
    )
}


export default ViewMilestone;
