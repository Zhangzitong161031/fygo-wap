<template>
  <div class="order-item-component" @click="gotoOrderDetail">
    <!-- title div -->
    <div class="title-div">
      <div class="store-info">
        <svg-icon icon-class="fyg-logo" v-if="!info.shop_logo" />
        <img v-lazy="info.shop_logo" v-if="info.shop_logo" />
        <span>{{ info.shop_name }}</span>
      </div>
      <span>{{ getOrderStatus(this.type) }}</span>
    </div>
    <!-- pics div -->
    <div class="pics-div" :ref="info.order_id">
      <div class="pics-scroll-div" ref="piccontent">
        <div v-for="(item, index) in info.goods_list" :key="index" class="img-div">
          <img v-lazy="getProPic(item.goods_thumb)" :key="item.goods_thumb" />
        </div>
      </div>
    </div>
    <!-- pay info div -->
    <div class="pay-info-div">
      <span>共 {{ info.goods_number }} 件，</span>
      <span class="money-span">支付总额: ￥{{ info.goods_amount }}</span>
    </div>
    <!-- action div -->
    <div class="action-div">
      <div @click.stop="checkExpress" v-if="this.type === 'yet-done' || this.type === 'wait-confirm'" class="com-btn">查看物流</div>
      <div @click.stop="deleteOrder" v-if="this.type === 'yet-close'" class="com-btn">删除订单</div>
      <div @click.stop="cancelOrder" v-if="this.type === 'wait-pay'" class="com-btn">取消订单</div>
      <div @click.stop="gotoPay" v-if="this.type === 'wait-pay'" class="com-btn suggest-btn">去支付</div>
      <div @click.stop="remindSend" v-if="this.type === 'wait-send'" class="com-btn">提醒发货</div>
      <div @click.stop="confirmOrder" v-if="this.type === 'wait-confirm'" class="com-btn suggest-btn">确认收货</div>
      <div @click.stop="oneMoreOrder" v-if="this.type === 'yet-done' || this.type === 'yet-close'" class="com-btn suggest-btn">再来一单</div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { reqDomain } from '@/utils/env'
