import {Line} from 'react-chartjs-2';

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
)

function Chart(){
    

    const data ={
        labels:["May 12", "May 13" , "May 14", "May15"],
        datasets:[{
            data:[2,6,9,4,5,6],
            backgroundColor:"rgba(255, 99, 132, 0.2)",
            borderColor : "rgba(255, 99, 132, 1)",
            pointBorderColor : 'transparent',
            borderWidth: 1,
            
           
        }]
    };
    const options = {
        responsive: true,
        plugins: {
          //Dont show the legend
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "DATE",
            },
          },
          y: {
            title: {
              display: true,
              text: "Profit",
            },
          },
        },
      };
    return(
        <div style={{width: '500px' , height:'500px', marginLeft:'20px'}}>
            <Line data={data} options={options}></Line>
        </div>
    );
}

export default Chart;