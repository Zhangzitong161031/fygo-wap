<template>
  <div class="order-detail-container">
    <div class="detail-scroll-div">
      <!-- tip -->
      <div class="status-div">
        <svg-icon :icon-class="icon" />
        <span>{{ title }}</span>
      </div>
      <!-- 地址 -->
      <div class="address-div">
        <div class="address-box">
          <div class="address-info">
            <div class="info-box">
              <svg-icon icon-class="address" />
              <span>{{ orderInfo.province + orderInfo.city + orderInfo.district + orderInfo.address }}</span>
            </div>
            <div class="name-box">
              <span class="name-span">{{ orderInfo.consignee }}</span>
              <span>{{ orderInfo.mobile }}</span>
            </div>
          </div>
        </div>
        <svg-icon icon-class="address-Lines" />
      </div>
      <!-- 商品 -->
      <div class="product-div">
        <div class="deliver-box">
          <span class="title-span">商品信息</span>
        </div>
        <div class="product-box">
          <div class="info-div">
            <div v-for="item in orderInfo.order_goods.slice(0, 4)" :key="item.goods_id">
              <img v-lazy="getProPic(item.goods_thumb)" :key="item.goods_thumb" />
            </div>
          </div>
          <span @click="gotoProList">
            共 {{ orderInfo.total_goods_number }} 件
            <svg-icon icon-class="arrows-right" />
          </span>
        </div>
      </div>
      <!-- 结算信息 -->
      <div class="bill-div">
        <div class="bill-box">
          <span class="title-span">结算信息</span>
        </div>
        <div class="total-pay-div">
          <span>商品总价</span>
          <span>￥{{ orderInfo.goods_amount }}</span>
        </div>
        <div class="ticket-div" v-if="type === 'wait-pay'">
          <div class="title-div">
            <svg-icon icon-class="ticket" />
            <span>商品券</span>
          </div>
          <div class="tip-div">
            <span>暂无可用商品券</span>
            <svg-icon icon-class="arrows-right" />
          </div>
        </div>
        <div class="practical-pay-div">
          <div class="price-div">
            <span>商品实付</span>
            <span>￥{{ orderInfo.goods_amount }}</span>
          </div>
          <div class="deliver-div">
            <span>配送费</span>
            <span>包邮</span>
          </div>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="order-div">
        <div class="order-box">
          <span class="title-span">订单信息</span>
        </div>
        <div class="com-div">
          <span>订单备注:</span>
          <span>{{ orderInfo.sign_building }}</span>
        </div>
        <div class="com-div">
          <span>订单号:</span>
          <span>{{ orderInfo.order_sn }}</span>
        </div>
        <div class="com-div" v-if="type !== 'wait-pay' && type !== 'yet-close'">
          <span>交易号:</span>
          <span>{{ orderInfo.business_sn }}</span>
        </div>
        <div class="com-div">
          <span>创建时间:</span>
          <span>{{ getTime(orderInfo.add_time) }}</span>
        </div>
        <div class="com-div" v-if="type !== 'wait-pay' && type !== 'yet-close'">
          <span>支付时间:</span>
          <span>{{ getTime(orderInfo.pay_time) }}</span>
        </div>
        <div class="com-div" v-if="type === 'wait-confirm' || type === 'yet-done'">
          <span>发货时间:</span>
          <span>{{ getTime(orderInfo.shipping_time) }}</span>
        </div>
        <div class="com-div" v-if="type === 'yet-done'">
          <span>成交时间:</span>
          <span>{{ getCompleteTime(orderInfo) }}</span>
        </div>
        <div class="com-div" v-if="type === 'yet-close'">
          <span>关闭时间:</span>
          <span>{{ getTime(orderInfo.cancel_time) }}</span>
        </div>
      </div>
    </div>
    <div class="action-div">
      <div v-if="type === 'wait-pay'" @click="cancelOrder">取消订单</div>
      <div v-if="type === 'wait-pay'" @click="gotoPay" class="pay-btn">去支付</div>

      <div v-if="type === 'wait-send'" @click="remindSend">提醒发货</div>

      <div v-if="type === 'wait-confirm' || type === 'yet-done'" @click="checkExpress">查看物流</div>
      <div v-if="type === 'yet-close'" @click="deleteOrder">删除订单</div>
      <div v-if="type === 'wait-confirm' || type === 'yet-done' || type === 'yet-close'" @click="oneMoreOrder" class="suggest-btn">再来一单</div>
      <div v-if="type === 'wait-confirm'" @click="confirmAccept" class="suggest-btn">确认收货</div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { getOrderDetail, remindShip, cancelOrder, deleteOrder, comfirmReceive, anotherOrder } from '@/service/getData'
