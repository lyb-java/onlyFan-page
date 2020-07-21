<template>
  <Card>
  <div>
    <div>
        <span>学生姓名：</span>
        <Input v-model="condition.studentName" placeholder="请输入学生姓名"  clearable style="width: 200px" />
      &nbsp;&nbsp;
        <span>科目名称：</span>
        <Input v-model="condition.subjectName" placeholder="请输入科目名称"  clearable style="width: 200px" />
      &nbsp;&nbsp;
      <span class="search-lable">考试时间：</span>
      <DatePicker @on-change="condition.startingTime=$event" v-model.trim="condition.startingTime"
                  format="yyyy-MM-dd" type="date" placeholder="考试时间" style="width:200px"/>
      &nbsp;&nbsp;
      <Button type="primary" icon="ios-search" :loading="serachLoading" @click="getTable()">&nbsp;&nbsp;查询</Button>&nbsp;&nbsp;
      <Button type="primary" icon="ios-add" @click="addClick()">&nbsp;&nbsp;添加</Button>
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
  import {mapMutations} from "vuex";
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
          studentName:null,
          subjectName:null,
          startingTime:null,
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
            title: '学生姓名',
            key: 'studentName',
            align: 'center',
          },
          {
            title: '考试科目名称',
            key: 'subjectName',
            align: 'center',
          },
          {
            title: '考试成绩',
            key: 'points',
            align: 'center',
          },
          {
            title: '考试开始时间',
            key: 'startTime',
            align: 'center',
          },
          {
            title: '考试结束时间',
            key: 'endTime',
            align: 'center',
          },
          {
            title: '操作人',
            key: 'opUserName',
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
                      this.$router.push({ name: 'achievementEdit',
                        params: { 'achievementId': params.row.achievementId }
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
                        path:'achievementDetail',
                        query: { 'achievementId': params.row.achievementId }
                      })
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
                      this.delete(params.row.achievementId)
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
    name: 'achievementAdd',
    methods:{
      ...mapMutations([
        'closeTag'
      ]),
      /** 查询列表 */
      getTable(){
        let t = this
        let params = {
          pageIndex: t.pageIndex,
          pageSize: t.pageSize,
          condition: t.condition
        }
        this.serachLoading = true
        ajax(config2.host_admin + config2.getAchievementAll, 'post',params)
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
                value.startTime = formatString(value.startTime+'')
                value.endTime = formatString(value.endTime+'')
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
              config2.host_admin + config2.delAchievement + '?achievementId=' + id, 'post'
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
          path:'achievementAdd'
        })
      }
      },

  }
</script>
