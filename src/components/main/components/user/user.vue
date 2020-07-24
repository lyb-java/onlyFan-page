<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1165314366,4057375435&fm=15&gp=0.jpg" />
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
<!--        <DropdownItem name="message">-->
<!--          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
<!--        </DropdownItem>-->
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import { mapActions } from 'vuex'
  import {getUserName} from "../../../../libs/util";
  export default {
    name: 'User',
    props: {
      messageUnreadCount: {
        type: Number,
        default: 0
      }
    },
    methods: {
      ...mapActions([
        'handleLogOut'
      ]),
      logout () {
        this.handleLogOut().then(() => {
          this.$router.push({
            name: 'login'
          })
        })
      },
      handleClick (name) {
       this.logout()

      }
    }
  }
</script>
