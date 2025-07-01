import { Chart } from 'chart.js/auto'
import React, { useEffect, useRef, useState } from 'react'

const ChartComponent = (props) => {
    const {data, filter} = props;
    const [displayedData, setDisplayedData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [start, setStart] = useState(false);
    const chartRef = useRef(null); // Ref for the Chart instance
    const canvasRef = useRef(null);
    
      // useEffect(() => {
      //   const observer = new IntersectionObserver(
      //     ([entry]) => {
      //       if (entry.isIntersecting) {
      //         setStart(true);
      //         observer.unobserve(entry.target); // only trigger once
      //       }
      //     },
      //     {
      //       threshold: 1, // Trigger when 20% is visible
      //     }
      //   );
    
      //   if (canvasRef.current) observer.observe(canvasRef.current);
    
      //   return () => {
      //     if (canvasRef.current) observer.unobserve(canvasRef.current);
      //   };
      // }, []);

    useEffect(() => {
      const sortedData = [...data].filter(item => item && item.name).sort((a, b) => a.name.localeCompare(b.name));


      const labels = sortedData.map(item => item.name);
      const values = sortedData.map(item => item.total); // assuming `total` is the value you're showing

      setDisplayedData([{
        label: 'Jumlah',
        data: values,
        backgroundColor: '#666666',
      }]);

      setLabels(labels);
    }, [filter, data]);

    useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setStart(true);
      } else {
        setStart(false);
      }
    },
    {
      threshold: 0.2, // animate when 20% visible
    }
  );

  if (canvasRef.current) observer.observe(canvasRef.current);

  return () => {
    if (canvasRef.current) observer.unobserve(canvasRef.current);
  };
}, []);

useEffect(() => {
  if (!start) return; // only create chart when visible

  if (chartRef.current) {
    chartRef.current.destroy();
  }

  const ctx = canvasRef.current.getContext('2d');

  chartRef.current = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: displayedData,
    },
    options: {
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return Number.isInteger(value) ? value : '';
            }
          },
          beginAtZero: true
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });

  return () => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  };
}, [start, displayedData, labels]);


  //   useEffect(() => {
  //   // Destroy previous chart instance if it exists
  //   if (chartRef.current) {
  //     chartRef.current.destroy();
  //   }
  //   // const sortedData = [...data].sort((a, b) => a.year - b.year);
  //   const sortedData = [...data].sort((a, b) => a.name - b.name);
  //   console.log('Sorted: ', sortedData)

  //   const ctx = canvasRef.current.getContext('2d');

  //   // Create new chart instance
  //   chartRef.current = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: labels,  // <- from the sorted labels above
  //       datasets: displayedData,
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           ticks: {
  //             callback: function(value) {
  //               return Number.isInteger(value) ? value : ''; // only show whole numbers
  //             }
  //           },
  //           beginAtZero: true
  //         }
  //       },
  //       responsive: true,
  //       animation: {
  //         duration: 500,
  //         easing: 'easeOutQuart',
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         deferred: {
  //           xOffset: 150,
  //           yOffset: '50%',
  //           delay: 500,
  //         },
  //       },
  //     },
  //   });

  //   return () => {
  //     if (chartRef.current) {
  //       chartRef.current.destroy();
  //     }
  //   };
  // }, [displayedData]);
  
  return (
    <div className='w-full flex justify-center'>
        <div style={{ visibility: start ? 'visible' : 'hidden'}} className='w-4/5'><canvas className='intersect:motion-preset-focus intersect-once w-full' id='chart' ref={canvasRef}></canvas></div>
    </div>
  )
}

export default ChartComponent