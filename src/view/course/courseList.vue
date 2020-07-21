<template>
  <Card>
  <div>
    <div>
      <span>班级名称：</span>
      <Input v-model="condition.className" placeholder="请输入班级名称"  clearable style="width: 200px" />
      &nbsp;&nbsp; &nbsp;&nbsp;
      <span>教师姓名：</span>
      <Input v-model="condition.teacherName" placeholder="请输入教师姓名"  clearable style="width: 200px" />
      &nbsp;&nbsp;
      <span>课程名称：</span>
      <Input v-model="condition.courseName" placeholder="请输入课程名称"  clearable style="width: 200px" />
      &nbsp;&nbsp;
      <span>是否有效：</span>
      <Select v-model="condition.isEffective" placeholder="请选择是否有效" style="width:200px" clearable>
        <Option  value="0" >无效</Option>
        <Option  value="1" >有效</Option>
      </Select>
      &nbsp;&nbsp;<br/>
      &nbsp;&nbsp;<br/>
        <span class="search-lable">上课时间：</span>
        <DatePicker @on-change="condition.courseStartTime=$event" v-model.trim="condition.courseStartTime"
                    format="yyyy-MM-dd" type="date" placeholder="上课时间" style="width:200px"/>
<!--      —-->
<!--        <DatePicker @on-change="condition.courseEndTime=$event" v-model.trim="condition.courseEndTime"-->
<!--                    format="yyyy-MM-dd" type="date" placeholder="结束时间" style="width:120px"/>-->
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
          className:null,
          teacherName:null,
          courseName:null,
          isEffective:null,
          courseStartTime:null,
          courseEndTime:null,
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
            title: '教师名称',
            key: 'teacherName',
            tooltip: true,
            align: 'center',
          },
          {
            title: '班级名称',
            key: 'className',
            tooltip: true,
            align: 'center',
          },
          {
            title: '课程名称',
            key: 'courseName',
            tooltip: true,
            align: 'center',
          },
          {
            title: '上课开始时间',
            key: 'startTime',
            align: 'center',
          },
          {
            title: '上课结束时间',
            key: 'endTime',
            align: 'center',
          },
          {
            title: '是否有效',
            key: 'isEffective',
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
                      this.$router.push({ name: 'courseEdit',
                        params: { 'courseId': params.row.courseId }
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
                        path:'courseDetail',
                        query: { 'courseId': params.row.courseId }
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
                      this.delete(params.row.courseId)
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
    name: 'courseAdd',
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
        ajax(config2.host_admin + config2.getCourseAll, 'post',params)
          .then(res => {
            this.serachLoading = false
            let result = res.data.data
            if (res.data.code === '000000') {
              t.tableData = result.pageData
              t.total = result.totalCount
              t.tableData.forEach(function(value, index) {
                value.indexNum = index + (t.pageIndex - 1) * t.pageSize + 1
                if(value.isEffective === '0'){
                  value.isEffective='无效'
                }else{
                  value.isEffective='有效'
                }
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
              config2.host_admin + config2.delCourse + '?courseId=' + id, 'post'
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
          path:'courseAdd'
        })
      }
      },

  }
</script>
