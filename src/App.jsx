import { useEffect, useReducer, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, PolarArea } from 'react-chartjs-2';
import { ExcelCsvReader, excelDateToJSDate } from './assets/ExcelCsvReader';


const GameData={
  score:"Score",
  dataPlayed:"Date Played"
}

function dataFilter(data){

const labels = [5,4,6,8,9];

return {
  rawData:data,
  update:()=>{dataFilter(data);return data},
  lineCharData:{
  labels:fiterEvenDays(data.map((e)=> e[GameData.dataPlayed]),3).map((e,i)=>i*3),
  datasets: [{
    label: 'Days',
    data:data.map((e)=>e[GameData.score]),
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
  },
  poloarAreaChartData:{
  labels: [
    'Red',
    'Green',
    'Yellow',
    'Grey',
    'Blue'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [11, 16, 7, 3, 14],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(75, 192, 192)',
      'rgb(255, 205, 86)',
      'rgb(201, 203, 207)',
      'rgb(54, 162, 235)'
    ]
  }]
}
}

}

 function fiterEvenDays(data,n) {
  
  const dates = data.sort((a, b) => a - b);           

  const result = [];
  let last = null;

  for (let date of dates) {
    if (!last || (date - last)  >= n) {
      result.push(date); 
      console.log(date-last) 
      last = date;
    }
  }

  return result;
};



function App() {
  const [data, setdata] = useState([])

  useEffect(()=>{
    console.log( fiterEvenDays(data.map((e)=> e[GameData.dataPlayed]),3))
  },[data]
)


// const _data = {
//   labels: labels,
//   datasets: [{
//     label: 'My First Dataset',
//     data: [65, 59, 80, 81, 56, 55, 40],
//     fill: false,
//     borderColor: 'rgb(75, 192, 192)',
//     tension: 0.1
//   }]
// };

  return (
    <>
    <LineChart chartData={dataFilter(data).lineCharData}/>
    
    <ExcelCsvReader getData={(d)=>{
      setdata(d)
    }}/>


    
    </>
  )
}

      {/* <DataTable data={
        Array.from(
  new Map(
    data.map(e => [e["Player ID"], { playerId: e["Player ID"], playerName: e["Player Name"] }])
  ).values()
)
      }/>

  <DataTable data={
    Array.from(
  new Map(
    data.map(e => [e["Game ID"], { gameId: e["Game ID"], gameName: e["Game Name"] }])
  ).values()
)
      }/>

     <DataTable data={data}/> */}





ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Reusable Line Chart component
export function LineChart({ chartData, chartTitle = 'Line Chart' }) {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: chartTitle },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default App
