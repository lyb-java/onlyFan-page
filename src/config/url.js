// 开发
// admin工程
const host_admin = "http://localhost:8083/onlyfan";
const page = 'http://localhost:8089'

const config = {
  host_admin,
  page,
  login: "/index/login",
  /** 系统用户信息管理 */
  //用户列表
  getUserAll: "/index/getuserall",
  //用户新增
  addUser: "/index/adduser",
  //用户编辑
  editUser: "/index/edituser",
  //用户详情
  getUserDetail: "/index/getusedetail",
  //用户删除
  delUser: "/index/deluser",
  /** 系统角色管理 */
  //用户列表
  getRoleAll: "/sysrole/getall",
  //用户新增
  addRole: "/sysrole/add",
  //用户编辑
  editRole: "/sysrole/edit",
  //用户详情
  getRoleDetail: "/sysrole/getdetail",
  //用户删除
  delRole: "/sysrole/delete",
};

export default config;
