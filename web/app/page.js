'use client'

import './css/index.css'
import React from 'react';
import Textarea from '@mui/joy/Textarea';
import Switch from '@mui/joy/Switch';
import {Input, Slider, Button, FormControl, FormLabel, IconButton, Tooltip, Typography, Grid} from "@mui/joy";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {createMsg} from "@/api/msg";
import Config from "@/config";
import {AlertError} from "@/components/alert";
import QrCodeIcon from '@mui/icons-material/QrCode';
import LinkIcon from '@mui/icons-material/Link';
import KeyIcon from '@mui/icons-material/Key';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QRCode from 'qrcode';
import {copy} from '@/components/util'

const MsgResult = ({msgId, pwd, setShowResult}) => {
    const [qrData, setQrData] = React.useState("")
    const [showQr, setShowQr] = React.useState(false)
    const link = `${Config.host}/s/${msgId}`
    const createQr = async () => {
        const opts = {
            margin: 1
        }
        setQrData(await QRCode.toDataURL(link, opts).then(url => url))
        setShowQr(true)
    }

    return (
        <div className="msg-result">
            <div className="msg-result-row">
                <LinkIcon fontSize="large" color="primary" sx={{marginRight: "5px"}}/>
                <Typography level="title-lg">{link}</Typography>
                <Tooltip title="点击复制链接" placement="top">
                    <IconButton
                        color="primary"
                        sx={{marginLeft: "10px"}}
                        className="copylink"
                        onClick={() => {
                            copy(link)
                        }}
                    >
                        <ContentCopyIcon/>
                    </IconButton>
                </Tooltip>
            </div>
            {pwd &&
                <div className="msg-result-row">
                    <KeyIcon fontSize="large" color="primary" sx={{marginRight: "5px"}}/>
                    <Typography level="title-lg">{pwd}</Typography>
                    <Tooltip title="点击复制密码" placement="top">
                        <IconButton
                            color="primary"
                            sx={{marginLeft: "10px"}}
                            className="copypwd"
                            onClick={() => {
                                copy(pwd)
                            }}
                        >
                            <ContentCopyIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            }
            <div className="msg-result-row">
                <QrCodeIcon fontSize="large" color="primary" sx={{marginRight: "5px"}}/>
                {!showQr &&
                    <Tooltip title="点击生成二维码" placement="top">
                        <IconButton
                            color="primary"
                            sx={{marginLeft: "10px"}}
                            onClick={createQr}
                        >
                            <VisibilityIcon/>
                        </IconButton>
                    </Tooltip>
                }
                {showQr &&
                    <img src={qrData} alt="qrcode"/>
                }
            </div>

            <div className="msg-back">
                <Button startDecorator={<ArrowBackIosIcon/>} onClick={() => setShowResult(false)}
                        color="primary" variant="soft" size="lg">返回</Button>
            </div>
        </div>
    )
}

const NewMsg = ({setShowMsg, setShowResult}) => {
    const inputRef = React.useRef(null);
    const [msg, setMsg] = React.useState("")
    const [genPwd, setGenPwd] = React.useState(0)
    const [period, setPeriod] = React.useState(10)
    const [times, setTimes] = React.useState(1)

    const submit = async event => {
        event.preventDefault()

        if (msg.length === 0) {
            AlertError('消息内容不能为空')
            return
        }
        if (msg.length > 200) {
            AlertError('消息最大长度是200个字符')
            return
        }
        console.log(msg, genPwd, period, times)
        const result = await createMsg({
            content: msg, gen_pwd: genPwd, period: period, times: times
        })
        if (result.code === 0) {
            setShowMsg({id: result.data.id, pwd: result.data.pwd})
            setShowResult(true)
        } else {
            AlertError(result.message)
        }
        console.log(result)
    }

    return (
        <>
            <form onSubmit={submit}>
                <FormControl>
                    <Textarea
                        name="content"
                        placeholder={"输入内容......"}
                        minRows={5}
                        onChange={event => setMsg(event.target.value.trim())}
                    />
                </FormControl>

                <FormControl className="form-row">
                    <FormLabel sx={{alignSelf: "center"}}>
                        需要查看密码？
                    </FormLabel>
                    <Switch
                        name="gen_pwd"
                        onChange={event => event.target.checked ? setGenPwd(1) : setGenPwd(0)}
                    />
                </FormControl>

                <FormControl className="form-row">
                    <FormLabel sx={{alignSelf: "center", minWidth: "70px"}}>展示时长：</FormLabel>
                    <Slider
                        name="period"
                        min={0}
                        max={60}
                        defaultValue={10}
                        step={5}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(val) => `${val}秒`}
                        onChange={event => setPeriod(event.target.value)}
                    />
                </FormControl>
                <FormControl className="form-row">
                    <FormLabel sx={{alignSelf: "center"}}>可查看次数：</FormLabel>
                    <Input
                        name="times"
                        type="number"
                        defaultValue={1}
                        slotProps={{
                            input: {
                                ref: inputRef, min: 1, max: 10, step: 1,
                            },
                        }}
                        sx={{maxWidth: "80px"}}
                        onChange={event => setTimes(parseInt(event.target.value))}
                    />
                </FormControl>
                <div>
                    <Button type="submit" size="lg" fullWidth>保存</Button>
                </div>
            </form>
        </>
    )
}

export default function Home() {
    const [showResult, setShowResult] = React.useState(false)
    const [msg, setMsg] = React.useState({id: "", pwd: ""})


    if (showResult) {
        return (
            <Grid container={true} justifyContent="center">
                <Grid xs={11} sm={11} md={8} lg={8} xl={8}>
                    <MsgResult msgId={msg.id} pwd={msg.pwd} setShowResult={setShowResult}/>
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid container={true} justifyContent="center">
            <Grid xs={11} sm={11} md={8} lg={8} xl={8}>
                <NewMsg setShowMsg={setMsg} setShowResult={setShowResult}/>
            </Grid>
        </Grid>
    )
}
