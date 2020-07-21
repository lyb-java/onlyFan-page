<template>
  <div>
    <Card>
      <div >
        <!--  修改  -->
        <Form ref="addReqDto" :model="addReqDto" :rules="addRuleValidate" :label-width="140" style="margin-top: 30px">
          <div style="display:flex">
            <div>
              <Form-item label="课程名称：" prop="courseName">
                <Input type="input" v-model.trim="addReqDto.courseName" placeholder="请填写课程名称" style="width: 204px" />
              </Form-item>
              <Form-item label="教师：" prop="teacherId">
                <Select v-model.trim="addReqDto.teacherId" filterable style="width:204px">
                  <Option v-for="item in teacherList" :value="item.teacherId" :key="item.teacherId">{{item.name}}</Option>
                </Select>
              </Form-item>
              <Form-item label="班级：" prop="classId">
                <Select v-model.trim="addReqDto.classId" filterable style="width:204px">
                  <Option v-for="item in classList" :value="item.classId" :key="item.classId">{{item.name}}</Option>
                </Select>
              </Form-item>
            </div>
            <div>
              <Form-item label="上课开始时间：" prop="courseStartTime">
                <DatePicker @on-change="addReqDto.courseStartTime=$event" v-model.trim="addReqDto.courseStartTime"
                            format="yyyy-MM-dd HH:mm" type="datetime" placeholder="上课开始时间" style="width:200px"/>
              </Form-item>
              <Form-item label="上课结束时间：" prop="courseEndTime">
                <DatePicker @on-change="addReqDto.courseEndTime=$event" v-model.trim="addReqDto.courseEndTime"
                            format="yyyy-MM-dd HH:mm" type="datetime" placeholder="上课结束时间" style="width:200px"/>
              </Form-item>
              <Form-item label="有效状态：" prop="isEffective">
                <RadioGroup v-model="addReqDto.isEffective">
                  <Radio label="0">无效</Radio>
                  <Radio label="1">有效</Radio>
                </RadioGroup>
              </Form-item>
            </div>
          </div>
        </Form>
      </div>
      <div style="text-align: center;margin-top:30px">
        <Button :loading="addLoading" type="primary"  @click="validateSubmitAdd()">保存</Button>
        &nbsp;&nbsp;
        <Button @click="close()">取消</Button>
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
      const startTimeVali = (rule, value, callback) => {
        let temp = this.addReqDto.courseStartTime
        if (temp == null || temp === '') {
          callback(new Error('上课开始时间不能为空'))
        } else {
          callback()
        }
      }
      const endTimeVali = (rule, value, callback) => {
        let temp = this.addReqDto.courseEndTime
        if (temp == null || temp === '') {
          callback(new Error('上课开始时间不能为空'))
        } else {
          callback()
        }
      }
      return {
        /** 属性声明 */
        teacherList:[],
        classList:[],
        //按钮转转转
        addLoading:false,
        addReqDto: {
          classId:null,
          teacherId:null,
          isEffective:null,
          courseName:null,
          courseStartTime:null,
          courseEndTime:null,
        },
        /** 表单验证 */
        addRuleValidate: {
          courseName: [
            { required: true, message: '课程名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          classId: [
            { required: true, message: '请选择班级', trigger: 'blur',type:'number'},
          ],
          teacherId: [
            { required: true, message: '请选择所属教师', trigger: 'blur',type:'number'},
          ],
          isEffective: [
            { required: true, message: '请选择有效状态', trigger: 'change'},
          ],
          courseStartTime: [
            { required: true, message: '上课开始时间不能为空', trigger: 'change',pattern: /.+/ }
          ],
          courseEndTime: [
            { required: true, message: '上课结束时间不能为空', trigger: 'change',pattern: /.+/ },
          ],
        },
      }
    },
    created() {
      this.getTeacherOption()
      this.getClassOption()
    },
    mounted() {
      let courseId = this.$route.params.courseId
      this.get(courseId)
    },
    name: 'courseEdit',
    methods:{
      ...mapMutations([
        'closeTag'
      ]),
      /** 添加表单验证 */
      validateSubmitAdd () {
        this.$refs['addReqDto'].validate(valid => {
          if (valid) {
            this.edit()
          } else {
            this.$Message.error('请完善表单信息!')
          }
        })
      },
      /** 提交 */
      edit() {
        let params = this.addReqDto
        this.addLoading=true
        ajax(config2.host_admin + config2.editCourse, 'post', params)
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
      /** 查询详情 */
      get(id){
        let t = this
        ajax(config2.host_admin + config2.getCourse + '?courseId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
                this.addReqDto = result
              this.addReqDto.courseStartTime =  formatString(result.startTime+'')
              this.addReqDto.courseEndTime =  formatString(result.endTime+'')
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
      /** 查询教师下拉列表 */
      getTeacherOption(){
        let t = this
        ajax(config2.host_admin + config2.getTeacherAllOption, 'post')
          .then(res => {
            let result = res.data
            if (res.data.code === '000000') {
              this.teacherList = result.data
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
      /** 查询班级下拉列表 */
      getClassOption(){
        let t = this
        ajax(config2.host_admin + config2.getClassAllOption, 'post')
          .then(res => {
            let result = res.data
            if (res.data.code === '000000') {
              this.classList = result.data
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
          name: 'courseEdit',
          params: { 'courseId':  this.$route.params.courseId}
        })
      }
    },
  }
</script>
