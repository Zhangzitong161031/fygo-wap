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
    <div class="info-div">
      <div class="card-pwd-div com-div">
        <span class="title-span">卡号:</span>
        <span class="info-span">{{ cardNum }}</span>
      </div>
      <div class="valid-interval-div com-div">
        <span class="title-span">生效日期:</span>
        <span class="info-span">{{ startDate }}</span>
        <span class="tip-span" v-if="status === '2'">未生效</span>
      </div>
      <div class="valid-interval-div com-div">
        <span class="title-span">有效期至:</span>
        <span class="info-span">{{ endDate }}</span>
        <span class="tip-span" v-if="status === '1'">已过期</span>
      </div>
      <div class="balance-div com-div">
        <span class="title-span">充值金额:</span>
        <span class="info-span">{{ balance }} 元</span>
      </div>
      <div class="account-div com-div">
        <span class="title-span">充值账户:</span>
        <span class="info-span">{{ account }}</span>
      </div>
    </div>
    <div class="commit-btn" @click="comfirRecharge">确认充值</div>
  </div>
</template>

<script>
import { cardRecharge } from '@/service/getData'
export default {
  data() {
    return {
      cardNum: '',
      cardPwd: '',
      startDate: '',
      endDate: '',
      balance: '',
      account: '',
      status: ''
    }
  },
  created() {
    this.cardNum = this.$route.query.sn
    this.cardPwd = this.$route.query.pwd
    this.startDate = this.$route.query.startDate
    this.endDate = this.$route.query.endDate
    this.balance = this.$route.query.balance
    this.account = this.$route.query.account
    this.status = this.$route.query.status
  },
  methods: {
    // 确认充值
    async comfirRecharge() {
      if (this.status === '0') {
        await cardRecharge({
          card_sn: this.cardNum,
          card_password: this.cardPwd
        }).then(res => {
          if (res.code === 0) {
            this.$router.push({
              path: '/mine/service/recharge-success'
            })
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      } else {
        this.$createToast({
          txt: '无效充值卡, 请联系管理员',
          type: 'warn',
          time: 800
        }).show()
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
            background-color: #d9d9d9;
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
            background-color: $theme;
            border-radius: 0.3rem;
          }
        }
      }
      .tip-div {
        @include wh(8.1rem, auto);
        @include flex(center, space-between, row);
        span {
          @include sc(0.4rem, #fff);
        }
      }
    }
  }
  .info-div {
    @include wh(100%, auto);
    .com-div {
      padding-left: 2rem;
      margin-bottom: 1rem;
      @include flex(center, flex-start, row);
      @include wh(100%, auto);
      .title-span {
        @include sc(0.7rem, $fc);
        margin-right: 0.5rem;
      }
      .info-span {
        @include sc(0.6rem, $fc);
        margin-right: 0.2rem;
      }
      .tip-span {
        @include sc(0.6rem, red);
      }
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