import { remindShip, cancelOrder, deleteOrder, comfirmReceive, anotherOrder } from '@/service/getData'
export default {
  // eslint-disable-next-line
  props: [
    'info'
  ],
  data() {
    return {
      type: null
    }
  },
  watch: {
    info: {
      handler() {
        this.getTypeValue(this.info.order_status, this.info.pay_status, this.info.shipping_status)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      let len = this.info.goods_list.length
      let totalLen = len * 3.2 + 0.2
      this.$refs.piccontent.style.width = totalLen + 'rem'

      new BetterScroll(this.$refs[this.info.order_id], {
        click: true,
        scrollX: true,
        scrollY: false,
        eventPassthrough: 'vertical'
      })
    })
  },
  created() {
    this.getTypeValue(this.info.order_status, this.info.pay_status, this.info.shipping_status)
  },
  methods: {
    // 获取 type 状态值
    // shipping_status	string  0未发货   1已发货  2已收货确认 3/5配货中 4部分商品已发货
    // pay_status string  0未支付 1支付中  2已支付
    // order_status  0待确认 1已确认 2已取消 3无效 5已完成 4退货 7部分退款 8仅退款
    getTypeValue(orderStatus, payStatus, shippingStatus) {
      if (orderStatus === '1' && payStatus === '0') {
        this.type = 'wait-pay' // 待付款
      } else if (orderStatus === '1' && payStatus === '2' && shippingStatus === '0') {
        this.type = 'wait-send' // 待发货
      } else if (orderStatus === '1' && payStatus === '2' && (shippingStatus === '1' || shippingStatus === '3' || shippingStatus === '4' || shippingStatus === '5')) {
        this.type = 'wait-confirm' // 待收货
      } else if ((orderStatus === '1' || orderStatus === '5') && payStatus === '2' && shippingStatus === '2') {
        this.type = 'yet-done' // 已完成
      } else if (orderStatus === '2' || orderStatus === '3') {
        this.type = 'yet-close' // 已关闭
      }
    },

    // 获取状态名称
    // wait-pay wait-send wait-confirm yet-done yet-close
    getOrderStatus(type) {
      let name = ''
      switch (type) {
        case 'yet-done':
          name = '已完成'
          break
        case 'yet-close':
          name = '已关闭'
          break
        case 'wait-pay':
          name = '待付款'
          break
        case 'wait-send':
          name = '待发货'
          break
        case 'wait-confirm':
          name = '待收货'
          break
      }
      return name
    },

    // 获取商品详情图片
    getProPic(pic) {
      let reg = new RegExp('^http')
      if (!reg.test(pic)) {
        return reqDomain + pic
      } else {
        return pic
      }
    },

    // 订单详情
    gotoOrderDetail() {
      this.$router.push({
        path: '/store/order/detail',
        query: {
          orderId: this.info.order_id,
          orderSn: this.info.order_sn
        }
      })
    },

    // 取消订单
    cancelOrder() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '挑选了这么久，真的要放弃吗？',
        confirmBtn: {
          text: '取消订单',
          active: false
        },
        cancelBtn: {
          text: '保留',
          active: true
        },
        onConfirm: async () => {
          await cancelOrder({
            order_id: this.info.order_id
          }).then(res => {
            if (res) {
              this.$createToast({
                type: 'correct',
                time: 800,
                txt: '订单已取消!'
              }).show()
              this.$emit('refresh')
            }
          })
        }
      }).show()
    },

    // 去支付
    gotoPay() {
      this.$router.push({
        path: '/store/order/pay',
        query: {
          orderId: this.info.order_id,
          orderSn: this.info.order_sn,
          totalPrice: this.info.goods_amount
        }
      })
    },

    // 提醒发货
    async remindSend() {
      await remindShip({
        order_id: this.info.order_id
      }).then(res => {
        if (res) {
          this.$createToast({
            type: 'correct',
            time: 800,
            txt: '已提醒卖家发货!'
          }).show()
        }
      })
    },

    // 删除订单
    deleteOrder() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确认删除此订单吗？',
        confirmBtn: {
          text: '确认删除',
          active: true
        },
        cancelBtn: {
          text: '取消删除',
          active: false
        },
        onConfirm: async () => {
          await deleteOrder({
            order_id: this.info.order_id
          }).then(res => {
            if (res.code === 0) {
              this.$createToast({
                type: 'correct',
                time: 800,
                txt: '删除成功!'
              }).show()
              this.$emit('refresh')
            } else {
              this.$createToast({
                type: 'warn',
                time: 800,
                txt: res.msg
              }).show()
            }
          })
        }
      }).show()
    },

    // 再来一单
    async oneMoreOrder() {
      await anotherOrder({
        order_id: this.info.order_id
      }).then(res => {
        if (res.code === 0) {
          this.$router.push({
            path: '/cart'
          })
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 查看物流
    checkExpress() {
      this.$router.push({
        path: '/store/order/express',
        query: {
          orderId: this.info.order_id
        }
      })
    },

    // 确认收货
    async confirmOrder() {
      await comfirmReceive({
        order_id: this.info.order_id
      }).then(res => {
        if (res) {
          this.$createToast({
            type: 'correct',
            time: 800,
            txt: '确认收货'
          }).show()
          this.$emit('refresh')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-item-component {
  @include wh(100%, auto);
  background-color: #fff;
  border-radius: 0.2rem;
  .title-div {
    @include wh(100%, 1.8rem);
    @include flex(center, space-between, row);
    padding: 0 0.4rem;
    span {
      @include sc(0.6rem, $fc);
    }
    .store-info {
      @include flex(center, flex-start, row);
      .svg-icon {
        @include wh(1.2rem, 1.2rem);
        margin-right: 0.2rem;
      }
      img {
        @include wh(1.5rem, 1.5rem);
        border-radius: 1.5rem;
      }
    }
  }
  .pics-div {
    @include wh(100%, 4rem);
    overflow: hidden;
    .pics-scroll-div {
      padding: 0.5rem 0.2rem 0.5rem 0;
      @include flex(center, flex-start, row);
      .img-div {
        @include wh(3rem, 3rem);
        border-radius: 3rem;
        margin-left: 0.2rem;
        background-color: $bc;
        @include flex(center, center);
        img {
          @include wh(2rem, 2rem);
        }
      }
    }
  }
  .pay-info-div {
    @include wh(100%, 1.8rem);
    @include flex(center, flex-end, row);
    span {
      @include sc(0.6rem, $fc);
    }
    .money-span {
      margin: 0 0.4rem 0 0.4rem;
    }
  }
  .action-div {
    @include wh(100%, 2rem);
    border-top: solid 0.05rem $lc;
    @include flex(center, flex-end, row);
    .com-btn {
      @include wh(4rem, 1.5rem);
      @include sc(0.6rem, $fc);
      border-radius: 1.8rem;
      border: solid 0.05rem $blc;
      margin-right: 0.4rem;
      @include flex(center, center, row);
    }
    .suggest-btn {
      @include sc(0.6rem, $theme);
      border: solid 0.05rem $theme;
    }
  }
}
</style>
