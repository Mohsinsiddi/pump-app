"use client";

import React from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";

type SERIES_DATA_TYPE = {
  x: Date;
  y: number[];
};

type TradeingChartprops = {
  data: SERIES_DATA_TYPE[];
};

export default function TradingChart({ data }: TradeingChartprops) {
  const options: ApexOptions = {
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        },
      },
    },
    chart: {
      height: 300,
      type: "candlestick",
      zoom: {
        enabled: true,
      },
      foreColor: "#adaeb5",
    },
    title: {
      text: "CandleStick Chart - Category X-axis",
      align: "left",
    },

    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      labels: {
        formatter: function (val) {
          return dayjs(val).format("MMM DD HH:mm");
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };
  return (
    <div className="bg-[#070815] font-mono text-teal-900 border-[2px] border-slate-700 p-2 md:p-4 rounded-lg">
      <ReactApexChart
        options={options}
        series={[{ data }]}
        type="candlestick"
        height={428}
      />
    </div>
  );
}
