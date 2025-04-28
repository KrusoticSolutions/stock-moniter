"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Panel } from "../Components/UI";
import { Box, Button, Divider, Typography } from "@mui/material";
import CustomDatePicker from "../Components/UI/DatePicker";
import Chart from "../Components/UI/Chart";
import { useRouter } from "next/navigation";
import axiosBaseApi from "@/axiosConfig";

function adjustDateIfWeekend(date: Date) {
  const day = date.getDay();

  if (day === 0) {
    // Sunday
    date.setDate(date.getDate() - 2);
  } else if (day === 6) {
    // Saturday
    date.setDate(date.getDate() - 1);
  }
  console.log("Adjusted date:", date);
  return date;
}

const StockTickerData = () => {
  const router = useRouter();
  const params = useParams();
  const [ticker, setTicker] = useState<string>("");
  const [stockData, setStockData] = useState<any>([]);

  useEffect(() => {
    console.log("params", params.ticker);
    if (params.ticker) {
      const tempData = params.ticker as string;
      setTicker(tempData);
      getStockDataTimeFrame(tempData);
    }
  }, [params]);

  const getStockDataTimeFrame = async (ticker: string, date = new Date()) => {
    try {
      const tempDate = adjustDateIfWeekend(date);
      const response = await axiosBaseApi(`getStockDataByTicker`, {
        params: { ticker, date: tempDate },
      });
      setStockData(response.data);
      console.log("Stock data:", response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const handleDateChange = (date: string) => {
    console.log("Selected date:", date);
    getStockDataTimeFrame(ticker, new Date(date));
  };

  return (
    <Box sx={{ padding: 10 }}>
      <Panel>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h5" width={"fit-content"} fontWeight={700}>
              Stock Time frame of {ticker}
            </Typography>
            <Button variant="rounded" onClick={() => router.push("/")}>
              Go back
            </Button>
          </Box>
          <CustomDatePicker getDateChangeValue={handleDateChange} />
        </Box>

        <Typography color="text.secondary" fontWeight={700}>
          All prices are in US $
        </Typography>
        <Divider sx={{ my: 5 }} />

        <Chart data={stockData} />
      </Panel>
    </Box>
  );
};

export default StockTickerData;
