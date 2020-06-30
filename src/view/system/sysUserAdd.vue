<template>
  <div>
    <Card>
      <Form ref="reqDto" :model="reqDto" :rules="ruleValidate" :label-width="140" style="margin-top: 30px">
        <Form-item label="用户名称：" prop="userName">
          <Input v-model.trim="reqDto.userName" placeholder="请填写用户名称" style="width: 204px"/>
        </Form-item>
        <Form-item label="账户名称：" prop="account">
          <Input  v-model.trim="reqDto.account" placeholder="请填写账户名称" style="width: 204px" />
        </Form-item>
        <Form-item label="密&nbsp;&nbsp;码：" prop="password">
          <Input type="password" v-model.trim="reqDto.password" placeholder="请填写密码" style="width: 204px"/>
        </Form-item>

        <Form-item label="是否有效：" prop="isEnable">
          <RadioGroup v-model="reqDto.isEnable">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </Form-item>
        <div style="text-align: center;">
          <Button type="primary" @click="validateSubmit()">&nbsp;&nbsp;提交</Button>
          <Button type="dashed" @click="exitAdd" style="margin-left:20px">&nbsp;&nbsp;返回</Button>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script>
  import config2 from '@/config/url'
  import { ajax } from '@/libs/https'
  var addOrModify = {
    url: config2.host + config2.addUser,
    messege: '添加'
  }
  export default {
    data () {
      return {
        reqDto: {
          account:null,
          password: null,
          userName: null,
          isEnable: '1',
        },
        /** 表单验证 */
        ruleValidate: {
          account: [
            { required: true, message: '账户名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', max: 8, message: '最多输入8个字符', trigger: 'blur' },
          ],
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur' },
          ],
          isEnable: [
            { required: true, message: '请选择是否有效', trigger: 'change' }
          ],
        }
      }
    },
    mounted () {
    },
    methods: {
      /** 提交 */
      handleSubmit () {
        let params = this.reqDto
        ajax(addOrModify.url, 'post', params)
          .then(res => {
            if (res.data.code === '000000') {
              this.$Message.success(res.data.msg)
              this['tab' + '添加系统用户'] = false;
              this.$router.go(-1)
            } else {
              this.$Modal.error({
                title: '失败',
                content: res.data.msg
              })
            }
          }).catch(() => {
          this.$Modal.error({
            title: '失败',
            content: '系统维护中，请稍后'
          })
        })
      },
      /** 表单验证 */
      validateSubmit () {
        this.$refs['reqDto'].validate(valid => {
          if (valid) {
            this.handleSubmit()
          } else {
            this.$Message.error('请完善表单信息!')
          }
        })
      },
      // 返回
      exitAdd () {
        this.$router.go(-1)
      }
    }

  }
</script>
