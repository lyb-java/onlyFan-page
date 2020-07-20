<template>
  <div>
    <Card>
      <div >
        <!--  修改  -->
        <Form ref="addReqDto" :model="addReqDto" :rules="addRuleValidate" :label-width="140" style="margin-top: 30px">
          <div style="display:flex">
            <div>
              <Form-item label="班级名称：" prop="name">
                <Input type="input" v-model.trim="addReqDto.name" placeholder="请填写班级名称" style="width: 204px" />
              </Form-item>
              <Form-item label="班级人数：" prop="classSize" >
                <Input  type="number" v-model.trim="addReqDto.classSize"  placeholder="请填写班级人数" style="width: 200px" />
              </Form-item>
              <Form-item label="所属教师：" prop="teacherId">
                <Select v-model.trim="addReqDto.teacherId" filterable style="width:204px">
                  <Option v-for="item in teacherList" :value="item.teacherId" :key="item.teacherId">{{item.name}}</Option>
                </Select>
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
  export default {
    data () {
      return {
        /** 属性声明 */
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
            { required: true, message: '班级人数不能为空', trigger: 'blur',type:'number'},
          ],
          teacherId: [
            { required: true, message: '请选择所属教师', trigger: 'blur',type:'number'},
          ],
        },
      }
    },
    created() {
      this.getTeacherOption()
    },
    mounted() {
      let classId = this.$route.params.classId
      this.get(classId)
    },
    name: 'classEdit',
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
        ajax(config2.host_admin + config2.editClass, 'post', params)
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
        ajax(config2.host_admin + config2.getClass + '?classId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
                this.addReqDto = result
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
      close(){
        this.closeTag({
          name: 'classEdit'
        })
        // this.$router.go(-1)
      }
    },
  }
</script>
