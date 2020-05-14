<template>
  <Table stripe :columns="columns" :loading="loading" :data="tableData"></Table>
</template>
<script>
  export default {
    data () {
      return {
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
    }
  }
</script>
