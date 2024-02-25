package snowid

import "github.com/bwmarrin/snowflake"

var sf *snowflake.Node

func init() {
	var err error
	sf, err = snowflake.NewNode(1)
	if err != nil {
		panic(err)
	}
}

func GetNextID() string {
	return sf.Generate().String()
}
