<template>
  <div>
    <Card>
      <div >
        <!--  详情  -->
        <Form ref="addReqDto" :model="addReqDto"  :label-width="140" style="margin-top: 30px">
          <div style="display:flex">
            <div>
              <Form-item label="班级名称：" prop="name">
                <span>{{addReqDto.name}}</span>
              </Form-item>
              <Form-item label="班级人数：" prop="classSize" >
                <span>{{addReqDto.classSize}}</span>
              </Form-item>
              <Form-item label="所属教师：" prop="teacherName">
                <span>{{addReqDto.teacherName}}</span>
              </Form-item>
            </div>
            <div>
              <Form-item label="操作人：" prop="opUserName">
                <span>{{addReqDto.opUserName}}</span>
              </Form-item>
              <Form-item label="创建时间：" prop="createTime">
                <span>{{addReqDto.createTime}}</span>
              </Form-item>
              <Form-item label="修改时间：" prop="updateTime" >
                <span>{{addReqDto.updateTime}}</span>
              </Form-item>
            </div>
          </div>
        </Form>
      </div>
      <div style="text-align: center;margin-top:30px">
        &nbsp;&nbsp;
        <Button @click="close()">返回</Button>
      </div>
    </Card>
  </div>
</template>
<script>
  import config2 from '@/config/url'
  import { ajax } from '@/libs/https'
  import { mapMutations } from 'vuex'
  import {dateFormat, formatDate, formatString} from "../../api/Utlis";
  export default {
    name: 'studentDetail',
    data () {
      return {
        /** 属性声明 */
        addReqDto: {
        },
      }
    },
    created() {

    },
    mounted() {
      let classId = this.$route.query.classId
      this.get(classId)
    },
    methods:{
      ...mapMutations([
        'closeTag'
      ]),
      /** 查询详情 */
      get(id){
        let t = this
        ajax(config2.host_admin + config2.getClass + '?classId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
              this.addReqDto = result
              this.addReqDto.createTime =formatString(result.createTime+'')
              this.addReqDto.updateTime = formatString(result.updateTime+'')
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
      close(){
        this.closeTag({
          name: 'studentDetail'
        })
        // this.$router.go(-1)
      }
    },
  }
</script>
