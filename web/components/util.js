import {AlertSuccess} from "@/components/alert";
import {CircularProgress, Grid} from "@mui/joy";
import React from "react";

export const copy = (e) => {
    let n = document.createElement('span');
    n.textContent = e
    n.style.whiteSpace = 'pre'
    n.style.userSelect = 'all'
    document.body.appendChild(n);
    let a = window.getSelection(),
        r = window.document.createRange();
    a.removeAllRanges()
    r.selectNode(n)
    a.addRange(r);
    let o = !1;
    try {
        o = window.document.execCommand('copy')
    } finally {
        a.removeAllRanges()
        window.document.body.removeChild(n)
    }
    if (o) {
        AlertSuccess("复制成功")
    } else {
        AlertSuccess("复制失败")
    }
    return o
}

export const Loading = () => {
    return (
        <Grid container justifyContent="center" sx={{margin: "20px 0"}}>
            <CircularProgress/>
        </Grid>
    )
}