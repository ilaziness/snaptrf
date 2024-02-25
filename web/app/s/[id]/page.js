'use client'

import {getMsg} from "@/api/msg";
import React from 'react';
import {Box, Alert, Typography, Textarea, Grid, Input, Button, Stack} from '@mui/joy'
import {Loading} from "@/components/util";
import {AlertError} from "@/components/alert";

const MsgBody = ({body}) => {
    const [hidden, setHidden] = React.useState(true)
    return (
        <>
            <Typography level="title-lg">消息内容：</Typography>
            <Box sx={{marginTop: 2}}>
                <Textarea
                    onFocus={() => setHidden(false)}
                    onBlur={() => setHidden(true)}
                    value={hidden ? "点击查看" : body}
                    size="lg"
                />
            </Box>
        </>
    )
}

const InputPwd = ({id, setData, setLifetime}) => {
    const [pwd, setPwd] = React.useState("")
    const fetch = async () => {
        const result = await getMsg(id, pwd)
        if (result.code !== 0) {
            AlertError(result.message)
            return
        }
        setLifetime(result.data.period)
        setData(result)
    }
    return (
        <Grid container justifyContent="center">
            <Grid xs={8} sm={6} md={4}>
                <Stack spacing={2} direction="row" useFlexGap>
                    <Input placeholder="输入查看密码" onChange={(e) => setPwd(e.target.value.trim())} />
                    <Button onClick={fetch} variant="outlined">查看</Button>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default function Page({params}) {
    const [del, setDel] = React.useState(false)
    const [data, setData] = React.useState(null)
    const [lifetime, setLifetime] = React.useState(0)

    React.useEffect(() => {
        const fetchData = async () => {
            const result = await getMsg(params.id)
            if (!ignore) {
                if (result.code === 0) {
                    setLifetime(result.data.period)
                }
                setData(result)
            }
        }
        let ignore = false
        fetchData()
        return () => {
            ignore = true
        }
    }, [params.id])
    
    if (!data) {
        return <Loading />
    }
    if (data.code === 1000) {
        return <InputPwd id={params.id} setData={setData} setLifetime={setLifetime} />
    }
    if (data.code !== 0) {
        return (
            <Grid container justifyContent="center">
                <Grid xs={11} sm={11} md={8}>
                    <Alert variant="soft" color="danger">
                        {data.message}
                    </Alert>
                </Grid>
            </Grid>
        )
    }
    if (del) {
        return (
            <Grid container justifyContent="center">
                <Grid xs={11} sm={11} md={8}>
                    <Alert variant="soft" color="danger">已删除</Alert>
                </Grid>
            </Grid>
        )
    }

    const updateLifetime = () => {
        if (lifetime - 1 === 0) {
            setDel(true)
            return
        }
        setLifetime(lifetime - 1)
        setTimeout(updateLifetime, 1000)
    }
    if (lifetime > 0) {
        setTimeout(updateLifetime, 1000)
    }

    return (
        <Grid container justifyContent="center">
            <Grid xs={11} sm={11} md={8}>
                <MsgBody body={data.data.content}/>
                {lifetime > 0 && <Typography color="danger" variant="plain">{lifetime}</Typography>}
            </Grid>
        </Grid>
    )
}