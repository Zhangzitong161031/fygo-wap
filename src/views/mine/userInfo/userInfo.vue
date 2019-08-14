<template>
  <div class="usrt-info-container">
    <div class="com-div">
      <span>个人头像</span>
      <img v-lazy="pic" alt="user" v-if="userInfo.user_picture" />
      <img src="@/assets/user-info-icon.png" alt="user" v-else />
    </div>
    <div class="com-div">
      <span>个人昵称</span>
      <span>{{ userInfo.nick_name }}</span>
    </div>
    <div class="com-div">
      <span>真实姓名</span>
      <span>{{ userInfo.user_name }}</span>
    </div>
    <div class="com-div">
      <span>工号</span>
      <span>{{ userInfo.job_number }}</span>
    </div>
    <div class="com-div">
      <span>手机号码</span>
      <span>{{ userInfo.mobile_phone }}</span>
    </div>
    <div class="com-div" @click="gotoAddress">
      <span>收货地址</span>
      <span>
        设置默认收货地址
        <svg-icon icon-class="arrows-right"></svg-icon>
      </span>
    </div>
    <div class="login-out" @click="loginOut">退出登录</div>
  </div>
</template>

<script>
import { getUserInfo, userLoginOut } from '@/service/getData'
import { reqDomain } from '@/utils/env'
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    pic() {
      let reg = new RegExp('^http')
      if (!reg.test(this.userInfo.user_picture)) {
        return reqDomain + this.userInfo.user_picture
      } else {
        return this.userInfo.user_picture
      }
    }
  },
  async created() {
    await getUserInfo().then(res => {
      if (res.code === 0) {
        this.userInfo = res.data
      } else {
        this.$createToast({
          txt: res.msg,
          type: 'error',
          time: 800
        }).show()
      }
    })
  },
  methods: {
    // 收货地址
    gotoAddress() {
      this.$router.push({
        path: '/mine/service/address'
      })
    },

    // 退出登录
    async loginOut() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: `您是否要退出登录?`,
        confirmBtn: {
          text: '确定',
          active: true
        },
        cancelBtn: {
          text: '取消',
          active: false
        },
        onConfirm: async () => {
          await userLoginOut().then(res => {
            if (res.code !== 0) {
              this.$createToast({
                txt: res.msg,
                type: 'error',
                time: 800
              }).show()
            } else {
              this.$router.replace({
                path: '/'
              })
            }
          })
        }
      }).show()
    }
  }
}
</script>

<style lang="scss" scoped>
.usrt-info-container {
  @include wh(100%, 100%);
  @include flex(center, flex-start);
  .com-div {
    @include flex(center, space-between, row);
    @include wh(100%, 2rem);
    padding: 0 0.5rem;
    background-color: #fff;
    border-bottom: solid 0.05rem $lc;
    img {
      @include wh(1.5rem, 1.5rem);
      border-radius: 1.5rem;
    }
    span {
      @include sc(0.6rem, $fc);
    }
  }
  .login-out {
    @include wh(calc(100% - 2rem), 2rem);
    background-color: $theme;
    @include sc(0.7rem, #fff);
    font-weight: bold;
    letter-spacing: 0.1rem;
    @include flex(center, center);
    border-radius: 0.2rem;
    margin-top: 4rem;
  }
}
</style>
