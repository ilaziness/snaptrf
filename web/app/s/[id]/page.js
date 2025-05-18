"use client";

import { getMsg } from "@/api/msg";
import React, { useContext } from "react";
import { AlertContext } from "@/components/alert";
import {
  Box,
  Alert,
  Typography,
  TextField,
  Grid,
  Input,
  Button,
  Stack,
} from "@mui/material";
import { Loading } from "@/components/util";

const MsgBody = ({ body }) => {
  const [hidden, setHidden] = React.useState(true);
  return (
    <>
      <Box sx={{ marginTop: 2 }}>
        <TextField
          multiline={true}
          onFocus={() => setHidden(false)}
          onBlur={() => setHidden(true)}
          value={hidden ? "点击查看" : body}
          sx={{ width: "100%" }}
        />
      </Box>
    </>
  );
};

const InputPwd = ({ id, setData, setLifetime }) => {
  const [pwd, setPwd] = React.useState("");
  const { AlertMsg } = useContext(AlertContext);
  const fetch = async () => {
    const result = await getMsg(id, pwd);
    if (result.code !== 0) {
      AlertMsg(result.message);
      return;
    }
    setLifetime(result.data.period);
    setData(result);
  };
  return (
    <Grid container justifyContent="center">
      <Grid xs={8} sm={6} md={4}>
        <Stack spacing={2} direction="row" useFlexGap>
          <Input
            placeholder="输入查看密码"
            onChange={(e) => setPwd(e.target.value.trim())}
          />
          <Button onClick={fetch} variant="outlined">
            查看
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

const Countdown = ({ lifetime, fnDel }) => {
  const [ttl, setTtl] = React.useState(lifetime);
  const [inter, setInter] = React.useState(null);
  const updateTTL = () => {
    setTtl((ttl) => {
      if (ttl - 1 <= 0) {
        fnDel(true);
        return;
      }
      return ttl - 1;
    });
  };

  if (lifetime > 0 && !inter) {
    const interval = setInterval(updateTTL, 1000);
    setInter(interval);
  }

  return (
    <Typography color="danger" variant="plain">
      倒计时: {ttl}秒
    </Typography>
  );
};

export default function Page({ params }) {
  const [del, setDel] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [lifetime, setLifetime] = React.useState(0);
  const [id, setId] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      const id = (await params).id;
      const result = await getMsg(id);
      if (!ignore) {
        if (result.code === 0) {
          setLifetime(result.data.period);
        }
        setData(result);
        setId(id);
      }
    };
    let ignore = false;
    fetchData();
    return () => {
      ignore = true;
    };
  }, [params]);

  if (!data) {
    return <Loading />;
  }
  if (data.code === 1000) {
    return <InputPwd id={id} setData={setData} setLifetime={setLifetime} />;
  }
  if (data.code !== 0) {
    return (
      <Grid container justifyContent="center">
        <Grid xs={11} sm={11} md={8}>
          <Alert severity="error">{data.message}</Alert>
        </Grid>
      </Grid>
    );
  }
  if (del) {
    return (
      <Grid container justifyContent="center">
        <Grid xs={11} sm={11} md={8}>
          <Alert severity="warning">已删除</Alert>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid justifyContent="center">
      <Grid>
        <MsgBody body={data.data.content} />
        {lifetime > 0 && <Countdown lifetime={lifetime} fnDel={setDel} />}
      </Grid>
    </Grid>
  );
}
