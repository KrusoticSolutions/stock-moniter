"use client";

import { Box } from "@mui/material";
import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartProps {
  data: {
    time: string;
    date: string;
    close: number;
    open: number;
  }[];
}
const Chart = ({ data }: ChartProps) => {
  console.log("Chart data:", data);
  return (
    <Box sx={{ width: "100%", minHeight: "50vh", marginTop: 5 }}>
      {data.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>No data available. please change the date</h2>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" aspect={3} height="100%">
          <LineChart
            data={data.reverse()}
            margin={{
              top: 10,
              right: 80,
              left: 80,
              bottom: 0,
            }}
          >
            <XAxis dataKey="time" />
            <YAxis domain={["dataMin"]} />
            <Tooltip
              formatter={(value, name, props) => {
                return [
                  value + " $",
                  props.dataKey === "close" ? "Close" : "Open",
                ];
              }}
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="close"
              stroke="#1034A6"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default Chart;
