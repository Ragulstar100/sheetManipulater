import { useEffect, useReducer, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import * as echarts from 'echarts';
import './App.css'
import { Line, PolarArea } from 'react-chartjs-2';
import { ExcelCsvReader, excelDateToJSDate } from './assets/ExcelCsvReader';




const GameData = { score: "Score", dataPlayed: "Date Played", gameName: 'Game Name', levelReached: 'Level Reached', timePlayed: 'Time Played', playerName: 'Player Name' }

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
      let datesPlayed = data.map((game_entry) => game_entry[GameData.dataPlayed]);
      let filter_dates = fiterEvenDays(datesPlayed, 3);
      return filter_dates;

    }
  }
}


//Filter My Data Flow Chart
function dataFilter(data) {
  let obj = () => gameFilterData(data)

  const timeData = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      showContent: false
    },
    dataset: {
      source: [
        ['Games'].concat(obj().filterEven()),
        ...obj().labels.map((e, i) => {
          return [obj().labels[i]].concat(data.filter((e) => e[GameData.gameName] == obj().labels[i]).map((e) => (parseInt(e[GameData.timePlayed].split(' ')[0]))))
        })
      ]
    },
    xAxis: { type: 'category' },
    yAxis: { gridIndex: 0 },
    grid: { top: '55%' },
    series: [
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['50%', '25%'],
        emphasis: {
          focus: 'self'
        },
        // label: {
        //   formatter: '{b}: {@2012} ({d}%)'
        // },
        // encode: {
        //   itemName: 'product',
        //   value: '2012',
        //   tooltip: '2012'
        // }
      }
    ]
  };



  let barChartBulider = (() => {
    let list = []
    obj().playerName.forEach((e) => {
      let local = { "Games": e }
      data.forEach((g) => {
        local[g[GameData.gameName]] = data.filter((f) => (f[GameData.gameName] == g[GameData.gameName]) || f[GameData.playerName] == e).reduce((acc, r) => acc + parseInt(r[GameData.timePlayed].split(' ')[0]), 0)
      })
      list.push(local)
    })
    console.log(list)
    return list
  })


  return {
    rawData: data,
    update: () => { dataFilter(data); return data },
    timePalyedData: timeData,
    totalPlayedData: {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ['Games', ...obj().labels],
        source: barChartBulider()

      },
      xAxis: { type: 'category' },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    },
    lineCharData: {
      title: {
        text: 'Line Chart Example'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: obj().filterEven()
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Game score',
          type: 'line',
          data: data.map((e) => e[GameData.score]),
          smooth: true
        }
      ]
    },

    poloarAreaChartData: {
      angleAxis: {
        type: 'category',
        data: obj().labels.concat('blue')
      },
      radiusAxis: {},
      polar: {},
      series: [
        {
          type: 'bar',
          data: obj().maxArray,
          coordinateSystem: 'polar',
          name: 'A',
          stack: 'a',
          emphasis: {
            focus: 'series'
          }
        }
      ],
      legend: {
        show: true,
        data: obj().labels
      }
    }
  }

}



function fiterEvenDays(data, n) {

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

  useEffect(() => {
    // console.log(data.map((e)=>(  parseInt(e[GameData.timePlayed].split(' ')[0])) ))
  }, [data]
  )

  


  return (
    <>
      <div className='flex flex-col'>
        <div className='flex gap-5 justify-end items-start'>
          <ExcelCsvReader getData={(d) => {
            setdata(d)
          }} />

        </div>
        {data.length != 0  && <div>
        <Dropdown label="Select Your PlayerName" className='self-end' data={gameFilterData(data).playerName} onSelect={(v) => {
            setName(v)
          }} />


        <Chart className='w-200 h-75' data={dataFilter(data.filter((e) => {
          return name == 'All' || e[GameData.playerName] == name
        })).lineCharData} />

        <Chart className='w-100 h-50' data={dataFilter(data.filter((e) => {
          return name == 'All' || e[GameData.playerName] == name
        })).poloarAreaChartData} />



      
      <ChartCombo data={dataFilter(data).timePalyedData} />
      <Chart className='w-screen h-100' data={dataFilter(data.filter((e) => {
        return name == 'All' || e[GameData.playerName] == name
      })).totalPlayedData} />
      </div>
    }
    </div >
    
    </>
  )
}





function Chart({ data, className }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(data);

    return () => {
      chartInstance.dispose();
    };
  }, [data]);

  return <div ref={chartRef} className={className} />;
};


function ChartCombo({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);



    chart.setOption(data);

    chart.on('updateAxisPointer', function (event) {
      const xAxisInfo = event.axesInfo?.[0];
      if (xAxisInfo) {
        const dimension = xAxisInfo.value + 1;
        chart.setOption({
          series: {
            id: 'pie',
            label: {
              formatter: `{b}: {@[${dimension}]} ({d}%)`
            },
            encode: {
              value: dimension,
              tooltip: dimension
            }
          }
        });
      }
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};


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


