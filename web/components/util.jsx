import { CircularProgress, Grid } from "@mui/material";

export const copy = (e) => {
  let n = document.createElement("span");
  n.textContent = e;
  n.style.whiteSpace = "pre";
  n.style.userSelect = "all";
  document.body.appendChild(n);
  let a = window.getSelection(),
    r = window.document.createRange();
  a.removeAllRanges();
  r.selectNode(n);
  a.addRange(r);
  let o = !1;
  try {
    o = window.document.execCommand("copy");
  } finally {
    a.removeAllRanges();
    window.document.body.removeChild(n);
  }
  return o;
};

export const Loading = () => {
  return (
    <Grid container justifyContent="center" sx={{ margin: "20px 0" }}>
      <CircularProgress />
    </Grid>
  );
};
