package response

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrCode struct {
	Code    int
	Message string
}

func (ec ErrCode) Error() string {
	return ec.Message
}

func Render(ctx *gin.Context, data any, err error) {
	resp := RespBody{}
	resp.Data = data
	if err != nil {
		var ec ErrCode
		if errors.As(err, &ec) {
			resp.Code = ec.Code
			resp.Message = ec.Message
		} else {
			resp.Code = 1
			resp.Message = err.Error()
		}
		ctx.JSON(http.StatusOK, resp)
	} else {
		resp.Code = 0
		ctx.JSON(http.StatusOK, resp)
	}
}

type RespBody struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    any    `json:"data"`
	ID      string `json:"id"`
}
