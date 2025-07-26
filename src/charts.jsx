import { useEffect, useState, useRef } from 'react'
import * as echarts from 'echarts';

export function Chart({ data, className }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
   if(data) chartInstance.setOption(data);
    return () => {
      chartInstance.dispose();
    };
  }, [data]);

  return <div ref={chartRef} className={className} />;
};


export function ChartCombo({ data }) {
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

export function lineChartData(dataX, dataY) {
  return {
    title: {
      text: 'Enter Your Title'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dataX
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Game score',
        type: 'line',
        data: dataY,
        smooth: true
      }
    ]
  }
}

export function polorRadarData(dataX, dataY) {
  return {
    angleAxis: {
      type: 'category',
      data: dataX
    },
    radiusAxis: {},
    polar: {},
    series: [
      {
        type: 'bar',
        data: dataY,
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
      data: dataX
    }
  }
}

export function multiBarData(dataX, dataY) {

  return {
    legend: {},
    tooltip: {},
    dataset: {
      dimensions: dataX,
      source: dataY
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  }
}

        //Below Like this Should Be a Data
        // X axis ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
        // ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
        // ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
        // ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
        // ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
export function linePieCompo(data){
  return  {
    legend: {},
    tooltip: {
      trigger: 'axis',
      showContent: false
    },
    dataset: {
      source: data
  
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
        label: {
          formatter: '{b}: {@2012} ({d}%)'
        },
        encode: {
          itemName: 'product',
          value: '2012',
          tooltip: '2012'
        }
      }
    ]
  };
}