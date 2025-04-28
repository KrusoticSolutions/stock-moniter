"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import firebaseAuth from "@/firebaseAuth";
import { Box, Button, Typography } from "@mui/material";
import { Dropdown, Panel, PopupModal, TextBox } from "./Components/UI";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IStock } from "./types";
import axiosBaseApi from "@/axiosConfig";
import * as yup from "yup";
import FormManager from "./Components/Common/FormManager";

const DashboardPage = () => {
  const router = useRouter();
  const [stockData, setStockData] = useState<IStock[]>([]);
  const [apiUsage, setApiUsage] = useState<any>([]);
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);
  const [alertValue, setAlertValue] = useState({
    ticker: "AAPL",
    price: 0,
    increment: true,
  });

  const yupSchema = yup.object().shape({
    price: yup
      .number()
      .required("Price is required")
      .typeError("Price must be a number")
      .positive("Price must be a greater than 0"),
  });

  const columns: GridColDef[] = [
    { field: "symbol", headerName: "Symbol", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      valueFormatter: (value) => `$ ${value}`,
    },
    {
      field: "percentchange",
      headerName: "Percent change",
      flex: 1,
      valueFormatter: (value) => `${value} %`,
    },
    {
      field: "open",
      headerName: "Open",
      flex: 1,

      valueFormatter: (value) => `$ ${value}`,
    },
    {
      field: "high",
      headerName: "High",
      flex: 1,

      valueFormatter: (value) => `$ ${value}`,
    },
    {
      field: "low",
      headerName: "Low",
      flex: 1,
      valueFormatter: (value) => `$ ${value}`,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}
        >
          <Button
            variant="rounded"
            onClick={() => router.push("/" + params.row.symbol)}
          >
            Chart
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    if (router) {
      const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        if (!user) {
          router.push("/login");
        }
      });
      return () => unsubscribe();
    }
  }, [router]);

  useEffect(() => {
    fetchStockData();
    const tempEmail = localStorage.getItem("email");
    if (tempEmail) {
      setEmail(tempEmail);
    }
  }, []);

  const fetchStockData = async () => {
    try {
      const { data } = await axiosBaseApi.get("getStockData");
      const resData = await axiosBaseApi.get("getUserAlert");

      setStockData(data);
      if (resData.data) {
        const alertData = resData.data;
        setAlertValue({
          ticker: alertData.ticker,
          price: Number(alertData.price),
          increment: alertData.increment,
        });
      } else {
        setAlertValue({
          ticker: data[0]?.symbol,
          price: data[0]?.price,
          increment: true,
        });
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const getAPIUsage = async () => {
    try {
      const { data } = await axiosBaseApi.get("getAPIUsage");
      setApiUsage([data]);
      console.log("API usage data:", data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const handleSignOut = () => {
    firebaseAuth
      .signOut()
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log("Alert values:", values);
      await axiosBaseApi.post("setUserAlert", { ...values });
      alert("Alert set successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error setting alert:", error);
    }
  };

  return (
    <Box style={{ padding: 50 }}>
      <PopupModal
        headerText={"Set Stock Alerts"}
        open={open}
        handleClose={() => setOpen(false)}
        showClose
      >
        <Box sx={{ minWidth: "450px", my: 2, mb: 5 }}>
          <FormManager
            initialValues={alertValue}
            yupSchema={yupSchema}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              submitDisable,
              touched,
              values,
            }) => (
              <>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Dropdown
                      label={"Select Stock"}
                      menuItems={stockData.map((item) => ({
                        label: item.symbol + " - " + item.price + " $",
                        value: item.symbol,
                      }))}
                      value={values.ticker}
                      fullWidth
                      getValue={(value) => {
                        const e: any = {
                          target: {
                            name: "ticker",
                            value: value,
                          },
                        };
                        handleChange(e);
                      }}
                    />
                  </Box>
                  <Box>
                    <Dropdown
                      label={"Alert when price is"}
                      menuItems={[
                        { label: "Greater than", value: true },
                        { label: "Less than", value: false },
                      ]}
                      value={values.increment}
                      fullWidth
                      getValue={(value) => {
                        const e: any = {
                          target: {
                            name: "increment",
                            value: value,
                          },
                        };
                        handleChange(e);
                      }}
                    />
                  </Box>

                  <TextBox
                    type="number"
                    placeholder="Price"
                    name="price"
                    label={"Price value"}
                    fullWidth
                    value={values.price}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price && errors.price}
                  />
                  <Button
                    variant="rounded"
                    sx={{ mt: 2 }}
                    type="submit"
                    disabled={submitDisable}
                  >
                    Set Alert
                  </Button>
                </Box>
              </>
            )}
          </FormManager>
        </Box>
      </PopupModal>
      <PopupModal
        headerText={"API Usage"}
        open={usageOpen}
        handleClose={() => setUsageOpen(false)}
        showClose
      >
        <Box sx={{ minWidth: "550px", my: 2, mb: 5 }}>
          <DataGrid
            loading={apiUsage.length === 0}
            rows={apiUsage}
            columns={[
              {
                field: "stockDataApiCalls",
                headerName: "Data API Calls",
                flex: 1,
              },
              {
                field: "stockDataTimeFrameApiCalls",
                headerName: "Data time frame API Calls",
                flex: 1,
              },
            ]}
            getRowId={(row) => row.stockDataApiCalls}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </Box>
      </PopupModal>
      <Panel sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h3" fontWeight={700}>
              Welcome to the Dashboard 🚀
            </Typography>
            <Typography sx={{ fontSize: 18, color: "text.secondary" }}>
              {email}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="rounded"
              disabled={stockData.length === 0}
              onClick={() => setOpen(true)}
            >
              Set Alerts
            </Button>
            <Button
              variant="rounded"
              color="error"
              onClick={() => {
                setUsageOpen(true);
                getAPIUsage();
              }}
            >
              Usage
            </Button>
            <Button
              color="secondary"
              variant="rounded"
              onClick={() => handleSignOut()}
            >
              Logout
            </Button>
          </Box>
        </Box>
        <DataGrid
          loading={stockData.length === 0}
          rows={stockData}
          columns={columns}
          getRowId={(row) => row.symbol}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{ field: "price", sort: "desc" }],
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Panel>
    </Box>
  );
};

export default DashboardPage;
