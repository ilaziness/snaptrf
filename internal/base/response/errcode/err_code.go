package errcode

import "snaptrf/internal/base/response"

var (
	GetMsgPwdRequired = response.ErrCode{Code: 1000, Message: "密码不能为空"}
	GetMsgPwdErr      = response.ErrCode{Code: 1001, Message: "密码错误"}
)
