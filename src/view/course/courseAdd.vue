<template>
  <div>
  <Card>
    <div >
      <!--  添加  -->
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
             <Select v-model.trim="addReqDto.teacherId" filterable style="width:204px">
               <Option v-for="item in classList" :value="item.classId" :key="item.classId">{{item.className}}</Option>
             </Select>
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
  export default {
    data () {
      return {
        /** 添加属性声明 */
        teacherList:[],
        //按钮转转转
        addLoading:false,
        addReqDto: {
          classSize:null,
          name:null,
          teacherId:null,
        },
        /** 表单验证 */
        addRuleValidate: {
          name: [
            { required: true, message: '班级名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          classSize: [
            { required: true, message: '班级人数不能为空', trigger: 'blur'},
          ],
          teacherId: [
            { required: true, message: '请选择所属教师', trigger: 'blur',type:'number'},
          ],
        },
      }
    },
    mounted() {
      this.getTeacherOption()
    },
    name: 'classAdd',
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
        ajax(config2.host_admin + config2.addClass, 'post', params)
          .then(res => {
            this.addLoading=false
            if (res.data.code === '000000') {
              this.$Message.success(res.data.msg)
              this.$router.go(-1)
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
      close(){
        this.closeTag({
          name: 'classAdd',
        })
        // this.$router.go(-1)
      }
      },
  }
</script>
