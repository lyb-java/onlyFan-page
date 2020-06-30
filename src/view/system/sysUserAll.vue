<template>
  <Card>
  <div>
    <div>
        <span>用户名称：</span>
        <Input v-model="condition.userName" placeholder="请输入用户名称"  clearable style="width: 200px" />
      &nbsp;&nbsp;
        <span>账户名称：</span>
        <Input v-model="condition.account" placeholder="请输入账户名称"  clearable style="width: 200px" />
        &nbsp;&nbsp;
        <span>是否有效：</span>
        <Select v-model="condition.isEnable" style="width:200px" clearable>
          <Option  value="0" >否</Option>
          <Option  value="1" >是</Option>
        </Select>
      &nbsp;&nbsp;
      <Button type="primary" icon="ios-search" @click="getTable()">&nbsp;&nbsp;查询</Button>&nbsp;&nbsp;
      <Button type="primary" icon="ios-add" @click="addUser()">&nbsp;&nbsp;添加</Button>
    </div>
    <br>
  <div>
    <Table stripe :columns="columns" :loading="loading" :data="tableData"/>
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
  export default {
    data () {
      return {
        PAGE_INDEX: 1,
        /* 分页total属性绑定值 */
        total: 0,
        loading: false,
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
            width: 80
          },
          {
            title: '用户名称',
            key: 'userName',
            tooltip: true,
            align: 'center'
          },
          {
            title: '账户名称',
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
        ],
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
        this.loading = true
        ajax(config2.host_admin + config2.getUserAll, 'post',params)
          .then(res => {
            this.loading = false
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
          this.loading = false
          t.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后:'+err
          })
        })
      },
      addUser(){
        this.$router.push({
          path: 'addUser',
          // name: 'addUser'
        })
      },
      /** 切换页码 */
      pageSearch (e) {
        this.pageIndex = e
        this.getTable()
      },
      },
  }
</script>
