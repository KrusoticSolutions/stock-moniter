"use client";

import { Poppins } from "next/font/google";
import "./styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles/theme";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "./Components/UI";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--poppins-font",
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const Router = useRouter();
  const pathname = usePathname();
  const [accessToken, setAccessToken] = useState<any>();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    } else {
      Router.replace("/login");
    }
  }, [Router, pathname]);

  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        {accessToken || pathname === "/login" ? (
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        ) : (
          <Loading />
        )}
      </body>
    </html>
  );
};

export default RootLayout;
