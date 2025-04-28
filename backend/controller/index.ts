import axios from "axios";
import express from "express";
import { getRedisItem, setRedisItem } from "../redisInstance";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseAuth";
import sendEmail from "../mailTransporter";

interface IStock {
  symbol: string;
  name: string;
  price: number;
  percentchange: number;
  open: number;
  high: number;
  low: number;
}

const top100 = [
  "AAPL",
  "MSFT",
  "AMZN",
  "NVDA",
  "GOOGL",
  "META",
  "AVGO",
  "JPM",
  "XOM",
  "LLY",
  "UNH",
  "V",
  "PG",
  "JNJ",
  "MA",
  "COST",
  "ORCL",
  "HD",
  "MRK",
  "ABBV",
  "ADBE",
  "CRM",
  "PEP",
  "BAC",
  "WMT",
  "PFE",
  "AMD",
  "KO",
  "NFLX",
  "DIS",
  "CSCO",
  "ABT",
  "ACN",
  "CVX",
  "TMO",
  "MCD",
  "DHR",
  "LIN",
  "INTC",
  "BMY",
  "TXN",
  "AMGN",
  "COP",
  "HON",
  "LMT",
  "CAT",
  "GILD",
  "NKE",
  "UPS",
  "UNP",
  "MS",
  "LOW",
  "SBUX",
  "BA",
  "SPGI",
  "RTX",
  "INTU",
  "GS",
  "AMT",
  "MDLZ",
  "ISRG",
  "GE",
  "NOW",
  "ADI",
  "BLK",
  "C",
  "DE",
  "SYK",
  "SCHW",
  "PLD",
  "TGT",
  "BKNG",
  "MO",
  "CB",
  "MMC",
  "CI",
  "ZTS",
  "PYPL",
  "SO",
  "PGR",
  "DUK",
  "CL",
  "ICE",
  "GM",
  "TMUS",
  "USB",
  "CME",
  "EW",
  "AON",
  "HCA",
  "BDX",
  "NSC",
  "ETN",
  "ITW",
  "FISV",
  "ADP",
  "MET",
  "PNC",
  "FIS",
  "EQIX",
];

const getAllStockData = async () => {
  const response = await axios.get(
    "https://www.wallstreetoddsapi.com/api/livestockprices",
    {
      params: {
        symbols: top100.join(","), // here to reduce the data size i pick top 100 stocks, but if you want all stocks, just add 'allsymbols' to the params
        sortDir: "des",
        sortBy: "price",
        format: "json",
        fields: "symbol,name,price,percentchange,open,high,low",
        apiKey: process.env.WALLSTREET_KEY,
      },
    }
  );
  return response.data?.response as IStock[];
};

const getStockData = async (req: express.Request, res: express.Response) => {
  try {
    const { uid } = res.locals;

    await updateApiUsage(uid, "stockDataApiCalls");
    const stocks = await getAllStockData();

    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching stock data");
  }
};

const getStockDataByTicker = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { uid } = res.locals;

    const { ticker, date } = req.query;
    const currentDate = date?.toString() ?? new Date().toISOString();

    const userDate = new Date(currentDate).toISOString().split("T")[0];
    const monthData = userDate.split("-").slice(0, 2).join("-");
    if (!ticker) {
      res.status(400).send("Ticker is required");
      return;
    }

    const redisQuery = `chart-${ticker}-${monthData}`;
    console.log("redisQuery", redisQuery);
    const redisData = await getRedisItem(redisQuery);
    let redisDataParsed = JSON.parse(redisData ?? "{}");

    const today = new Date().toISOString().split("T")[0];

    if (Object.keys(redisDataParsed).length === 0 || userDate === today) {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          apikey: process.env.ALPHA_KEY,
          function: "TIME_SERIES_INTRADAY",
          symbol: ticker,
          interval: "15min",
          outputsize: "full",
          month: "2025-04",
        },
      });
      console.log(
        response.data["Time Series (15min)"],
        typeof response.data["Time Series (15min)"]
      );
      await setRedisItem(
        redisQuery,
        JSON.stringify(response.data["Time Series (15min)"])
      );
      redisDataParsed = response.data["Time Series (15min)"];
    }

    const chartData = Object.entries(redisDataParsed)
      .map(([key, value]) => {
        if (key.includes(userDate)) {
          const typedValue = value as { [key: string]: string };
          return {
            time: key.split(" ")[1],
            close: parseFloat(typedValue["4. close"]),
          };
        }
      })
      .filter((item) => item !== undefined);

    await updateApiUsage(uid, "stockDataTimeFrameApiCalls");
    res.json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching chart data");
  }
};