import { reqDomain } from '@/utils/env'
import { formateTimestamp } from '@/utils/tools'
export default {
  data() {
    return {
      // wait-pay wait-send wait-confirm yet-done yet-close
      type: 'yet-done',
      title: '',
      icon: '',
      orderId: null,
      orderSn: null,
      orderInfo: {
        order_goods: []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      new BetterScroll('.order-detail-container', {
        click: true
      })
    })
  },
  async created() {
    this.orderId = this.$route.query.orderId
    this.orderSn = this.$route.query.orderSn
    await this.getDetail()
  },
  methods: {
    // 获取订单详情
    async getDetail() {
      await getOrderDetail({
        order_sn: this.orderSn,
        order_id: this.orderId
      }).then(res => {
        if (res.code === 0) {
          this.orderInfo = res.data
          this.getTypeValue(this.orderInfo.order_status, this.orderInfo.pay_status, this.orderInfo.shipping_status)
          this.switchDetail(this.type)
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
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

    // 获取时间
    getTime(date) {
      if (date === '') {
        return ''
      }
      return formateTimestamp(parseInt(date) * 1000)
    },

    // 获取成交时间
    getCompleteTime(orderInfo) {
      if (orderInfo.confirm_take_time !== '') {
        return this.getTime(orderInfo.confirm_take_time)
      } else if (orderInfo.auto_delivery_time !== '') {
        return this.getTime(orderInfo.auto_delivery_time)
      }
    },

    // 获取 type 状态值
    // shipping_status	string  0未发货   1已发货  2已收货确认 3/5配货中 4部分商品已发货
    // pay_status string  0未支付 1支付中  2已支付
    // order_status  0待确认 1已确认 2已取消 3无效 4退货 5已完成 7部分退款 8仅退款
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

    // 展示控制
    switchDetail(type) {
      switch (type) {
        case 'wait-pay':
          this.title = '待付款'
          this.icon = 'wait-pay'
          break
        case 'wait-send':
          this.title = '待发货'
          this.icon = 'wait-send'
          break
        case 'wait-confirm':
          this.title = '待收货'
          this.icon = 'wait-confirm'
          break
        case 'yet-done':
          this.title = '已完成'
          this.icon = 'yet-done'
          break
        case 'yet-close':
          this.title = '已关闭'
          this.icon = 'yet-close'
          break
      }
    },

    // 商品清单
    gotoProList() {
      this.$router.push({
        path: '/store/order/pro_list',
        query: {
          flag: false,
          orderId: this.orderId
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
          text: '继续填单',
          active: true
        },
        onConfirm: async () => {
          await cancelOrder({
            order_id: this.orderId
          }).then(async res => {
            if (res.code === 0) {
              this.$createToast({
                type: 'correct',
                time: 800,
                txt: '订单已取消!'
              }).show()
              await this.getDetail()
            } else {
              this.$createToast({
                txt: res.msg,
                type: 'error',
                time: 800
              }).show()
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
          orderId: this.orderId,
          orderSn: this.orderSn,
          totalPrice: this.orderInfo.goods_amount
        }
      })
    },

    // 提醒发货
    async remindSend() {
      await remindShip({
        order_id: this.orderId
      }).then(res => {
        if (res.code === 0) {
          this.$createToast({
            type: 'correct',
            time: 800,
            txt: '已提醒卖家发货!'
          }).show()
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
          orderId: this.orderId
        }
      })
    },

    // 再来一单
    async oneMoreOrder() {
      await anotherOrder({
        order_id: this.orderId
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

    // 确认收货
    async confirmAccept() {
      await comfirmReceive({
        order_id: this.orderId
      }).then(async res => {
        if (res.code === 0) {
          this.$createToast({
            type: 'correct',
            time: 800,
            txt: '确认收货'
          }).show()
          await this.getDetail()
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
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
          text: '删除订单',
          active: false
        },
        cancelBtn: {
          text: '取消删除',
          active: true
        },
        onConfirm: async () => {
          await deleteOrder({
            order_id: this.orderInfo.order_id
          }).then(async res => {
            if (res) {
              this.$router.replace({
                path: '/mine/order_manage'
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
.order-detail-container {
  @include wh(100%, calc(100% - 2.5rem));
  .detail-scroll-div {
    background-color: $bc;
    padding: 0.4rem 0.4rem 0 0.4rem;
    .status-div {
      @include wh(100%, 6rem);
      @include flex(center, center, row);
      .svg-icon {
        @include wh(2rem, 2rem);
      }
      span {
        @include sc(1rem, $theme);
        font-weight: bold;
        margin-left: 0.4rem;
      }
    }
    .address-div {
      @include wh(100%, 4rem);
      background-color: #fff;
      border-radius: 0.4rem;
      padding: 0.4rem 0.4rem 0 0.4rem;
      @include flex(center, space-between);
      margin-bottom: 0.4rem;
      .svg-icon {
        @include wh(100%, 0.12rem);
      }
      .address-box {
        @include wh(100%, calc(100% - 0.12rem));
        @include flex(center, space-between, row);
        .svg-icon {
          @include wh(1rem, 1rem);
        }
        .address-info {
          @include wh(calc(100% - 1rem), 100%);
          @include flex(flex-start, center);
          .svg-icon {
            @include wh(0.7rem, 0.7rem);
            margin-right: 0.2rem;
          }
          span {
            @include sc(0.6rem, $fc);
            font-weight: bold;
            margin-right: 0.2rem;
            max-width: 90%;
            @include flowC;
            line-height: 0.8rem;
          }
          .info-box {
            @include wh(100%, auto);
            @include flex(center, flex-start, row);
            margin-bottom: 0.2rem;
          }
          .name-box {
            @include wh(100%, auto);
            @include flex(center, flex-start, row);
            .name-span {
              margin-left: 0.8rem;
              margin-right: 0.4rem;
            }
          }
        }
      }
    }
    .product-div {
      @include wh(100%, 5rem);
      background-color: #fff;
      border-radius: 0.4rem;
      padding: 0.4rem 0.4rem 0 0.4rem;
      @include flex(center, space-between);
      margin-bottom: 0.4rem;
      .deliver-box {
        @include wh(100%, 2rem);
        border-bottom: solid 0.05rem $lc;
        @include flex(center, space-between, row);
        span {
          @include sc(0.6rem, $fc);
        }
        .title-span {
          font-weight: bold;
        }
      }
      .product-box {
        @include wh(100%, 3rem);
        @include flex(center, space-between, row);
        .info-div {
          @include flex(center, flex-start, row);
          div {
            @include wh(2.5rem, 2.5rem);
            background-color: $bc;
            @include flex(center, center, row);
            margin-right: 0.2rem;
            border-radius: 2.5rem;
            img {
              @include wh(1.8rem, 1.8rem);
            }
          }
        }
        span {
          @include sc(0.6rem, $fc);
        }
      }
    }
    .bill-div {
      background-color: #fff;
      border-radius: 0.4rem;
      padding: 0 0.4rem;
      margin-bottom: 0.4rem;
      .bill-box {
        @include wh(100%, 2rem);
        border-bottom: solid 0.05rem $lc;
        @include flex(center, space-between, row);
        span {
          @include sc(0.6rem, $fc);
        }
        .title-span {
          font-weight: bold;
        }
      }
      .total-pay-div {
        @include wh(100%, 2rem);
        border-bottom: solid 0.05rem $lc;
        @include flex(center, space-between, row);
        span {
          @include sc(0.6rem, $fc);
        }
      }
      .ticket-div {
        @include wh(100%, 2rem);
        border-bottom: solid 0.05rem $lc;
        @include flex(center, space-between, row);
        span {
          @include sc(0.6rem, $fc);
        }
        .title-div {
          @include flex(center, flex-start, row);
          .svg-icon {
            margin-right: 0.2rem;
          }
        }
        .tip-div {
          @include flex(center, flex-start, row);
          @include sc(0.6rem, $fc);
        }
      }
      .practical-pay-div {
        @include wh(100%, 3rem);
        padding: 0.6rem 0;
        span {
          @include sc(0.6rem, $fc);
        }
        .price-div {
          @include flex(center, space-between, row);
          margin-bottom: 0.6rem;
        }
        .deliver-div {
          @include flex(center, space-between, row);
        }
      }
    }
    .order-div {
      background-color: #fff;
      border-radius: 0.4rem;
      padding: 0 0.4rem;
      .order-box {
        @include wh(100%, 2rem);
        border-bottom: solid 0.05rem $lc;
        @include flex(center, space-between, row);
        span {
          @include sc(0.6rem, $fc);
        }
        .title-span {
          font-weight: bold;
        }
      }
      .com-div {
        @include wh(100%, 2rem);
        border-bottom: solid 0.05rem $lc;
        @include flex(center, space-between, row);
        span {
          @include sc(0.6rem, $fc);
        }
      }
    }
  }
  .action-div {
    @include wh(100%, 2rem);
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    box-shadow: 0px 0px 10px $bc;
    @include flex(center, flex-end, row);
    div {
      @include wh(4.2rem, 1.5rem);
      border-radius: 1.8rem;
      border: solid 0.05rem $blc;
      @include sc(0.6rem, $fc);
      @include flex(center, center, row);
      margin-right: 0.4rem;
    }
    .pay-btn {
      background-color: $theme;
      @include sc(0.6rem, #fff);
    }
    .suggest-btn {
      @include sc(0.6rem, $theme);
      border: solid 0.05rem $theme;
    }
  }
}
</style>
<style lang="scss">
.cube-popup-container {
  .cube-toast-icon {
    color: $theme;
  }
}
</style>
