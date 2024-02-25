package router

import (
	"github.com/gin-gonic/gin"
	"snaptrf/internal/handler"
)

func InitRouter(e *gin.Engine) {
	e.GET("msg/:id/*pwd", handler.ShowMsg)
	e.POST("msg", handler.AddMsg)
}
