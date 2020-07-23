<template>
  <Card>
  <div>
    <div>
        <span>用户名称：</span>
        <Input v-model="condition.userName" placeholder="请输入用户名称"  clearable style="width: 200px" />
      &nbsp;&nbsp;
        <span>账号：</span>
        <Input v-model="condition.account" placeholder="请输入账号"  clearable style="width: 200px" />
        &nbsp;&nbsp;
        <span>是否有效：</span>
        <Select v-model="condition.isEnable" style="width:200px" clearable>
          <Option  value="0" >否</Option>
          <Option  value="1" >是</Option>
        </Select>
      &nbsp;&nbsp;
      <Button type="primary" icon="ios-search" :loading="serachLoading" @click="getTable()">&nbsp;&nbsp;查询</Button>&nbsp;&nbsp;
      <Button type="primary" icon="ios-add" @click="addModalClick()">&nbsp;&nbsp;添加</Button>
    </div>
    <br>
  <div>
    <Table stripe :columns="columns"  border :loading="loading" :data="tableData"/>
  <div style="text-align: right; margin-top: 5px">
    <Page :total="total" :page-size="pageSize" show-elevator show-total @on-change="e=>{pageSearch(e)}"/>
  </div>
  </div>
<!--  添加  -->
    <Modal
      v-model="addModal"
      title="添加用户">
      <Form ref="addReqDto" :model="addReqDto" :rules="addRuleValidate" :label-width="140" style="margin-top: 30px">
        <Form-item label="用户名称：" prop="userName">
          <Input v-model.trim="addReqDto.userName" placeholder="请填写用户名称" style="width: 204px"/>
        </Form-item>
        <Form-item label="用户类型：" prop="roleId"  >
          <Select v-model.trim="addReqDto.roleId" filterable style="width:204px" @on-change="showSel(addReqDto.roleId)">
            <Option v-for="item in roles" :value="item.roleId" :key="item.roleId">{{item.roleName}}</Option>
          </Select>
        </Form-item>
      <!--        1 管理员 2 教师 3 学生-->
        <Form-item label="教师：" prop="teacherId" :hidden="showTeacher">
        <Select v-model.trim="addReqDto.teacherId" filterable style="width:204px">
          <Option v-for="item in teacherList" :value="item.teacherId" :key="item.teacherId">{{item.name}}</Option>
        </Select>
      </Form-item>
        <Form-item label="学生：" prop="studentId" :hidden="showStudent">
          <Select v-model.trim="addReqDto.studentId" filterable style="width:204px">
            <Option v-for="item in studentList" :value="item.studentId" :key="item.studentId">{{item.name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="用户账号：" prop="account">
          <Input type="input" v-model.trim="addReqDto.account" placeholder="请填写用户账号" style="width: 204px" />
        </Form-item>
        <Form-item label="密　　码：" prop="password" >
          <Input v-model="addReqDto.password" type="password" password placeholder="请填写密码" style="width: 200px" />
        </Form-item>
        <Form-item label="确认密码：" prop="password1" >
          <Input v-model="addReqDto.password1" type="password" password placeholder="请填写确认密码" style="width: 200px" />
        </Form-item>
        <Form-item label="是否有效：" prop="isEnable">
          <RadioGroup v-model="addReqDto.isEnable">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button :loading="addLoading" type="primary"  @click="validateSubmitAdd()">保存</Button>
        <Button @click="addCancel()">取消</Button>
      </div>
    </Modal>
    <!--  编辑  -->
    <Modal
      v-model="editModal"
      title="编辑用户">
      <Form ref="editReqDto" :model="editReqDto" :rules="editRuleValidate" :label-width="140" style="margin-top: 30px">
        <Form-item label="用户名称：" prop="userName">
          <Input v-model.trim="editReqDto.userName" placeholder="请填写用户名称" style="width: 204px"/>
        </Form-item>
        <Form-item label="用户类型：" prop="roleId">
          <Select v-model="editReqDto.roleId" filterable style="width:204px">
            <Option v-for="item in roles" :value="item.roleId" :key="item.roleId">{{item.roleName}}</Option>
          </Select>
          <!--        1 管理员 2 教师 3 学生-->
          <Form-item label="教师：" prop="teacherId">
            <Select v-model.trim="addReqDto.teacherId" filterable style="width:204px">
              <Option v-for="item in teacherList" :value="item.teacherId" :key="item.teacherId">{{item.name}}</Option>
            </Select>
          </Form-item>
          <Form-item label="学生：" prop="studentId"  >
            <Select v-model.trim="addReqDto.studentId" filterable style="width:204px">
              <Option v-for="item in studentList" :value="item.studentId" :key="item.studentId">{{item.name}}</Option>
            </Select>
          </Form-item>
        </Form-item>
        <Form-item label="用户账号：" prop="account">
          <Input type="input" v-model.trim="editReqDto.account" placeholder="请填写用户账号" style="width: 204px" />
        </Form-item>
        <Form-item label="密　　码：" prop="password" >
          <Input v-model="editReqDto.password" type="password" password placeholder="请填写密码" style="width: 200px" />
        </Form-item>
        <Form-item label="确认密码：" prop="password1" >
          <Input v-model="editReqDto.password1" type="password" password placeholder="请填写确认密码" style="width: 200px" />
        </Form-item>
        <Form-item label="是否有效：" prop="isEnable">
          <RadioGroup v-model="editReqDto.isEnable">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button :loading="editLoading" type="primary" @click="validateSubmitEdit()">保存</Button>
        <Button @click="editCancel()">取消</Button>
      </div>
    </Modal>
<!--  查看详情  -->
    <Modal
      v-model="userDetailModal"
      title="用户信息">
      <Form ref="userDetailDto" :model="userDetailDto"  :label-width="140" style="margin-top: 30px">
        <Form-item label="用户名称：" prop="userName">
          <span>{{userDetailDto.userName}}</span>
        </Form-item>
        <Form-item label="用户账号：" prop="account">
          <span>{{userDetailDto.account}}</span>
        </Form-item>
        <Form-item label="用户类型：" prop="roleName">
          <span>{{userDetailDto.roleName}}</span>
        </Form-item>
        <Form-item label="是否有效：" prop="isEnable">
          <span>{{userDetailDto.isEnable}}</span>
        </Form-item>
        <Form-item label="创建时间：" prop="createTime">
          <span>{{userDetailDto.createTime}}</span>
        </Form-item>
        <Form-item label="修改时间：" prop="updateTime">
          <span>{{userDetailDto.updateTime}}</span>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="userDetailCancel()">取消</Button>
      </div>
    </Modal>
  </div>
  </Card>
</template>
<script>
  import config2 from '@/config/url'
  import { ajax } from '@/libs/https'
  import { formatString } from '@/api/Utlis'
  export default {
    data () {
      const pwdValid =(rule, value, callback) => {
        let password = this.addReqDto.password
        let password1 = this.addReqDto.password1
        if (password !== password1) {
          callback(new Error('两次密码不一致！'))
        }
        callback()
      }
      const pwdValid1 =(rule, value, callback) => {
        let password = this.editReqDto.password
        let password1 = this.editReqDto.password1
        if (password !== password1) {
          callback(new Error('两次密码不一致！'))
        }
        callback()
      }
      const teacherVali =(rule, value, callback) => {
        let roleId =  this.addReqDto.roleId
        if (roleId === 2 && value ==null || value < 1) {
          callback(new Error('请选择教师'))
        }
        callback()
      }
      const studentVali =(rule, value, callback) => {
        let roleId =  this.addReqDto.roleId
        if (roleId === 3 && value ==null || value < 1) {
          callback(new Error('请选择学生'))
        }
        callback()
      }

      return {
        showTeacher:true,
        showStudent:true,
        PAGE_INDEX: 1,
        /* 分页total属性绑定值 */
        total: 0,
        loading: false,
        serachLoading: false,
        /* pageInfo实体 */
        pageIndex: 1,
        pageSize: 10,
        /* 查询条件 */
        condition: {
          userName:null,
          account:null,
          isEnable:null,
        },
        /* 菜单信息列表数据 */
        tableData:[],
        columns: [
          {
            title: '序号',
            align: 'center',
            key: 'indexNum',
            width: 60
          },
          {
            title: '用户名称',
            key: 'userName',
            tooltip: true,
            align: 'center'
          },
          {
            title: '账号',
            key: 'account',
            tooltip: true,
            align: 'center'
          },
          {
            title: '有效状态',
            key: 'isEnable',
            tooltip: true,
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'roleName',
            tooltip: true,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            tooltip: true,
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', {}, [
                h('Button', {
                  props: { type: 'warning',size:'small' },
                  style:{
                    marginRight : '3px'
                  },
                  on: {
                    click: () => {
                      this.editModalClick(params.row.userId)
                    }
                  }
                },'编辑'),
                h('Button', {
                  props: { type: 'primary',size:'small' },
                  style:{
                    marginRight : '3px'
                  },
                  on: {
                    click: () => {
                      this.userDetailClick(params.row.userId)
                    }
                  }
                },'查看详情'),
                h('Button', {
                  props: { type: 'error',size:'small' },
                  style:{
                    marginRight : '3px'
                  },
                  on: {
                    click: () => {
                      this.delete(params.row.userId)
                    }
                  }
                },'删除'),
              ])
            }
          }
        ],
        /** 添加用户属性声明 */
        //添加模态框
        addModal:false,
        //按钮转转转
        addLoading:false,
        roles:[],
        teacherList:[],
        studentList:[],
        addReqDto: {
          studentId:null,
          teacherId:null,
          account:null,
          password: null,
          userName: null,
          isEnable: '1',
          password1:null,
        },
        /** 添加用户属性声明 */
        //添加模态框
        editModal:false,
        //按钮转转转
        editLoading:false,
        editReqDto: {},
        /** 表单验证 */
        addRuleValidate: {
          roleId: [
            { required: true, message: '请选择用户类型',trigger: 'change', type: 'number' }
          ],
          studentId: [
            { required: true, trigger: 'change', type: 'number',validators:studentVali }
          ],
          teacherId: [
            { required: true,trigger: 'change', type: 'number',validators:teacherVali }
          ],
          account: [
            { required: true, message: '账户不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', max: 8, message: '最多输入8个字符', trigger: 'blur' },
          ],
          password1: [
            { required: true, message: '确认密码不能为空', trigger: 'blur'},
            { type: 'string', max: 8, message: '最多输入8个字符', trigger: 'blur' },
            { validator: pwdValid, trigger: 'blur' },
          ],
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          isEnable: [
            { required: true, message: '请选择是否有效', trigger: 'change' }
          ],
        },
        /** 表单验证 */
        editRuleValidate: {
          account: [
            { required: true, message: '账户不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          roleId: [
            { required: true, message: '请选择用户类型',trigger: 'change', type: 'number' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', max: 8, message: '最多输入8个字符', trigger: 'blur' },
          ],
          password1: [
            { required: true, message: '确认密码不能为空', trigger: 'blur'},
            { type: 'string', max: 8, message: '最多输入8个字符', trigger: 'blur' },
            { validator: pwdValid1, trigger: 'blur' },
          ],
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          isEnable: [
            { required: true, message: '请选择是否有效', trigger: 'change' }
          ],
        },
        userDetailModal:false,
        userDetailDto:{},
      }
    },
    created() {
      this.getTable()
    },
    methods:{
      /** 查询用户列表 */
      getTable(){
        let t = this
        let params = {
          pageIndex: t.pageIndex,
          pageSize: t.pageSize,
          condition: t.condition
        }
        this.serachLoading = true
        ajax(config2.host_admin + config2.getUserAll, 'post',params)
          .then(res => {
            this.serachLoading = false
            let result = res.data.data
            if (res.data.code === '000000') {
              t.tableData = result.pageData
              t.total = result.totalCount
              t.tableData.forEach(function(value, index) {
                value.indexNum = index + (t.pageIndex - 1) * t.pageSize + 1
                if (value.isEnable === '0') {
                  value.isEnable = '无效'
                } else if(value.isEnable === '1') {
                  value.isEnable = '有效'
                }
                value.createTime = formatString(value.createTime+'')
              })
            } else {
              t.$Modal.error({
                title: '失败',
                content: result.msg
              })
            }
          }).catch(err => {
          this.serachLoading = false
          t.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后:'+err
          })
        })
      },

      /** 切换页码 */
      pageSearch (e) {
        this.pageIndex = e
        this.getTable()
      },
      /** 添加表单验证 */
      validateSubmitAdd () {
        this.addUser()
        // this.$refs['addReqDto'].validate(valid => {
        //   if (valid) {
        //     this.addUser()
        //   } else {
        //     this.$Message.error('请完善表单信息!')
        //   }
        // })
      },
      /** 添加用户提交 */
      addUser () {
        let params = this.addReqDto
        this.addLoading=true
        ajax(config2.host_admin + config2.addUser, 'post', params)
          .then(res => {
            this.addLoading=false
            if (res.data.code === '000000') {
              this.$Message.success(res.data.msg)
              this.addCancel()
              this.getTable()
            } else {
              this.$Modal.error({
                title: '失败',
                content: res.data.msg
              })
            }
          }).catch(() => {
          this.addLoading=false
          this.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后'
          })
        })
      },
      /** 点击添加清空添加表单 */
      addModalClick(){
        this.addModal = true;
        this.$refs['addReqDto'].resetFields()
        this.getUserRole()
        this.getStudentOption()
        this.getTeacherOption()
      },
      /** 点击取消清空添加表单 */
      addCancel(){
        this.$refs['addReqDto'].resetFields()// 重置表单
        this.addModal = false
        this.roles = []
      },
      /** 点击编辑  打开并清空表单 */
      editModalClick(id){
        this.editModal = true
        this.$refs['editReqDto'].resetFields()
        this.getUserRole()
        this.getUser(id,1)
        this.getStudentOption()
        this.getTeacherOption()
      },
      /** 点击取消清空编辑表单 */
      editCancel(){
        this.$refs['editReqDto'].resetFields()// 重置表单
        this.editModal = false
        this.roles = []
      },
      /** 查询用户详情  type 0 详情  1 编辑 */
      getUser(id,type){
        let t = this
        ajax(config2.host_admin + config2.getUserDetail + '?userId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
              if(type === 0){
                this.userDetailDto = result
                if(this.userDetailDto.isEnable === '0'){
                  this.userDetailDto.isEnable = '无效'
                }else{
                  this.userDetailDto.isEnable = '有效'
                }
                this.userDetailDto.createTime = formatString(this.userDetailDto.createTime+'')
                this.userDetailDto.updateTime = formatString(this.userDetailDto.updateTime+'')
              }else{
                this.editReqDto = result
                this.editReqDto.password = ''
              }


            } else {
              t.$Modal.error({
                title: '失败',
                content: result.msg
              })
            }
          }).catch(err => {
          t.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后:'+err
          })
        })
      },
      /** 查询用户角色下拉列表 */
      getUserRole(id,type){
        let t = this
        ajax(config2.host_admin + config2.getRoleAllOption, 'post')
          .then(res => {
            let result = res.data
            if (res.data.code === '000000') {
              this.roles = result.data
            } else {
              t.$Modal.error({
                title: '失败',
                content: result.msg
              })
            }
          }).catch(err => {
          t.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后:'+err
          })
        })
      },
      /** 添加表单验证 */
      validateSubmitEdit () {
        // this.$refs['editReqDto'].validate(valid => {
        //   if (valid) {
            this.editUser()
          // } else {
          //   this.$Message.error('请完善表单信息!')
          // }
        // })
      },
      /** 用户编辑提交 */
      editUser(){
        let params = this.editReqDto
        this.editLoading=true
        ajax(config2.host_admin + config2.editUser, 'post', params)
          .then(res => {
            this.editLoading=false
            if (res.data.code === '000000') {
              this.$Message.success(res.data.msg)
              this.editCancel()
              this.getTable()
            } else {
              this.$Modal.error({
                title: '失败',
                content: res.data.msg
              })
            }
          }).catch(() => {
          this.editLoading=false
          this.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后'
          })
        })
      },
      /** 详情 */
      userDetailClick(id){
        this.userDetailModal = true
        this.getUser(id,0)
      },
      /** 详情点击取消  关闭模态框 */
      userDetailCancel(){
        this.userDetailModal = false
      },
      delete (id) {
        this.$Modal.confirm({
          title: '确定删除该数据吗？',
          loading: true,
          onOk: () => {
            let t = this
            ajax(
              config2.host_admin + config2.delUser + '?userId=' + id, 'post'
            )
              .then(res => {
                if (res.data.code !== '000000') {
                  t.$Message.error(res.data.msg)
                } else {
                  t.$Modal.remove()
                  t.$Message.success(res.data.msg)
                  t.getTable()
                }
              })
              .catch(() => {
                this.$Modal.error({
                  title: '失败',
                  content: '系统维护中，请稍后'
                })
              })
          },
          onCancel: () => {
            this.loading = false
          }
        })
      },
      /** 查询学生下拉列表 */
      getStudentOption(){
        let t = this
        ajax(config2.host_admin + config2.getStudentAllOption, 'post')
          .then(res => {
            let result = res.data
            if (res.data.code === '000000') {
              this.studentList = result.data
            } else {
              t.$Modal.error({
                title: '失败',
                content: result.msg
              })
            }
          }).catch(err => {
          t.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后:'+err
          })
        })
      },
      /** 查询教师下拉列表 */
      getTeacherOption(){
        let t = this
        ajax(config2.host_admin + config2.getTeacherAllOption, 'post')
          .then(res => {
            let result = res.data
            if (res.data.code === '000000') {
              this.teacherList = result.data
            } else {
              t.$Modal.error({
                title: '失败',
                content: result.msg
              })
            }
          }).catch(err => {
          t.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后:'+err
          })
        })
      },
      showSel(roleId){
        if(roleId === 2){
          this.showTeacher = false;
          this.showStudent = true;
        }else  if(roleId === 3){
          this.showStudent = false;
          this.showTeacher = true;
        }

      },
      },
  }
</script>
