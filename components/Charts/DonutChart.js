import React from 'react';
import { Doughnut } from 'react-chartjs-2';
const classes = require('./../../styles/charts.module.css');



export default function DonutChart(props) {
  const data = {
    labels: props.labels,
    datasets: [
      {
        data: props.values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };
  const options = {
    rotation: -29 * Math.PI,
    circumference: 59 * Math.PI
  }
  return (
    <div className={classes.donutCharSize}>
      <h2>{props.name}</h2>
      <Doughnut data={data} width={400} height={400} options={options}/>
    </div>
  );
}
