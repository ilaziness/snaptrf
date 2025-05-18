"use client";
import "@/app/css/index.css";
import React, { useContext } from "react";
import { AlertContext } from "@/components/alert";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import {
  Slider,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { createMsg } from "@/api/msg";
import Config from "@/config";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LinkIcon from "@mui/icons-material/Link";
import KeyIcon from "@mui/icons-material/Key";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import QRCode from "qrcode";
import { copy } from "@/components/util";

const MsgResult = ({ msgId, pwd, setShowResult }) => {
  const [qrData, setQrData] = React.useState("");
  const [showQr, setShowQr] = React.useState(false);
  const link = `${Config.host}/s/${msgId}`;
  const { AlertMsg } = useContext(AlertContext);
  const createQr = async () => {
    const opts = {
      margin: 1,
    };
    setQrData(await QRCode.toDataURL(link, opts).then((url) => url));
    setShowQr(true);
  };

  const handleCopy = (content) => {
    if (copy(content)) {
      AlertMsg("复制成功");
    } else {
      AlertMsg("复制失败");
    }
  };

  return (
    <div className="msg-result">
      <div className="msg-result-row">
        <LinkIcon
          fontSize="large"
          color="primary"
          sx={{ marginRight: "5px" }}
        />
        <Typography level="title-lg">{link}</Typography>
        <Tooltip title="点击复制链接" placement="top">
          <IconButton
            color="primary"
            sx={{ marginLeft: "10px" }}
            className="copylink"
            onClick={() => {
              handleCopy(link);
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </div>
      {pwd && (
        <div className="msg-result-row">
          <KeyIcon
            fontSize="large"
            color="primary"
            sx={{ marginRight: "5px" }}
          />
          <Typography level="title-lg">{pwd}</Typography>
          <Tooltip title="点击复制密码" placement="top">
            <IconButton
              color="primary"
              sx={{ marginLeft: "10px" }}
              className="copypwd"
              onClick={() => {
                handleCopy(pwd);
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
      <div className="msg-result-row">
        <QrCodeIcon
          fontSize="large"
          color="primary"
          sx={{ marginRight: "5px" }}
        />
        {!showQr && (
          <Tooltip title="点击生成二维码" placement="top">
            <IconButton
              color="primary"
              sx={{ marginLeft: "10px" }}
              onClick={createQr}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        )}
        {showQr && <img src={qrData} alt="qrcode" />}
      </div>

      <div className="msg-back">
        <Button
          onClick={() => setShowResult(false)}
          color="primary"
          variant="contained"
          size="lg"
        >
          返回
        </Button>
      </div>
    </div>
  );
};

const NewMsg = ({ setShowMsg, setShowResult }) => {
  const inputRef = React.useRef(null);
  const [msg, setMsg] = React.useState("");
  const [genPwd, setGenPwd] = React.useState(0);
  const [period, setPeriod] = React.useState(0);
  const [times, setTimes] = React.useState(1);
  const { AlertMsg } = useContext(AlertContext);

  const submit = async (event) => {
    event.preventDefault();

    if (msg.length === 0) {
      AlertMsg("消息内容不能为空");
      return;
    }
    if (msg.length > 20480) {
      AlertMsg("消息最大长度是20480个字符");
      return;
    }
    if (times > 100) {
      AlertMsg("查看次数不能超过100");
      return;
    }
    // console.log(msg, genPwd, period, times)
    const result = await createMsg({
      content: msg,
      gen_pwd: genPwd,
      period: period,
      times: times,
    });
    if (result.code === 0) {
      setShowMsg({ id: result.data.id, pwd: result.data.pwd });
      setShowResult(true);
    } else {
      AlertMsg(result.message);
    }
    // console.log(result)
  };

  return (
    <>
      <form onSubmit={submit}>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            multiline={true}
            name="content"
            placeholder={"输入内容......"}
            minRows={5}
            onChange={(event) => setMsg(event.target.value.trim())}
            sx={{ width: "100%" }}
          />
        </FormControl>

        <div className="form-row">
          <FormLabel sx={{ alignSelf: "center" }}>需要查看密码？</FormLabel>
          <Switch
            name="gen_pwd"
            onChange={(event) =>
              event.target.checked ? setGenPwd(1) : setGenPwd(0)
            }
          />
        </div>

        <div className="form-row">
          <FormLabel sx={{ alignSelf: "center", minWidth: "90px" }}>
            展示时长：
          </FormLabel>
          <Slider
            name="period"
            min={0}
            max={60}
            defaultValue={0}
            step={5}
            valueLabelDisplay="auto"
            valueLabelFormat={(val) => `${val}秒`}
            onChange={(event) => setPeriod(event.target.value)}
          />
        </div>
        <div className="form-row">
          <FormLabel sx={{ alignSelf: "center" }}>可查看次数：</FormLabel>
          <TextField
            name="times"
            type="number"
            defaultValue={1}
            slotProps={{
              input: {
                ref: inputRef,
                min: 1,
                max: 100,
                step: 1,
              },
            }}
            sx={{ maxWidth: "100px" }}
            onChange={(event) => setTimes(parseInt(event.target.value))}
          />
        </div>
        {/*<div className="tips">*/}
        {/*  <Typography variant="subtitle1">*/}
        {/*    展示时长等于0为不限时，查看次数达到后会立即删除；*/}
        {/*  </Typography>*/}
        {/*  <Typography variant="subtitle1">*/}
        {/*    大于0时达到设置的时间和次数后才会删除；*/}
        {/*  </Typography>*/}
        {/*  <Typography variant="subtitle1">*/}
        {/*    查看次数大于1，展示时长大于0时，展示时长仅会影响当前页面的查看，不会影响实际的数据。*/}
        {/*  </Typography>*/}
        {/*</div>*/}
        <div>
          <Button type="submit" variant="contained" size="large" fullWidth>
            保存
          </Button>
        </div>
      </form>
    </>
  );
};

export default function Home() {
  const [showResult, setShowResult] = React.useState(false);
  const [msg, setMsg] = React.useState({ id: "", pwd: "" });

  if (showResult) {
    return (
      <>
        <MsgResult msgId={msg.id} pwd={msg.pwd} setShowResult={setShowResult} />
      </>
    );
  }

  return (
    <>
      <NewMsg setShowMsg={setMsg} setShowResult={setShowResult} />
    </>
  );
}
