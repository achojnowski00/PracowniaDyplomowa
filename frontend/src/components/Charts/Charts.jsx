import React, { useContext, useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "./Charts.sass";

export const Charts = (props) => {
  return (
    <>
      <div className="chart">
        <Pie data={props.data} />
      </div>
    </>
  );
};
