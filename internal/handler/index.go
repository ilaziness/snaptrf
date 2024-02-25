package handler

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	gredis "github.com/redis/go-redis/v9"
	redisgo "github.com/redis/go-redis/v9"
	"snaptrf/internal/base/response"
	"snaptrf/internal/base/response/errcode"
	"snaptrf/internal/entity"
	"snaptrf/internal/schema"
	"snaptrf/pkg/snowid"
	"snaptrf/pkg/storage/redis"
)

func ShowMsg(ctx *gin.Context) {
	req := schema.MsgGetReq{}
	if err := ctx.ShouldBindUri(&req); err != nil {
		response.Render(ctx, nil, err)
		return
	}
	result, err := redis.Client.Get(ctx, req.Id).Result()
	if err != nil && errors.Is(err, redisgo.Nil) {
		response.Render(ctx, nil, errors.New("消息不存在"))
		return
	}
	if err != nil && !errors.Is(err, redisgo.Nil) {
		slog.Error(fmt.Sprintf("get cache msg err: %s, id: %s", err, req.Id))
		response.Render(ctx, nil, errors.New("获取失败"))
		return
	}
	if result == "" {
		response.Render(ctx, nil, errors.New("消息为空"))
		return
	}
	msg := entity.Msg{}
	err = json.Unmarshal([]byte(result), &msg)
	if err != nil {
		slog.Error(fmt.Sprintf("get msg err: %s, id: %s", err, req.Id))
		response.Render(ctx, nil, errors.New("获取失败"))
		return
	}
	req.Pwd = req.Pwd[1:]
	if msg.Password != "" && req.Pwd == "" {
		response.Render(ctx, nil, errcode.GetMsgPwdRequired)
		return
	}
	if msg.Password != "" && req.Pwd != msg.Password {
		response.Render(ctx, nil, errcode.GetMsgPwdErr)
		return
	}

	resp := schema.MsgGetResp{}
	err = copier.Copy(&resp, msg)
	if err != nil {
		slog.Error(fmt.Sprintf("get msg err: %s, id: %s", err, req.Id))
		response.Render(ctx, nil, errors.New("获取失败"))
		return
	}
	if msg.Times == 1 {
		_, err = redis.Client.ExpireLT(ctx, msg.ID, time.Second*time.Duration(msg.Period)).Result()
		if err != nil {
			slog.Info(fmt.Sprintf("%v", err))
		}
	} else {
		timesKey := fmt.Sprintf("times:%s", msg.ID)
		showCount, err := redis.Client.Get(ctx, timesKey).Int()
		if err != nil && !errors.Is(err, gredis.Nil) {
			slog.Info(fmt.Sprintf("%v", err))
		} else if err != nil && errors.Is(err, gredis.Nil) {
			redis.Client.Set(ctx, timesKey, 1, time.Hour*24)
		} else if showCount >= msg.Times-1 {
			redis.Client.Del(ctx, timesKey)
			redis.Client.Del(ctx, msg.ID)
		} else {
			redis.Client.Incr(ctx, timesKey)
		}
		resp.Period = 0
	}
	response.Render(ctx, resp, nil)
}

func genPassword() string {
	letters := "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	rbuf := make([]byte, 6)
	if _, err := rand.Read(rbuf); err != nil {
		return "C9BcjK"
	}
	passwd := make([]byte, 6)
	for i, r := range rbuf {
		passwd[i] = letters[int(r)%len(letters)]
	}

	return string(passwd)
}

func AddMsg(ctx *gin.Context) {
	req := schema.MsgAddReq{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.Render(ctx, nil, err)
		return
	}
	if req.Period == 0 && req.Times == 0 {
		response.Render(ctx, nil, errors.New("展示时长和展示次数不能同时为空"))
		return
	}
	if req.Period > 600 {
		response.Render(ctx, nil, errors.New("有效时长最大不能超过10分钟"))
		return
	}
	if req.Times > 10 {
		response.Render(ctx, nil, errors.New("展示次数最大不能超过10次"))
		return
	}
	pwd := ""
	if req.Password != "" {
		pwd = req.Password
	} else if req.GenPwd == 1 {
		pwd = genPassword()
	}
	msg := entity.Msg{
		ID:       snowid.GetNextID(),
		Content:  req.Content,
		Password: pwd,
		Period:   req.Period,
		Times:    req.Times,
	}
	jstr, err := json.Marshal(msg)
	if err != nil {
		slog.Error(fmt.Sprintf("json.Marshal err: %s, data: %+v", err, msg))
		response.Render(ctx, nil, errors.New("保存失败"))
	}
	if result := redis.Client.Set(ctx, msg.ID, jstr, time.Hour*24); result.Err() != nil {
		slog.Error(fmt.Sprintf("save msg error, status: %s", result.Err()))
		response.Render(ctx, nil, errors.New("保存失败"))
		return
	}
	response.Render(ctx, schema.MsgAddResp{Id: msg.ID, Pwd: msg.Password}, nil)
}
