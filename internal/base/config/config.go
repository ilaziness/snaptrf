package config

import (
	"errors"
	"fmt"
	"path"
	"strings"

	"github.com/spf13/viper"
)

var defaultConfDir = "./config"
var defaultConfFileName = "config.toml"

var ConfFile = ""
var C Config
var R Redis

var ErrFileName = errors.New("config file name error")

type Config struct {
	// 应用ID
	AppId string `mapstructure:"app_id"`
	// 应用名称
	AppName string `mapstructure:"app_name"`
	// 运行模式
	Mode string `mapstructure:"mode"`

	Address string `mapstructure:"address"`
}

type Redis struct {
	Addr     string `mapstructure:"address"`
	Password string `mapstructure:"Password"`
	DB       int    `mapstructure:"DB"`
}

func InitConfig() {
	filePath, name, ext := getConfigFile()
	viper.SetConfigName(name)
	viper.SetConfigType(ext)
	viper.AddConfigPath(filePath)
	if err := viper.ReadInConfig(); err != nil {
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
	if err := viper.UnmarshalKey("app", &C); err != nil {
		panic(fmt.Errorf("decode config file err: %w", err))
	}
	if err := viper.UnmarshalKey("redis", &R); err != nil {
		panic(fmt.Errorf("decode config file err: %w", err))
	}
}

func getConfigFile() (string, string, string) {
	if ConfFile == "" {
		nameSplit := strings.Split(defaultConfFileName, ".")
		return defaultConfDir, nameSplit[0], nameSplit[1]
	}
	filePath, name := path.Split(ConfFile)
	nameSplit := strings.Split(name, ".")
	if len(nameSplit) != 2 {
		panic(ErrFileName)
	}
	return filePath, nameSplit[0], nameSplit[1]
}
