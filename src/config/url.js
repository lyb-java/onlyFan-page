// 开发
// admin工程
const host_admin = "http://localhost:8083";
const host_pro = "http://localhost:8083";
const page = 'http://localhost:8080'

const config = {
  host_admin,
  host_pro,
  page,
  login: "/index/login",
  /** 系统用户信息管理 */
  //用户列表
  getUserAll: "/index/getuserall",
  //用户新增
  addUser: "/index/adduser",
};

export default config;
