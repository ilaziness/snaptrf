package redis

import (
	"context"
	"errors"

	"github.com/redis/go-redis/v9"
)

var Client *redis.Client

var ErrConnNotOk = errors.New("redis client unable to connect to server ")

type Config struct {
	Addr     string
	Password string
	DB       int
}

func InitRedis(cfg Config) {
	Client = redis.NewClient(&redis.Options{
		Addr:     cfg.Addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})
	if res := Client.Ping(context.Background()); res.Val() != "PONG" {
		panic(ErrConnNotOk)
	}
}