const updateApiUsage = async (uid: string, apiKey: string) => {
  const docRef = doc(db, "usage", uid);

  const isExists = (await getDoc(docRef)).exists();

  if (isExists) {
    await updateDoc(docRef, {
      [apiKey]: increment(1),
    });
  } else {
    await setDoc(docRef, {
      [apiKey]: 1,
    });
  }
};

const getAPIUsage = async (req: express.Request, res: express.Response) => {
  try {
    const { uid } = res.locals;
    const docRef = doc(db, "usage", uid);
    const resData = (await getDoc(docRef)).data();

    res.json(resData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching chart data");
  }
};

const setUserAlert = async (req: express.Request, res: express.Response) => {
  try {
    const { uid } = res.locals;
    const { ticker, price, increment } = req.body;

    const docRef = doc(db, "alerts", uid);
    const isExists = (await getDoc(docRef)).exists();

    if (isExists) {
      await updateDoc(docRef, {
        ticker,
        price,
        increment,
      });
    } else {
      await setDoc(docRef, {
        ticker,
        price,
        increment,
      });
    }
    res.json({ message: "Alert set successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error setting alert");
  }
};

const getUserAlert = async (req: express.Request, res: express.Response) => {
  try {
    const { uid } = res.locals;
    const docRef = doc(db, "alerts", uid);
    const isExists = (await getDoc(docRef)).exists();
    if (!isExists) {
      res.status(200).json(null);
      return;
    }
    const resData = (await getDoc(docRef)).data();
    res.json(resData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching chart data");
  }
};

const alertUsers = async () => {
  try {
    const alertData = (await getDocs(collection(db, "alerts"))).docs.map(
      (doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          ticker: data.ticker,
          price: data.price,
          increment: data.increment,
        };
      }
    );
    const userData = (await getDocs(collection(db, "users"))).docs.map(
      (doc) => {
        const data = doc.data();
        return {
          createdAt: data.createdAt,
          email: data.email,
          uid: data.uid,
        };
      }
    );

    const finalAlertData = [];

    for (let i = 0; i < alertData.length; i++) {
      const { ticker, price, increment } = alertData[i];
      const index = userData.findIndex((item) => item.uid === alertData[i].uid);
      finalAlertData.push({
        ticker,
        price,
        increment,
        email: userData[index].email,
      });
    }

    const stockData = await getAllStockData();
    const affectedAlerts = [];

    for (let i = 0; i < finalAlertData.length; i++) {
      const { ticker, price, increment, email } = finalAlertData[i];

      const tickerIndex = stockData.findIndex((item) => item.symbol === ticker);

      const stockPrice = stockData[tickerIndex]?.price;
      const increasedPrice = stockPrice - Number(price);

      if (increment && stockPrice > Number(price)) {
        const mailData = await sendEmail(
          email,
          "Stock Alert",
          `The stock price of ${ticker} has increased by ${increasedPrice}$ and is now at ${stockPrice}$`
        );
        affectedAlerts.push({
          email,
          ticker,
          price: stockPrice,
          mailData,
        });
      } else if (!increment && stockPrice < Number(price)) {
        const mailData = await sendEmail(
          email,
          "Stock Alert",
          `The stock price of ${ticker} has decreased by ${increasedPrice}$ and is now at ${stockPrice}$`
        );
        affectedAlerts.push({
          email,
          ticker,
          price: stockPrice,
          mailData,
        });
      }
      console.log(
        ticker,
        "=====================>",
        price,
        increment,
        stockPrice,
        increasedPrice,
        email
      );
    }
    console.log("affectedAlerts", affectedAlerts);
  } catch (error) {
    console.error(error);
  }
};

export default {
  getStockData,
  getStockDataByTicker,
  getAPIUsage,
  setUserAlert,
  getUserAlert,
  alertUsers,
};
