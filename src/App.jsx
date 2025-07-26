import { useEffect, useState, useRef } from 'react'
import './App.css'
import './dataHandler'
import {lineChartData,polorRadarData,multiBarData,linePieCompo,Chart,ChartCombo} from './charts'

import { ExcelCsvReader, excelDateToJSDate } from './assets/ExcelCsvReader';



const GameData = { score: "Score", datePlayed: "Date Played", gameName: 'Game Name', levelReached: 'Level Reached', timePlayed: 'Time Played', playerName: 'Player Name' }

function dataChart(data) {

  //Covert Serial Excel Date to Js Date
  let notSerialdays = data.map((e) => excelDateToJSDate(e[GameData.datePlayed]))
  let even3days = filterEvenDays(notSerialdays, 3)
  let dmFormate = even3days.map((e) => `${e.getDate()}/${e.getMonth()}`)

  let gameScores = data.selectByKey(GameData.score)
  let uniqueGames = data.getUniqueData(GameData.gameName)
  let uiquePalyerNames=data.getUniqueData(GameData.playerName)


  //MaxLevelReched Player Invidual games
  let maxLevelReached = data.groupBy(GameData.gameName).map((e,v)=>Math.max(...v.selectByKey(GameData.levelReached)))

    //List Total Played Each Player In Each Game
   let barChartBulider = data.groupBy(GameData.playerName).map((game,v)=>{ 
    let obj={Games:game}
      v.groupBy(GameData.gameName).map((player,w)=>{
          obj[player]=w.sum(GameData.timePlayed,"min")
      })
      return obj
   } )

   //Each day How Minutes how many Player Played
   let _gamesVsTimeData = [["Dates",...dmFormate]].concat(data.groupBy(GameData.gameName).map((game,v)=>{
    return [game].concat(...v.selectByKey(GameData.score))
   }) )
   

  

  return {
    //GameScore Vs Date Data
    scoreVsDateData: lineChartData(dmFormate, gameScores),
    //Games Vs Max Level Reached EachPlayer
    gamesVsMlr: polorRadarData(uniqueGames, maxLevelReached),
    //GamesVsPalyer Based TotalTimePlayed
    gamesVsTtpip:multiBarData(["Games",...uniqueGames],barChartBulider),
    //Games Vs NumperOf Player played minutes percentage
    gamesVsTimeData:linePieCompo( 
      _gamesVsTimeData
      )


  }

}


//Filter My Raw data
function gameFilterData(data) {

  let _labels = Array.from(new Set(data.map((e) => e[GameData.gameName])))
  let _maxArray = []
  _labels.forEach((n) => {
    _maxArray.push(Math.max(...data.filter((e => e[GameData.gameName] == n)).map((e) => e[GameData.levelReached])))
  })

  return {
    labels: _labels,
    playerName: Array.from(new Set(data.map((e) => e[GameData.playerName]))),
    maxArray: _maxArray,
    filterEven: () => {
      let datesPlayed = data.map((game_entry) => game_entry[GameData.datePlayed]);
      let filter_dates = filterEvenDays(datesPlayed, 3);
      return filter_dates;

    }
  }
}





function filterEvenDays(data, n) {

  const dates = data.sort((a, b) => a - b);

  const result = [];
  let last = null;

  for (let date of dates) {
    if (!last || (date - last) >= n) {
      result.push(date);
      last = date;
    }
  }

  return result;
};





function App() {
  const [data, setdata] = useState([])

  const [name, setName] = useState('All')


  return (
    <>
      <div className='flex flex-col w-full'>

        <div className='flex gap-5 justify-end items-start'> <ExcelCsvReader getData={(d) => { setdata(d) }} /> </div>

        {data.length != 0 && <div>

          <Dropdown label="Select Your PlayerName" className='w-fit justify-end' data={gameFilterData(data).playerName} onSelect={(v) => { setName(v) }} />

          <div className='flex items-center'>
            <Chart className='w-[100%] h-75' data={dataChart(data.filterByKey(GameData.playerName, name, "All")).scoreVsDateData} />

            <Chart className='w-100 h-50' data={dataChart(data.filterByKey(GameData.playerName, name, "All")).gamesVsMlr} />
          </div>

          <ChartCombo data={dataChart(data).gamesVsTimeData} />


          <Chart  className='w-screen h-100' data={dataChart(data.filterByKey(GameData.playerName, name, "All")).gamesVsTtpip} />


        </div>
        }
      </div >

    </>
  )
}







export function Dropdown({ className, data, label, onSelect }) {
  const [selected, setSelected] = useState('');

  return (
    <div className={className || 'w-64'}>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label || 'Select Your Option'}
      </label>
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value)
          onSelect(e.target.value)
        }
        }
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
      >
        <option value="All">
          All
        </option>

        {(data || []).map((e, i) => (
          <option key={i} value={e}>
            {e}
          </option>
        ))}
      </select>

      {/* <p className="mt-2 text-sm text-gray-600">
        You selected: <span className="font-medium">{selected}</span>
      </p> */}
    </div>
  );
}








export default App


