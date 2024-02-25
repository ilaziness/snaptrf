package entity

type Msg struct {
	ID        string
	Content   string
	Password  string // 访问密码
	Period    int    // 有效时常，单位秒
	Times     int    // 展示次数
	ShowCount int    // 已展示次数
}
