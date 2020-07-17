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
  //角色下拉列表
  getRoleAllOption: "/sysrole/getoption",
  //角色列表
  getRoleAll: "/sysrole/getall",
  //角色新增
  addRole: "/sysrole/add",
  //角色编辑
  editRole: "/sysrole/edit",
  //角色详情
  getRoleDetail: "/sysrole/getdetail",
  //角色删除
  delRole: "/sysrole/delete",

  /** 学生信息管理 */
  //下拉列表
  getStudentAllOption: "/student/getalloption",
  //列表
  getStudentAll: "/student/getallpage",
  //新增
  addStudent: "/student/add",
  //编辑
  editStudent: "/student/edit",
  //详情
  getStudentDetail: "/student/getdetail",
  //删除
  delStudent: "/student/delete",
  /** 学生成绩管理 */
  //列表
  getAchievementAll: "/achievement/getallpage",
  //新增
  addAchievement: "/achievement/add",
  //编辑
  editAchievement: "/achievement/edit",
  //详情
  getAchievement: "/achievement/getdetail",
  //删除
  delAchievement: "/achievement/delete",
  /** 班级信息管理 */
  //下拉列表
  getClassAllOption: "/class/getalloption",
  //列表
  getClassAll: "/class/getallpage",
  //新增
  addClass: "/class/add",
  //编辑
  editClass: "/class/edit",
  //详情
  getClass: "/class/getdetail",
  //删除
  delClass: "/class/delete",
  /** 课程安排信息管理 */
  //列表
  getCourseAll: "/course/getallpage",
  //新增
  addCourse: "/course/add",
  //编辑
  editCourse: "/course/edit",
  //详情
  getCourse: "/course/getdetail",
  //删除
  delCourse: "/course/delete",
  /** 教师信息管理 */
  //下拉列表
  getTeacherAllOption: "/teacher/getalloption",
  //列表
  getTeacherAll: "/teacher/getallpage",
  //新增
  addTeacher: "/teacher/add",
  //编辑
  editTeacher: "/teacher/edit",
  //详情
  getTeacher: "/teacher/getdetail",
  //删除
  delTeacher: "/teacher/delete",
};

export default config;
