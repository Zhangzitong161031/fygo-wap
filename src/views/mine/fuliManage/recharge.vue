<template>
  <div class="recharge-container">
    <div class="header-div">
      <div class="left-div">
        <svg-icon icon-class="recharge-icon" class="recharge-icon"></svg-icon>
      </div>
      <div class="right-div">
        <div class="title-div">福易购福利卡充值</div>
        <div class="step-div">
          <div class="left-ponit">
            <div class="internal-point"></div>
          </div>
          <div class="line-div"></div>
          <div class="right-ponit">
            <div class="internal-point"></div>
          </div>
        </div>
        <div class="tip-div">
          <span>输入卡号密码</span>
          <span>确认充值信息</span>
        </div>
      </div>
    </div>
    <div class="card-num-div">
      <span class="card-num-span">卡号</span>
      <input type="number" v-model="cardNum" />
    </div>
    <div class="card-pwd-div">
      <span class="card-pwd-span">卡密</span>
      <input type="text" v-model="cardPwd" />
    </div>
    <div class="commit-btn" @click="commitRecharge">提 交</div>
  </div>
</template>

<script>
import { getRachargeInfo } from '@/service/getData'
export default {
  data() {
    return {
      cardNum: '',
      cardPwd: '',
      secret: null,
      info: {}
    }
  },
  async created() {
    this.secret = this.$route.query.secret ? this.$route.query.secret : null
    if (this.secret !== null) {
      await getRachargeInfo({
        secret: this.secret
      }).then(res => {
        if (res.code === 0) {
          this.info = res.data
          this.cardNum = res.data.card_sn
          this.cardPwd = res.data.card_password
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
  methods: {
    // 提交
    async commitRecharge() {
      if (this.secret !== null && this.cardNum !== '' && this.cardPwd !== '') {
        this.$router.push({
          path: '/mine/service/comfirm-recharge',
          query: {
            sn: this.info.card_sn,
            pwd: this.info.card_password,
            startDate: this.info.card_start_date,
            endDate: this.info.card_end_date,
            balance: this.info.card_menory,
            account: this.info.mobile,
            status: this.info.status
          }
        })
      } else if (this.cardNum === '' || this.cardPwd === '') {
        this.$createToast({
          txt: '请填写卡号和卡密',
          type: 'warn',
          time: 800
        }).show()
      } else {
        // 获取充值信息
        await getRachargeInfo({
          card_sn: this.cardNum,
          card_password: this.cardPwd
        }).then(res => {
          if (res.code === 0) {
            this.$router.push({
              path: '/mine/service/comfirm-recharge',
              query: {
                sn: this.cardNum,
                pwd: this.cardPwd,
                startDate: res.data.card_start_date,
                endDate: res.data.card_end_date,
                balance: res.data.card_menory,
                account: res.data.mobile,
                status: res.data.status
              }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.recharge-container {
  @include wh(100%, 100%);
  @include flex(center, flex-start);
  .header-div {
    @include wh(100%, 4rem);
    background-color: $theme;
    @include flex(center, space-between, row);
    margin-bottom: 1rem;
    .left-div {
      @include wh(5rem, 100%);
      @include flex(center, center, row);
      .recharge-icon {
        @include wh(3rem, 3rem);
      }
    }
    .right-div {
      @include wh(calc(100% - 5rem), 100%);
      padding: 0.6rem 0;
      .title-div {
        @include sc(0.7rem, #fff);
        font-weight: bold;
        letter-spacing: 0.1rem;
        margin-bottom: 0.5rem;
        padding-left: 1rem;
      }
      .step-div {
        @include flex(center, flex-start, row);
        margin-bottom: 0.3rem;
        padding-left: 1.1rem;
        .left-ponit {
          @include flex(center, center, row);
          @include wh(0.5rem, 0.5rem);
          background-color: #fff;
          border-radius: 0.5rem;
          .internal-point {
            @include wh(0.3rem, 0.3rem);
            background-color: $theme;
            border-radius: 0.3rem;
          }
        }
        .line-div {
          @include wh(5rem, 0.1rem);
          background-color: #fff;
        }
        .right-ponit {
          @include flex(center, center, row);
          @include wh(0.5rem, 0.5rem);
          background-color: #fff;
          border-radius: 0.5rem;
          .internal-point {
            @include wh(0.3rem, 0.3rem);
            background-color: #d9d9d9;
            border-radius: 0.3rem;
          }
        }
      }
      .tip-div {
        @include wh(8.6rem, auto);
        @include flex(center, space-between, row);
        span {
          @include sc(0.4rem, #fff);
        }
      }
    }
  }
  .card-num-div {
    @include wh(100%, 1.8rem);
    @include flex(center, flex-start, row);
    background-color: #fff;
    margin-bottom: 1rem;
    .card-num-span {
      @include sc(0.7rem, $fc);
      margin-right: 0.4rem;
      @include wh(2rem, 100%);
      @include flex(center, center, row);
    }
  }
  .card-pwd-div {
    @include wh(100%, 1.8rem);
    @include flex(center, flex-start, row);
    background-color: #fff;
    margin-bottom: 2rem;
    .card-pwd-span {
      @include wh(2rem, 100%);
      @include sc(0.7rem, $fc);
      margin-right: 0.4rem;
      @include flex(center, center, row);
    }
  }
  input {
    @include wh(calc(100% - 2rem), 100%);
    @include sc(0.7rem, $theme);
    caret-color: $theme;
    background-color: #fff;
    &::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      @include sc(0.7rem, $phc);
    }
    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      @include sc(0.7em, $phc);
    }
    &::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      @include sc(0.7rem, $phc);
    }
    &:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      @include sc(0.7rem, $phc);
    }
    &::-webkit-search-cancel-button {
      // 去除 chrome 浏览器 search 时的 clearBtn
      display: none;
    }
  }
  .commit-btn {
    @include wh(calc(100% - 2rem), 2rem);
    background-color: $theme;
    @include sc(0.7rem, #fff);
    font-weight: bold;
    letter-spacing: 0.1rem;
    @include flex(center, center);
    border-radius: 0.2rem;
  }
}
</style>
