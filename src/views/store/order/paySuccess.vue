<template>
  <div class="order-detail-container">
    <div class="result-div">
      <svg-icon :icon-class="icon" />
      <span class="title-span">{{ title }}</span>
      <span class="tip-span">{{ tip }}</span>
    </div>
    <div class="action-div">
      <div class="back-home-btn" @click="gotoHome">返回首页</div>
      <div class="check-order-btn" @click="checkOrder">查看订单</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: '',
      orderId: null,
      orderSn: null,
      title: '',
      tip: '',
      icon: ''
    }
  },
  created() {
    this.type = this.$route.query.type
    this.orderId = this.$route.query.orderId
    this.orderSn = this.$route.query.orderSn
    this.switchDetail(this.type)
  },
  methods: {
    // 返回首页
    gotoHome() {
      this.$router.push({
        path: '/'
      })
    },

    // 查看订单
    checkOrder() {
      this.$router.replace({
        path: '/store/order/detail',
        query: {
          orderId: this.orderId,
          orderSn: this.orderSn
        }
      })
    },

    // 展示控制
    switchDetail(type) {
      switch (type) {
        case 'success':
          this.title = '恭喜您, 下单成功 !'
          this.icon = 'success'
          this.tip = ''
          break
        case 'error':
          this.title = '支付失败'
          this.icon = 'error'
          this.tip = this.$route.query.msg
          break
        case 'wait':
          this.title = '等待处理'
          this.icon = 'wait'
          this.tip = '已提交订单，等待处理中'
          break
        case 'warn':
          this.title = '无法完成操作'
          this.icon = 'warn'
          this.tip = '当前福利账户余额暂不可使用！'
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail-container {
  @include wh(100%, 100%);
  background-color: $bc;
  padding: 0 2rem;
  .result-div {
    @include wh(100%, 10rem);
    border-bottom: solid 0.05rem $blc;
    @include flex(center, center);
    .svg-icon {
      @include wh(2.5rem, 2.5rem);
    }
    .title-span {
      @include sc(1rem, $fc);
      margin-top: 1rem;
    }
    .tip-span {
      @include sc(0.7rem, $fc);
      margin-top: 1rem;
    }
  }
  .action-div {
    @include wh(100%, 2rem);
    margin-top: 1.5rem;
    @include flex(center, space-between, row);
    .back-home-btn,
    .check-order-btn {
      @include wh(5rem, 100%);
      background-color: #fff;
      border-radius: 0.2rem;
      @include flex(center, center);
      @include sc(0.8rem, $fc);
    }
  }
}
</style>
