"use client"
import React from "react";
import {Snackbar} from "@mui/joy";

const Alert = (content, color) => {
    if (!color || color === "") {
        color = "primary"
    }
    innerSetAlertMsg({color: color, content: content, show: true})
}

export const AlertInfo = (content) => {
    Alert(content, "primary")
}

export const AlertSuccess = (content) => {
    Alert(content, "success")
}

export const AlertError = (content) => {
    Alert(content, "danger")
}

export const AlertWarning = (content) => {
    Alert(content, "warning")
}

let innerSetAlertMsg
export const AlertComponent = () => {
    const defaultCfg = {color: "primary", content: "", show: false}
    const [alertMsg, setAlertMsg] = React.useState(defaultCfg)
    innerSetAlertMsg = setAlertMsg

    return (
        <Snackbar
            open={alertMsg.show}
            anchorOrigin={{horizontal: 'center', vertical: 'top'}}
            autoHideDuration={2000}
            color={alertMsg.color}
            onClose={() => setAlertMsg(defaultCfg)}
        >
            {alertMsg.content}
        </Snackbar>
    )
}