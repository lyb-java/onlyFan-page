<template>
  <div>
    <Card>
      <div >
        <!--  编辑  -->
        <Form ref="addReqDto" :model="addReqDto" :rules="addRuleValidate" :label-width="140" style="margin-top: 30px">
          <div style="display:flex">
            <div>
              <Form-item label="学生：" prop="studentId">
                <Select v-model.trim="addReqDto.studentId" filterable style="width:204px">
                  <Option v-for="item in studentList" :value="item.studentId" :key="item.studentId">{{item.name}}</Option>
                </Select>
              </Form-item>
              <Form-item label="考试科目名称：" prop="subjectName">
                <Input type="input" v-model.trim="addReqDto.subjectName" placeholder="请填写考试科目名称" style="width: 204px" />
              </Form-item>
              <Form-item label="考试成绩：" prop="points" >
                <Input  type="number" v-model.trim="addReqDto.points"  placeholder="请填写考试成绩" style="width: 200px" />
              </Form-item>
              <Form-item label="考试开始时间：" prop="startingTime">
                <DatePicker @on-change="addReqDto.startingTime=$event" v-model.trim="addReqDto.startingTime"
                            format="yyyy-MM-dd HH:mm" type="datetime" placeholder="考试开始时间" style="width:200px"/>
              </Form-item>
              <Form-item label="考试开始时间：" prop="completionTime">
                <DatePicker @on-change="addReqDto.completionTime=$event" v-model.trim="addReqDto.completionTime"
                            format="yyyy-MM-dd HH:mm" type="datetime" placeholder="考试开始时间" style="width:200px"/>
              </Form-item>
            </div>
          </div>
        </Form>
      </div>
      <div style="text-align: center;margin-top:30px">
        <Button :loading="addLoading" type="primary"  @click="validateSubmitAdd()">保存</Button>
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
      const pointsVali = (rule, value, callback) => {
        let regNum = /^\d{0,8}.\d{0,2}$/;
        if (value === '') {
          callback(new Error('考试成绩不能为空'));
        } else if (!regNum.test(value)) {
          callback(new Error('格式不正确（例：95.55）'));
        } else {
          callback();
        }
      }
      return {
        /** 属性声明 */
        studentList:[],
        //按钮转转转
        addLoading:false,
        addReqDto: {
          startingTime:null,
          completionTime:null,
          studentId:null,
          subjectName:null,
          points:0,
        },
        /** 表单验证 */
        addRuleValidate: {
          studentId: [
            { required: true, message: '请选择学生',trigger: 'blur',type:'number'},
          ],
          subjectName: [
            { required: true, message: '考试科目名称不能为空',trigger: 'blur'},
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          points: [
            { required: true,message:'考试成绩不能为空',trigger: 'blur'},
          ],
          startingTime: [
            { required: true, message: '请选择考试开始时间', trigger: 'change',pattern: /.+/ }
          ],
          completionTime: [
            { required: true, message: '请选择考试结束时间', trigger: 'change',pattern: /.+/ },
          ],
        },
      }
    },
    mounted() {
      let achievementId = this.$route.params.achievementId
      this.get(achievementId)
      this.getStudentOption()
    },
    name: 'achievementEdit',
    methods:{
      ...mapMutations([
        'closeTag'
      ]),
      /** 添加表单验证 */
      validateSubmitAdd () {
        this.$refs['addReqDto'].validate(valid => {
          if (valid) {
            this.add()
          } else {
            this.$Message.error('请完善表单信息!')
          }
        })
      },
      /** 提交 */
      add() {
        let params = this.addReqDto
        this.addLoading=true
        ajax(config2.host_admin + config2.editAchievement, 'post', params)
          .then(res => {
            this.addLoading=false
            if (res.data.code === '000000') {
              this.$Message.success(res.data.msg)
              this.close()
            } else {
              this.$Modal.error({
                title: '失败',
                content: res.data.msg
              })
            }
          }).catch(() => {
          this.addLoading=false
          this.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后'
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
      /** 查询详情 */
      get(id){
        let t = this
        ajax(config2.host_admin + config2.getAchievement + '?achievementId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
              this.addReqDto = result
              this.addReqDto.points = Number(result.points)
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
      close(){
        this.$router.go(-1)
        this.closeTag({
          name: 'achievementEdit',
          params: { 'achievementId': this.$route.params.achievementId }
        })
      }
    },
  }
</script>
