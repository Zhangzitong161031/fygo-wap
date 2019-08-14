<template>
  <div class="login-container" id="login-container">
    <div class="content-div">
      <div class="compay-info-div">
        <svg-icon icon-class="fyg-logo" />
        <span>杭州雄伟科技福利平台</span>
      </div>
      <div class="verify-div">
        <div class="sovell-input-div">
          <input type="tel" v-model="phone" :maxlength="11" placeholder="请输入手机号码" @blur="blur" @focus="focus" />
        </div>
        <div class="sovell-input-div">
          <input type="tel" v-model="verifyCode" maxlength="6" placeholder="请输入验证码" @blur="blur" @focus="focus" />
        </div>
        <div class="code-btn" @click="getCode">{{ title }}</div>
      </div>
      <div class="login-btn" @click="login">登录</div>
    </div>
    <div class="protocol-div">
      <span>登录后将代表您已同意</span>
      <a>《用户使用协议》</a>
    </div>
  </div>
</template>

<script>
import { getVerifyCode, userLogin } from '@/service/getData'
import { setCookie } from '@/utils/tools'
export default {
  data() {
    return {
      phone: '',
      verifyCode: '',
      title: '获取验证码',
      num: 60,
      interval: null,
      codeFlag: true,
      openid: null,
      hrt: 0
    }
  },
  created() {
    // 获取公众号的openid
    this.openid = this.$route.query.openid
    this.hrt = document.documentElement.clientHeight
    if (this.openid) {
      setCookie('openid', this.openid)
    }
  },
  methods: {
    // 获取验证码
    async getCode() {
      let phoneReg = new RegExp('^[0-9]{11}$')
      if (!phoneReg.test(this.phone)) {
        this.$createToast({
          txt: '请输入正确的手机号码',
          type: 'error',
          time: 800
        }).show()
      } else {
        if (this.codeFlag) {
          this.codeFlag = false
          this.title = '60s'
          this.interval = setInterval(() => {
            this.num--
            this.title = this.num + ' s'
            if (this.num === 0) {
              this.num = 60
              this.title = '获取验证码'
              this.codeFlag = true
              clearInterval(this.interval)
            }
          }, 1000)
          await getVerifyCode({
            mobile: this.phone
          }).then(res => {
            if (res.code !== 0) {
              this.$createToast({
                txt: res.msg,
                type: 'error',
                time: 800
              }).show()
            }
          })
        }
      }
    },
    // 登录
    async login() {
      let phoneReg = new RegExp('^[0-9]{11}$')
      let codeReg = new RegExp('^[0-9]{4}$')
      let msg = ''
      if (!phoneReg.test(this.phone)) {
        msg = '请输入正确的手机号码'
      } else if (!codeReg.test(this.verifyCode)) {
        msg = '请输入正确的验证码'
      }

      if (msg !== '') {
        this.$createToast({
          txt: msg,
          type: 'error',
          time: 800
        }).show()
      } else {
        await userLogin({
          verificationCode: this.verifyCode,
          mobile: this.phone,
          openid: this.openid
        }).then(res => {
          if (res.code === 0) {
            setCookie('auth_token', res.access_token)
            this.num = 60
            this.title = '获取验证码'
            this.codeFlag = true
            clearInterval(this.interval)
            this.$router.replace({
              path: '/home'
            })
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      }
    },
    // 失去焦点, 让页面滚动到顶部
    blur() {
      document.body.scrollTop = 0
    },
    // 获取焦点, 处理安卓软键盘弹起布局上移
    focus() {
      document.getElementById('app').style.height = this.hrt + 'px'
      document.getElementById('login-container').style.height = this.hrt + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  @include wh(100%, 100%);
  background-color: #fff;
  .content-div {
    @include wh(100%, calc(100% - 2rem));
    @include flex(center, flex-start);
    padding-top: 4rem;
    .compay-info-div {
      @include flex(center, center);
      margin-bottom: 3rem;
      .svg-icon {
        @include wh(4rem, 4rem);
        margin-bottom: 0.5rem;
      }
      span {
        @include sc(0.8rem, #3c3c3c);
      }
    }
    .verify-div {
      @include wh(100%, auto);
      padding: 0 1rem;
      margin-bottom: 1.5rem;
      position: relative;
      .sovell-input-div {
        @include sovell-input;
        @include wh(100%, 2rem);
        border-bottom: solid 0.05rem #f6f6f6;
      }
      .code-btn {
        @include wh(4rem, 1.2rem);
        background-color: $theme;
        border-radius: 0.1rem;
        @include sc(0.6rem, #fff);
        @include flex(center, center, row);
        position: absolute;
        bottom: 0.4rem;
        right: 1rem;
      }
    }
    .login-btn {
      @include wh(calc(100% - 2rem), 2rem);
      background-color: $theme;
      @include sc(0.7rem, #fff);
      font-weight: bold;
      letter-spacing: 0.1rem;
      @include flex(center, center);
      border-radius: 0.2rem;
    }
  }
  .protocol-div {
    @include wh(100%, 2rem);
    @include flex(center, center, row);
    span {
      @include sc(0.5rem, $tipc);
    }
    a {
      @include sc(0.5rem, $theme);
    }
  }
}
</style>
