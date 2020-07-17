<template>
  <Card>
  <div>
    <div>
        <span>角色名称：</span>
        <Input v-model="condition.roleName" placeholder="请输入角色名称"  clearable style="width: 200px" />
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
      title="添加角色">
      <Form ref="addReqDto" :model="addReqDto" :rules="addRuleValidate" :label-width="140" style="margin-top: 30px">
        <Form-item label="角色名称：" prop="roleName">
          <Input v-model.trim="addReqDto.roleName" placeholder="请填写角色名称" style="width: 204px"/>
        </Form-item>
        <Form-item label="角色权限代码：" prop="access">
          <Input type="input" v-model.trim="addReqDto.access" placeholder="请填写角色权限代码" style="width: 204px" />
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
      title="编辑角色">
      <Form ref="editReqDto" :model="editReqDto" :rules="editRuleValidate" :label-width="140" style="margin-top: 30px">
        <Form-item label="角色名称：" prop="roleName">
          <Input v-model.trim="editReqDto.roleName" placeholder="请填写角色名称" style="width: 204px"/>
        </Form-item>
        <Form-item label="角色权限代码：" prop="access">
          <Input type="input" v-model.trim="editReqDto.access" placeholder="请填写角色权限代码" style="width: 204px" />
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
      title="角色信息">
      <Form ref="userDetailDto" :model="userDetailDto"  :label-width="140" style="margin-top: 30px">
        <Form-item label="角色名称：" prop="roleName">
          <span>{{userDetailDto.roleName}}</span>
        </Form-item>
        <Form-item label="角色权限代码：" prop="access">
          <span>{{userDetailDto.access}}</span>
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
      return {
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
          roleName:null,
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
            title: '角色名称',
            key: 'roleName',
            tooltip: true,
            align: 'center'
          },
          {
            title: '角色权限代码',
            key: 'access',
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
            title: '修改时间',
            key: 'updateTime',
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
                      this.editModalClick(params.row.roleId)
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
                      this.userDetailClick(params.row.roleId)
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
                      this.delete(params.row.roleId)
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
        addReqDto: {
          roleName:null,
          access: null,

        },
        /** 修改用户属性声明 */
        //添加模态框
        editModal:false,
        //按钮转转转
        editLoading:false,
        editReqDto: {},
        /** 表单验证 */
        editRuleValidate: {
          access: [
            { required: true, message: '角色权限代码不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
        },
        addRuleValidate: {
          access: [
            { required: true, message: '角色权限代码不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
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
        ajax(config2.host_admin + config2.getRoleAll, 'post',params)
          .then(res => {
            this.serachLoading = false
            let result = res.data.data
            if (res.data.code === '000000') {
              t.tableData = result.pageData
              t.total = result.totalCount
              t.tableData.forEach(function(value, index) {
                value.indexNum = index + (t.pageIndex - 1) * t.pageSize + 1
                value.createTime = formatString(value.createTime+'')
                value.updateTime = formatString(value.updateTime+'')
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
        this.$refs['addReqDto'].validate(valid => {
          if (valid) {
            this.addRole()
          } else {
            this.$Message.error('请完善表单信息!')
          }
        })
      },
      /** 添加角色提交 */
      addRole () {
        let params = this.addReqDto
        this.addLoading=true
        ajax(config2.host_admin + config2.addRole, 'post', params)
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
      },
      /** 点击取消清空添加表单 */
      addCancel(){
        this.$refs['addReqDto'].resetFields()// 重置表单
        this.addModal = false
      },
      /** 点击编辑  打开并清空表单 */
      editModalClick(id){
        this.editModal = true
        this.$refs['editReqDto'].resetFields()
        this.getRole(id,1)
      },
      /** 点击取消清空编辑表单 */
      editCancel(){
        this.$refs['editReqDto'].resetFields()// 重置表单
        this.editModal = false
      },
      /** 查询用户详情  type 0 详情  1 编辑 */
      getRole(id,type){
        let t = this
        ajax(config2.host_admin + config2.getRoleDetail + '?roleId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
              if(type === 0){
                this.userDetailDto = result
                this.userDetailDto.createTime = formatString(this.userDetailDto.createTime+'')
                this.userDetailDto.updateTime = formatString(this.userDetailDto.updateTime+'')
              }else{
                this.editReqDto = result
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
      /** 添加表单验证 */
      validateSubmitEdit () {
        this.$refs['editReqDto'].validate(valid => {
          if (valid) {
            this.editRole()
          } else {
            this.$Message.error('请完善表单信息!')
          }
        })
      },
      /** 用户编辑提交 */
      editRole(){
        let params = this.editReqDto
        this.editLoading=true
        ajax(config2.host_admin + config2.editRole, 'post', params)
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
        this.getRole(id,0)
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
              config2.host_admin + config2.delRole + '?roleId=' + id, 'post'
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
      },
  }
</script>
