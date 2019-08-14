<template>
  <div class="order-detail-container">
    <!-- 支付金额 -->
    <div class="money-div">
      <span class="title-span">福易购商城 - 订单</span>
      <div class="money-box">
        <svg-icon icon-class="money" />
        <span class="money-span">{{ totalPrice }}</span>
      </div>
    </div>
    <!-- 支付选项 -->
    <div class="pay-option-div">
      <div class="money-div">
        <span class="money-span">-￥{{ totalPrice }}</span>
      </div>
      <cube-radio-group v-model="selected">
        <cube-radio :option="fygoPay" :hollow-style="true">
          <div class="fyfo-pay-div">
            <div class="tip-div">
              <svg-icon icon-class="fygo-pay" />
              <span class="tip-span">福利账号</span>
            </div>
            <span class="account-span">可用余额: ￥{{ balance }}</span>
          </div>
        </cube-radio>
        <cube-radio :option="wxpay" :hollow-style="true">
          <div class="wx-pay-div">
            <svg-icon icon-class="wx-pay" />
            <span>微信支付</span>
          </div>
        </cube-radio>
      </cube-radio-group>
    </div>
    <!-- 支付按钮 -->
    <div class="pay-btn" @click="payMoney">立即支付</div>
  </div>
</template>

<script>
import { getBalance, payOrder } from '@/service/getData'
export default {
  data() {
    return {
      selected: '1',
      fygoPay: {
        value: '1'
      },
      wxpay: {
        value: '2',
        disabled: true
      },
      orderId: null,
      orderSn: null,
      totalPrice: '0.00',
      balance: '0.00'
    }
  },
  async created() {
    this.orderId = this.$route.query.orderId
    this.orderSn = this.$route.query.orderSn
    this.totalPrice = this.$route.query.totalPrice
    await this.getCurBalance()
  },
  methods: {
    // 获取可用余额
    async getCurBalance() {
      await getBalance().then(res => {
        if (res.code === 0) {
          this.balance = res.data.balance ? res.data.balance : '0.00'
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 立即支付
    async payMoney() {
      await payOrder({
        order_id: this.orderId,
        order_sn: this.orderSn
      }).then(res => {
        if (res.code === 0) {
          // 支付成功
          this.$router.replace({
            path: '/store/order/pay_success',
            query: {
              type: 'success',
              orderId: this.orderId,
              orderSn: this.orderSn
            }
          })
        } else {
          // 支付失败
          // 10010: 余额不足
          this.$router.replace({
            path: '/store/order/pay_success',
            query: {
              type: 'error',
              orderId: this.orderId,
              orderSn: this.orderSn,
              msg: res.msg
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail-container {
  @include wh(100%, 100%);
  background-color: $bc;
  padding: 0 0.4rem;
  .money-div {
    @include wh(100%, 8rem);
    @include flex(center, center);
    margin-bottom: 0.4rem;
    .title-span {
      @include sc(1rem, $fc);
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .money-box {
      .money-span {
        @include sc(1rem, $theme);
        font-weight: bold;
      }
    }
  }
  .pay-option-div {
    @include wh(100%, 6.9em);
    background-color: #fff;
    border-radius: 0.4rem;
    padding: 0 0.4rem;
    overflow: hidden;
    .money-div {
      @include wh(100%, 2rem);
      @include sc(0.7rem, $fc);
      @include flex(center, flex-end, row);
      padding-top: 0.4rem;
    }
    .fyfo-pay-div {
      @include wh(100%, 100%);
      @include flex(center, space-between, row);
      .svg-icon {
        margin-right: 0.4rem;
      }
      .tip-span {
        @include sc(0.8rem, $fc);
      }
      .account-span {
        @include sc(0.7rem, $fc);
      }
    }
    .wx-pay-div {
      @include flex(center, space-between, row);
      .svg-icon {
        margin-right: 0.4rem;
      }
      span {
        @include sc(0.8rem, $diable);
      }
    }
  }
  .pay-btn {
    @include wh(100%, 2rem);
    background-color: $theme;
    margin-top: 3rem;
    border-radius: 0.4rem;
    @include sc(0.8rem, #fff);
    @include flex(center, center);
    letter-spacing: 0.08rem;
  }
}
</style>
<style>
.cube-radio-ui::before {
  transform: scale(1);
}
.cube-radio_selected .cube-radio-ui i {
  transform: scale(1);
}
.cube-radio-hollow.cube-radio_selected .cube-radio-ui i::before,
.cube-radio-hollow.cube-radio_disabled .cube-radio-ui i::before {
  transform: translate(-50%, -50%) scale(0.8);
}
</style>
