package schema

type MsgAddReq struct {
	Content  string `json:"content" binding:"required,min=3,max=268"`  // 内容
	Password string `json:"password" binding:"omitempty,min=3,max=32"` // 查看密码
	GenPwd   int    `json:"gen_pwd" binding:"omitempty"`               // 生成密码
	Period   int    `json:"period" binding:"omitempty,min=0,max=600"`  // 有效时常, 秒
	Times    int    `json:"times" binding:"omitempty,min=0,max=10"`    // 展示次数
}

type MsgAddResp struct {
	Id  string `json:"id"`
	Pwd string `json:"pwd"`
}

type MsgGetReq struct {
	Id  string `form:"id" uri:"id" binding:"required,max=20"`
	Pwd string `form:"pwd" uri:"pwd" binding:"omitempty,max=20"`
}
type MsgGetResp struct {
	ID      string `json:"id"`
	Content string `json:"content"`
	Period  uint   `json:"period"` // 有效时常，单位秒
}
