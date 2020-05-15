<template>
  <div>
    <Table stripe :columns="columns" :loading="loading" :data="tableData"/>
  <div style="text-align: right; margin-top: 5px">
    <Page :total="total" :page-size="pageSize" show-elevator show-total @on-change="e=>{pageSearch(e)}"/>
  </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        PAGE_INDEX: 1,
        /* 分页total属性绑定值 */
        total: 0,
        /* loading */
        loading: false,
        searchLoading: false,
        /* pageInfo实体 */
        pageIndex: 1,
        pageSize: 10,
        /* 查询条件 */
        condition: {
          processType: null,
          updateBeginTime: null,
          updateEndTime:null
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
            key: 'processName',
            tooltip: true,
            align: 'center'
          },
        ],
      }
    },
    methods:{
      /** 切换页码 */
      pageSearch (e) {
        this.pageIndex = e
        this.getTable()
      },
    }
  }
</script>
