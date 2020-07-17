<template>
  <div>
    <Card>
      <div >
        <!--  详情  -->
        <Form ref="addReqDto" :model="addReqDto"  :label-width="140" style="margin-top: 30px">
          <div style="display:flex">
            <div>
              <Form-item label="学号：" prop="stuNo">
                <span>{{addReqDto.stuNo}}</span>
              </Form-item>
              <Form-item label="姓名：" prop="name">
                <span>{{addReqDto.name}}</span>
              </Form-item>
              <Form-item label="性别：" prop="gender">
                <span>{{addReqDto.gender}}</span>
              </Form-item>
              <Form-item label="年龄：" prop="age" >
                <span>{{addReqDto.age}}</span>
              </Form-item>
              <Form-item label="出生日期：" prop="birthday" >
                <span>{{addReqDto.birthday}}</span>
              </Form-item>
            </div>
            <div>
              <Form-item label="手机号：" prop="phone">
                <span>{{addReqDto.phone}}</span>
              </Form-item>
              <Form-item label="居住地址：" prop="address">
                <span>{{addReqDto.address}}</span>
              </Form-item>
              <Form-item label="入校时间：" prop="admissionDate" >
                <span>{{addReqDto.admissionDate}}</span>
              </Form-item>
              <Form-item label="在校状态：" prop="state">
                <span>{{addReqDto.state}}</span>
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
  import {dateFormat, formatDate} from "../../api/Utlis";
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
      this.studentId = this.$route.query.studentId
      this.get(this.studentId)
    },
    methods:{
      ...mapMutations([
        'closeTag'
      ]),
      /** 查询详情 */
      get(id){
        let t = this
        ajax(config2.host_admin + config2.getStudentDetail + '?studentId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
              this.addReqDto = result
              if(result.state === '0'){
                this.addReqDto.state = '在校'
              }else{
                this.addReqDto.state = '离校'
              }
              this.addReqDto.birthday = dateFormat(new Date(result.birthday))
              this.addReqDto.admissionDate = dateFormat(new Date(result.admissionDate))
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
