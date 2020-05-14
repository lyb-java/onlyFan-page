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
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        // this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          // })
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
