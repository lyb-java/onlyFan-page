<template>
  <div>
    <Card>
      <div >
        <!--  修改  -->
        <Form ref="addReqDto" :model="addReqDto" :rules="addRuleValidate" :label-width="140" style="margin-top: 30px">
          <div style="display:flex">
            <div>
              <Form-item label="工号：" prop="teacherNo">
                <Input v-model.trim="addReqDto.teacherNo" placeholder="请填写工号" style="width: 204px"/>
              </Form-item>
              <Form-item label="姓名：" prop="name">
                <Input type="input" v-model.trim="addReqDto.name" placeholder="请填写姓名" style="width: 204px" />
              </Form-item>
              <Form-item label="性别：" prop="gender">
                <RadioGroup v-model="addReqDto.gender">
                  <Radio label="0">男</Radio>
                  <Radio label="1">女</Radio>
                </RadioGroup>
              </Form-item>
              <Form-item label="年龄：" prop="age" >
                <Input  type="number" v-model.trim="addReqDto.age"  placeholder="请填写年龄" style="width: 200px" />
              </Form-item>
              <Form-item label="出生日期：" prop="birthday" >
                <DatePicker
                  v-model="addReqDto.birthday"
                  format="yyyy-MM-dd"
                  type="date"
                ></DatePicker>
              </Form-item>
            </div>
            <div>
              <Form-item label="手机号：" prop="phone">
                <Input type="input" v-model.trim="addReqDto.phone" placeholder="请填写手机号" style="width: 204px" />
              </Form-item>
              <Form-item label="居住地址：" prop="address">
                <Input type="input" v-model.trim="addReqDto.address" placeholder="请填写居住地址" style="width: 204px" />
              </Form-item>
              <Form-item label="入校时间：" prop="admissionDate" >
                <DatePicker
                  v-model="addReqDto.admissionDate"
                  format="yyyy-MM-dd"
                  type="date"
                ></DatePicker>
              </Form-item>
              <Form-item label="在校状态：" prop="state">
                <RadioGroup v-model="addReqDto.state">
                  <Radio label="0">在校</Radio>
                  <Radio label="1">离校</Radio>
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
  export default {
    data () {
      const phoneChk = (rule, value, callback) => {
        let temp = this.addReqDto.phone
        if (temp == null || temp === '') {
          callback(new Error('手机号码不能为空'))
        } else if (!/^1[3456789]\d{9}$/.test(temp)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
      return {
        /** 属性声明 */
        //按钮转转转
        addLoading:false,
        addReqDto: {
          teacherNo:null,
          name:null,
          gender:null,
          age:null,
          birthday:null,
          address:null,
          admissionDate:null,
          state:null,
        },
        /** 表单验证 */
        addRuleValidate: {
          teacherNo: [
            { required: true, message: '工号不能为空',trigger: 'blur'},
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          gender: [
            { required: true, message: '请选择性别', trigger: 'change' },
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' },
          ],
          age: [
            { required: true, message: '年龄不能为空',  trigger: 'change'},
          ],
          birthday: [
            { required: true, message: '出生日期不能为空', trigger: 'blur',type: 'date'},
          ],
          phone: [
            { required: true, trigger: 'blur', validator: phoneChk },
          ],
          address: [
            { required: true, message: '居住地址不能为空', trigger: 'blur' },
            { type: 'string', max: 200, message: '最多输入200个字符', trigger: 'blur' },
          ],
          admissionDate: [
            { required: true, message: '出生日期不能为空', trigger: 'blur',type: 'date'},
          ],
        },
      }
    },
    created() {

    },
    mounted() {
      let teacherId = this.$route.params.teacherId
      this.get(teacherId)
    },
    name: 'teacherEdit',
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
        ajax(config2.host_admin + config2.editTeacher, 'post', params)
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
        ajax(config2.host_admin + config2.getTeacher + '?teacherId='+id, 'post')
          .then(res => {
            let result = res.data.data
            if (res.data.code === '000000') {
                this.addReqDto = result
              this.addReqDto.birthday = new Date(result.birthday)
              this.addReqDto.admissionDate = new Date(result.admissionDate)
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
          name: 'teacherEdit',
          params: { 'teacherId':this.$route.params.teacherId}
        })
      }
    },
  }
</script>
