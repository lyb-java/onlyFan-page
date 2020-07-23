<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入用户名和密码</p>
        </div>
      </Card>
    </div>
    <div class="footer">
      <p style="color: #f0f0f0;">湖南只迷英语 Copyright@湘ICP备00000000号</p>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import axios from '@/libs/api.request'
import config from '@/config/url'
import { setToken, getToken,setUserName,setAccess } from '@/libs/util'
export default {
  components: {
    LoginForm
  },
  methods: {
    handleSubmit ({ account, password }) {
      let t = this
      let user= {
        account:account,
        password:password
      }
      axios.request({url:config.host_admin + config.login,data:user,method: 'post'
      }).then(res => {
        if (res.data.code === '000000') {
          let rspDto = res.data.data
          //设置 用户名、账户名、用户id、权限代码、
          t.$store.commit('setUserName', rspDto.userName)
          t.$store.commit('setAccount', rspDto.account)
          t.$store.commit('setUserId', rspDto.id)
          t.$store.commit('setAccess', rspDto.access)
          t.$store.commit('setHasGetInfo', true)
          //设置token
          setToken(rspDto.token)
          setAccess(rspDto.access)
          setUserName(rspDto.userName)
          //跳转主页
          this.$router.push({
            name: this.$config.homeName
          })
         } else {
          this.$Modal.error({
            title: '失败',
            content: res.data.msg
          })
        }
      }).catch(err => {
        this.$Modal.error({
          title: '失败',
          content: '系统维护中，请稍后'
        })
      })
    }
  }
}
</script>

<style>
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width:100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #666;
    font-size: 12px;
  }
</style>
