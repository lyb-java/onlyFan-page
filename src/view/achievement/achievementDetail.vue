<template>
  <div>
    <Card>
      <div >
        <!--  编辑  -->
        <Form ref="addReqDto" :model="addReqDto"  :label-width="140" style="margin-top: 30px">
            <div>
              <Form-item label="学生：" prop="studentName">
                <span>{{addReqDto.studentName}}</span>
              </Form-item>
              <Form-item label="考试科目名称：" prop="subjectName">
                <span>{{addReqDto.subjectName}}</span>
              </Form-item>
              <Form-item label="考试成绩：" prop="points" >
                <span>{{addReqDto.points}}</span>
              </Form-item>
              <Form-item label="考试开始时间：" prop="startingTime">
                <span>{{addReqDto.startingTime}}</span>
              </Form-item>
              <Form-item label="考试开始时间：" prop="completionTime">
                <span>{{addReqDto.completionTime}}</span>
              </Form-item>
            </div>
        </Form>
      </div>
      <div style="text-align: center;margin-top:30px">
        &nbsp;&nbsp;
        <Button @click="close">取消</Button>
      </div>
    </Card>
  </div>
</template>
<script>
  import config2 from '@/config/url'
  import { ajax } from '@/libs/https'
  import { mapMutations } from 'vuex'
  import {formatString} from "../../api/Utlis";
  export default {
    data () {
      return {
        /** 属性声明 */
        studentList:[],
        //按钮转转转
        addLoading:false,
        addReqDto: {
        },
      }
    },
    mounted() {
      let achievementId = this.$route.query.achievementId
      this.get(achievementId)
      this.getStudentOption()
    },
    name: 'achievementDetail',
    methods:{
      ...mapMutations([
        'closeTag'
      ]),
      /** 查询详情 */
      get(id){
        let t = this
        ajax(config2.host_admin + config2.getAchievement + '?achievementId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
              this.addReqDto = result
              this.addReqDto.startingTime =  formatString(result.startTime+'')
              this.addReqDto.completionTime =  formatString(result.endTime+'')
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
      /** 查询学生下拉列表 */
      getStudentOption(){
        let t = this
        ajax(config2.host_admin + config2.getStudentAllOption, 'post')
          .then(res => {
            let result = res.data
            if (res.data.code === '000000') {
              this.studentList = result.data
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
          name: 'achievementDetail',
          query: { 'achievementId': this.$route.query.achievementId }
        })
      }
    },
  }
</script>
