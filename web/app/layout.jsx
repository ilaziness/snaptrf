import "./globals.css";
import Link from "next/link";
import React from "react";
import AlertComponent from "@/components/alert";
import TelegramIcon from "@mui/icons-material/Telegram";
import Icon from "@mui/material/Icon";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import { Container } from "@mui/material";

export const metadata = {
  title: "阅后即焚 - SnapTrf",
  description: "阅后即焚App",
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <header>
              <Icon color="primary">
                <TelegramIcon />
              </Icon>
              <Link href="/" className="brand">
                SnapTrf
              </Link>
            </header>
            <AlertComponent>
              <Container component={"main"} maxWidth="md">
                {children}
              </Container>
            </AlertComponent>
            <footer>&copy;&nbsp;{year}&nbsp;SnapTrf App</footer>
            <AlertComponent />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
