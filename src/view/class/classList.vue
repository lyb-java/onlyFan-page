<template>
  <Card>
  <div>
    <div>
        <span>班级名称：</span>
        <Input v-model="condition.name" placeholder="请输入班级名称"  clearable style="width: 200px" />
      &nbsp;&nbsp; &nbsp;&nbsp;
      <Button type="primary" icon="ios-search" :loading="serachLoading" @click="getTable()">&nbsp;&nbsp;查询</Button>&nbsp;&nbsp;
      <Button type="primary" icon="ios-add" @click="addClick()" v-if=" this.access === 'super_admin'">&nbsp;&nbsp;添加</Button>
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
        access: getAccess(),
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
          name:null,
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
            title: '班级名称',
            key: 'name',
            tooltip: true,
            align: 'center',
          },
          {
            title: '所属教师',
            key: 'teacherName',
            tooltip: true,
            align: 'center',
          },
          {
            title: '班级人数',
            key: 'classSize',
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
            title: '创建时间',
            key: 'createTime',
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
              return h('div', {}, [
                h('Button', {
                  props: { type: 'warning',size:'small' },
                  style:{
                    marginRight : '3px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ name: 'classEdit',
                        params: { 'classId': params.row.classId }
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
                        path:'classDetail',
                        query: { 'classId': params.row.classId }
                      })
                    }
                  }
                },'查看详情'),
                this.access === 'super_admin' &&
                h('Button', {
                  props: { type: 'error',size:'small' },
                  style:{
                    marginRight : '3px'
                  },
                  on: {
                    click: () => {
                      this.delete(params.row.classId)
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
        ajax(config2.host_admin + config2.getClassAll, 'post',params)
          .then(res => {
            this.serachLoading = false
            let result = res.data.data
            if (res.data.code === '000000') {
              t.tableData = result.pageData
              t.total = result.totalCount
              t.tableData.forEach(function(value, index) {
                value.indexNum = index + (t.pageIndex - 1) * t.pageSize + 1

                value.updateTime = formatString(value.updateTime+'')
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
      delete (id) {
        this.$Modal.confirm({
          title: '确定删除该数据吗？',
          loading: true,
          onOk: () => {
            let t = this
            ajax(
              config2.host_admin + config2.delClass + '?classId=' + id, 'post'
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
          path:'classAdd'
        })
      }
      },

  }
</script>
