<template>
  <Card>
  <div>
    <div>
        <span>学号：</span>
        <Input v-model="condition.stuNo" placeholder="请输入学号"  clearable style="width: 200px" />
      &nbsp;&nbsp;
        <span>姓名：</span>
        <Input v-model="condition.name" placeholder="请输入姓名"  clearable style="width: 200px" />
      &nbsp;&nbsp;
      <span>班级名称：</span>
      <Input v-model="condition.className" placeholder="请输入班级名称"  clearable style="width: 200px" />
      &nbsp;&nbsp;
      <span>手机号：</span>
      <Input v-model="condition.phone" placeholder="请输入手机号"  clearable style="width: 200px" />
      <br/>
      <br/>
      <span>性别：</span>
      <Select v-model="condition.gender" placeholder="请选择性别" style="width:200px" clearable>
        <Option  value="0" >男</Option>
        <Option  value="1" >女</Option>
      </Select>
      &nbsp;&nbsp;
      <span>状态：</span>
        <Select v-model="condition.state" style="width:200px" placeholder="请选择状态" clearable>
          <Option  value="0" >在校 </Option>
          <Option  value="1" >离校</Option>
        </Select>
      &nbsp;&nbsp; &nbsp;&nbsp;
      <Button type="primary" icon="ios-search" :loading="serachLoading" @click="getTable()">&nbsp;&nbsp;查询</Button>&nbsp;&nbsp;
      <Button type="primary" icon="ios-add" @click="addClick()" v-if=" this.access === 'super_admin' ||  this.access === 'admin_teacher'">
        &nbsp;&nbsp;添加</Button>
        &nbsp;&nbsp;
    </div>
    <br>
    <div>
      <Table stripe  :columns="columns"  border :loading="loading" :data="tableData"/>
    <div style="text-align: right; margin-top: 5px">
      <Page :total="total" :page-size="pageSize" show-elevator show-total @on-change="e=>{pageSearch(e)}"/>
    </div>
  </div>
  </div>
  </Card>
</template>
<script>
  import config2 from '@/config/url'
  import { ajax } from '@/libs/https'
  import { formatString } from '@/api/Utlis'
  import {getAccess} from "../../libs/util";
  export default {
    data () {
      return {
        access:getAccess(),
        PAGE_INDEX: 1,
        /* 分页total属性绑定值 */
        total: 0,
        loading: false,
        serachLoading: false,
        /* pageInfo实体 */
        pageIndex: 1,
        pageSize: 10,
        showMore:false,
        /* 查询条件 */
        condition: {
          stuNo:null,
          className:null,
          name:null,
          phone:null,
          gender:null,
          state:null,
        },
        /* 菜单信息列表数据 */
        tableData:[],
        columns: [
          {
            title: '序号',
            align: 'center',
            key: 'indexNum',
          },
          {
            title: '学号',
            key: 'stuNo',
            align: 'center',
          },
          {
            title: '姓名',
            key: 'name',
            tooltip: true,
            align: 'center',
          },
          {
            title: '所属班级',
            key: 'className',
            tooltip: true,
            align: 'center',
          },
          {
            title: '性别',
            key: 'gender',
            tooltip: true,
            align: 'center',
          },
          {
            title: '手机号',
            key: 'phone',
            tooltip: true,
            align: 'center',
          },
          {
            title: '状态',
            key: 'state',
            tooltip: true,
            align: 'center',
          },
          {
            title: '操作人',
            key: 'opUserName',
            tooltip: true,
            align: 'center',
          },
          {
            title: '修改时间',
            key: 'updateTime',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return  h('div', {}, [
                this.access !== 'admin_student' && h('Button', {
                  props: { type: 'warning',size:'small' },
                  style:{
                    marginRight : '3px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ name: 'studentEdit',
                        params: { 'studentId': params.row.studentId }
                      })
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
                      this.$router.push({
                        path:'studentDetail',
                        query: { 'studentId': params.row.studentId }
                      })
                    }
                  }
                },'查看详情'),
                this.access !== 'admin_student' &&  h('Button', {
                  props: { type: 'error',size:'small' },
                  style:{
                    marginRight : '3px'
                  },
                  on: {
                    click: () => {
                      this.delete(params.row.studentId)
                    }
                  }
                },'删除'),
              ])
            }
          }
        ],
      }
    },
    created() {
      this.getTable()
    },
    methods:{
      /** 查询列表 */
      getTable(){
        let t = this
        let params = {
          pageIndex: t.pageIndex,
          pageSize: t.pageSize,
          condition: t.condition
        }
        this.serachLoading = true
        ajax(config2.host_admin + config2.getStudentAll, 'post',params)
          .then(res => {
            this.serachLoading = false
            let result = res.data.data
            if (res.data.code === '000000') {
              t.tableData = result.pageData
              t.total = result.totalCount
              t.tableData.forEach(function(value, index) {
                value.indexNum = index + (t.pageIndex - 1) * t.pageSize + 1
                if (value.state === '0') {
                  value.state = '在校'
                } else if(value.state === '1') {
                  value.state = '离校'
                }
                if (value.gender === '0') {
                  value.gender = '男'
                } else if(value.gender === '1') {
                  value.gender = '女'
                }
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
      delete (id) {
        this.$Modal.confirm({
          title: '确定删除该数据吗？',
          loading: true,
          onOk: () => {
            let t = this
            ajax(
              config2.host_admin + config2.delStudent + '?studentId=' + id, 'post'
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
      //添加页面跳转
      addClick(){
        this.$router.push({
          path:'studentAdd'
        })
      }
      },

  }
</script>
