"use client";
import React, { createContext } from "react";
import { Snackbar } from "@mui/material";

export const AlertContext = createContext(null);
const AlertComponent = ({ children }) => {
  const defaultCfg = { content: "", show: false };
  const [alertMsg, setAlertMsg] = React.useState(defaultCfg);

  const AlertMsg = (content) => {
    setAlertMsg({ content: content, show: true });
  };

  return (
    <>
      <AlertContext.Provider value={{ AlertMsg }}>
        {children}
      </AlertContext.Provider>
      <Snackbar
        open={alertMsg.show}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={2000}
        onClose={() => setAlertMsg(defaultCfg)}
        message={alertMsg.content}
      />
    </>
  );
};

export default AlertComponent;
