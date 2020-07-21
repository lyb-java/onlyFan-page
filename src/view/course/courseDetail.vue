<template>
  <div>
    <Card>
      <div >
        <!--  详情  -->
        <Form ref="addReqDto" :model="addReqDto"  :label-width="140" style="margin-top: 30px">
          <div style="display:flex">
            <div>
              <Form-item label="课程名称：" prop="courseName">
                <span>{{addReqDto.courseName}}</span>
              </Form-item>
              <Form-item label="教　　师：" prop="teacherId">
                <span>{{addReqDto.teacherName}}</span>
              </Form-item>
              <Form-item label="班　　级：" prop="classId">
                <span>{{addReqDto.className}}</span>
              </Form-item>
              <Form-item label="有效状态：" prop="isEffective">
                <span>{{addReqDto.isEffective}}</span>
              </Form-item>
              <Form-item label="操作人名称：" >
                <span>{{addReqDto.opUserName}}</span>
              </Form-item>
            </div>
            <div>
              <Form-item label="上课开始时间：" prop="courseStartTime">
                <span>{{addReqDto.courseStartTime}}</span>
              </Form-item>
              <Form-item label="上课结束时间：" prop="courseEndTime">
                <span>{{addReqDto.courseEndTime}}</span>
              </Form-item>
              <Form-item label="创建时间：" >
                <span>{{addReqDto.createTime}}</span>
              </Form-item>
              <Form-item label="修改时间：" >
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
      let courseId = this.$route.query.courseId
      this.get(courseId)
    },
    name: 'courseDetail',
    methods:{
      ...mapMutations([
        'closeTag'
      ]),
      /** 查询详情 */
      get(id){
        let t = this
        ajax(config2.host_admin + config2.getCourse + '?courseId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
              this.addReqDto = result
              if(result.isEffective === '0'){
                this.addReqDto.isEffective ='无效'
              }else{
                this.addReqDto.isEffective ='有效'
              }
              this.addReqDto.createTime =formatString(result.createTime+'')
              this.addReqDto.updateTime = formatString(result.updateTime+'')
              this.addReqDto.courseStartTime =formatString(result.startTime+'')
              this.addReqDto.courseEndTime = formatString(result.endTime+'')
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
        this.$router.go(-1)
        this.closeTag({
          name: 'courseDetail',
          query: { 'courseId':  this.$route.query.courseId}
        })
      }
    },
  }
</script>
