<template>
  <div class="service-manege-container">
    <!-- 个人信息 -->
    <div class="user-info-div">
      <img v-lazy="pic" alt="user" v-if="userInfo.user_picture" />
      <img src="@/assets/user-icon.png" alt="user" v-else />
      <div class="info-div">
        <div class="user-div">
          <span class="name-span">{{ userInfo.user_name }}</span>
          <div class="company-div">{{ userInfo.company_name }}</div>
        </div>
        <div class="job-number-span">
          <div class="title-span">工号</div>
          <div class="num-span">{{ userInfo.job_number }}</div>
        </div>
      </div>
    </div>
    <!-- 福利信息 -->
    <div class="user-fuli-div">
      <div class="total-money-div">
        <div class="title-div">福利账户总余额 (元)</div>
        <div class="money-div">{{ this.userInfo.user_money }}</div>
      </div>
      <div class="fuli-first-row">
        <div class="total-online-money-div">
          <span>线上支付可用余额 (元)</span>
          <span>{{ this.userInfo.online_balance }}</span>
        </div>
        <div class="coupons-div">
          <span>优惠券</span>
          <span>0 张</span>
        </div>
      </div>
      <div class="fuli-second-row">
        <div class="excoupons-div">
          <span>体验券</span>
          <span>0 张</span>
        </div>
        <div class="blank-div"></div>
      </div>
    </div>
    <!-- 账户信息 -->
    <div class="user-account-div" @click="gotoBill">
      <div class="title-div">
        <svg-icon icon-class="bill-money"></svg-icon>
        <span>账户明细</span>
      </div>
      <svg-icon icon-class="arrows-right"></svg-icon>
    </div>
    <!-- 充值卡充值 -->
    <div class="recharge-div" @click="gotoRecharge">
      <div class="title-div">
        <svg-icon icon-class="recharge-card"></svg-icon>
        <span>充值卡充值</span>
      </div>
      <svg-icon icon-class="arrows-right"></svg-icon>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/service/getData'
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
    // 账单明细
    gotoBill() {
      this.$router.push({
        path: '/mine/service/bill'
      })
    },

    // 充值卡充值
    gotoRecharge() {
      this.$router.push({
        path: '/mine/service/recharge'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.service-manege-container {
  @include wh(100%, 100%);
  padding: 0.4rem;
  .user-info-div {
    @include wh(100%, 4rem);
    background-color: $userbc;
    border-radius: 0.4rem;
    @include flex(center, flex-start, row);
    padding-left: 1rem;
    img {
      @include wh(2.5rem, 2.5rem);
      border-radius: 2.5rem;
    }
    .info-div {
      @include wh(calc(100% - 2.5rem), 2.5rem);
      @include flex(flex-start, space-between);
      padding: 0.2rem 0 0.4rem 0.2rem;
      .user-div {
        @include flex(center, flex-start, row);
        @include wh(100%, auto);
        .name-span {
          margin-right: 0.4rem;
          max-width: 3rem;
          @include sc(0.6rem, $fc);
          font-weight: bold;
          @include flowC;
          line-height: 1rem;
        }
        .company-div {
          @include sc(0.6rem, $fc);
          @include wh(calc(100% - 3rem), auto);
          @include flowC;
        }
      }
      .job-number-span {
        @include sc(0.6rem, $fc);
        @include wh(auto, 0.8rem);
        border-radius: 1rem;
        overflow: hidden;
        @include flex(center, flex-start, row);
        font-weight: bold;
        .title-span {
          @include wh(1.7rem, 100%);
          background-color: #cfac7d;
          @include sc(0.5rem, $fc);
          @include flex(center, center, row);
          font-weight: bold;
          min-width: 2rem;
        }
        .num-span {
          @include wh(auto, 100%);
          background-color: #eee;
          @include sc(0.5rem, $fc);
          @include flex(center, center, row);
          font-weight: bold;
          padding: 0 0.2rem;
        }
      }
    }
  }
  .user-fuli-div {
    @include wh(100%, 9rem);
    background-color: #fff;
    border-radius: 0.4rem;
    margin-top: 0.4rem;
    .total-money-div {
      @include wh(100%, 3rem);
      @include flex(flex-start, space-between);
      padding: 0.4rem;
      .title-div {
        @include sc(0.6rem, $fc);
      }
      .money-div {
        @include sc(0.8rem, $fc);
        font-weight: bold;
      }
    }
    .fuli-first-row {
      @include flex(flex-start, flex-start, row);
      span {
        @include sc(0.6rem, $fc);
      }
      .total-online-money-div {
        @include wh(50%, 3rem);
        border-top: solid 0.05rem $lc;
        border-right: solid 0.05rem $lc;
        @include flex(flex-start, space-between);
        padding: 0.4rem;
      }
      .coupons-div {
        @include wh(50%, 3rem);
        border-top: solid 0.05rem $lc;
        @include flex(flex-start, space-between);
        padding: 0.4rem;
      }
    }
    .fuli-second-row {
      span {
        @include sc(0.6rem, $fc);
      }
      @include flex(flex-start, flex-start, row);
      .excoupons-div {
        @include wh(50%, 3rem);
        border-top: solid 0.05rem $lc;
        border-right: solid 0.05rem $lc;
        @include flex(flex-start, space-between);
        padding: 0.4rem;
      }
      .blank-div {
        @include wh(50%, 3rem);
        border-top: solid 0.05rem $lc;
        padding: 0.4rem;
        @include flex(flex-start, space-between);
      }
    }
  }
  .user-account-div,
  .recharge-div {
    @include wh(100%, 2rem);
    background-color: #fff;
    border-radius: 0.4rem;
    margin-top: 1rem;
    @include flex(center, space-between, row);
    padding: 0 0.4rem;
    .title-div {
      @include flex(center, flex-start, row);
      span {
        @include sc(0.6rem, $fc);
      }
      .svg-icon {
        @include wh(1rem, 1rem);
        margin-right: 0.2rem;
      }
    }
  }
  .recharge-div {
    margin-top: 0.5rem;
  }
}
</style>
