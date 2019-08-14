<template>
  <div class="bill-detail-comtainer">
    <div class="bill-detail-header">
      <svg-icon icon-class="success"></svg-icon>
      <span>交易完成</span>
    </div>
    <div class="bill-detail-content">
      <div class="item-div">
        <span>交易金额</span>
        <span>{{ this.type === 11 ? `-${orderInfo.order_amount}` : `+${orderInfo.order_amount}` }}</span>
      </div>
      <div class="item-div">
        <span>对方账户</span>
        <span>{{ orderInfo.shop_name + orderInfo.term_name }}</span>
      </div>
      <div class="item-div">
        <span>交易时间</span>
        <span>{{ orderInfo.pay_time }}</span>
      </div>
      <div class="item-div">
        <span>订单号</span>
        <span>{{ orderInfo.order_sn }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getBillDetail } from '@/service/getData'
export default {
  data() {
    return {
      orderInfo: {},
      orderId: null,
      type: null
    }
  },
  created() {
    this.orderId = this.$route.query.orderId
    this.type = this.$route.query.type
    // 获取账单详情
    getBillDetail({
      order_id: this.orderId
    }).then(res => {
      if (res.code === 0) {
        this.orderInfo = res.data
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
</script>

<style lang="scss" scoped>
.bill-detail-comtainer {
  @include wh(100%, 100%);
  .bill-detail-header {
    @include wh(100%, 8rem);
    margin-bottom: 0.4rem;
    background-color: #fff;
    @include flex(center, center);
    .svg-icon {
      @include wh(2rem, 2rem);
      margin-bottom: 0.4rem;
    }
  }
  .bill-detail-content {
    @include wh(100%, auto);
    background-color: #fff;
    padding: 0 0.7rem;
    .item-div {
      @include wh(100%, 2rem);
      @include sc(0.6rem, $fc);
      @include flex(center, space-between, row);
      border-bottom: solid 0.05rem $lc;
    }
  }
}
</style>
