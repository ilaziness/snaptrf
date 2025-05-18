package snaptrf

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"github.com/spf13/cobra"
	"snaptrf/internal/base/config"
	"snaptrf/internal/router"
	"snaptrf/pkg/storage/redis"
)

var (
	cfgFile = ""
)

var SnapTRF = &cobra.Command{
	Use:   "httpd",
	Short: "http server",
	Long:  "run http server",
	Run: func(cmd *cobra.Command, args []string) {
		if err := runWebServer(); err != nil {
			log.Println(err)
		}
	},
}

func init() {
	SnapTRF.Flags().StringVar(&cfgFile, "config", "", "config file (default is ./config/config.toml)")
}

func runWebServer() error {
	if cfgFile != "" {
		config.ConfFile = cfgFile
	}
	config.InitConfig()

	gin.SetMode(config.C.Mode)
	server := gin.Default()
	initServer(server)

	server.GET("ping", func(gctx *gin.Context) {
		gctx.String(http.StatusOK, "pong")
	})
	return server.Run(config.C.Address)
}

func initServer(e *gin.Engine) {
	e.Use(cors.Default())

	redisCfg := redis.Config{}
	err := copier.Copy(&redisCfg, config.R)
	if err != nil {
		panic(err)
	}
	redis.InitRedis(redisCfg)
	router.InitRouter(e)
}
