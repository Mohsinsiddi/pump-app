import { Trade } from "@/action/type/type";
import * as d3 from "d3";

type TradingChartDataType = {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
};

type SERIES_DATA_TYPE = {
  x: Date;
  y: number[];
};

export const convertToOHLC = (trades: Trade[], interval: number) => {
  if (trades) {
    trades.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Group data based on the specified interval
    var groupedData: any = {};
    trades.forEach((d) => {
      var timestamp =
        Math.floor(new Date(d.created_at).getTime() / interval) * interval;
      if (!groupedData[timestamp]) {
        groupedData[timestamp] = [];
      }
      groupedData[timestamp].push(d);
    });

    var result: SERIES_DATA_TYPE[] = [];

    // O. H. L. C

    // Process each group
    Object.keys(groupedData).forEach((timestamp) => {
      var group = groupedData[timestamp];
      var tempObject: any = {};
      var format = d3.timeFormat("%Y-%m-%d %H:%M:%S");

      // Calculate OHLC for the group
      tempObject.date = format(new Date(parseInt(timestamp)));
      tempObject.open = Number(group[0].price);
      tempObject.close = Number(group[group.length - 1].price);
      tempObject.high = Number(d3.max(group, (e: { price: any }) => e.price));
      tempObject.low = Number(d3.min(group, (e: { price: any }) => e.price));
      const series_data = {
        x: new Date(parseInt(timestamp)),
        y: [
          Number(group[0].price),
          Number(d3.max(group, (e: { price: any }) => e.price)),
          Number(d3.min(group, (e: { price: any }) => e.price)),
          Number(group[group.length - 1].price),
        ],
      };
      result.push(series_data);
    });
    return result;
  }
};
