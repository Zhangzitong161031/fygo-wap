<template>
  <div class="order-container">
    <div class="order-scroll-div">
      <!-- 地址 -->
      <div class="address-div">
        <div class="address-box" @click="slectedAddress">
          <div class="address-info">
            <div class="info-box">
              <svg-icon icon-class="address" />
              <!-- addInfo.province_name -->
              <span>{{ createOrderFlag === 'true' ? addInfo.province_name + addInfo.city_name + addInfo.area_name + addInfo.address : '请选择收货地址' }}</span>
            </div>
            <!-- v-if="addInfo.user_name -->
            <div class="name-box" v-if="createOrderFlag === 'true'">
              <span class="name-span">{{ addInfo.user_name }}</span>
              <span>{{ addInfo.mobile_phone }}</span>
            </div>
          </div>
          <svg-icon icon-class="arrows-right" />
        </div>
        <svg-icon icon-class="address-Lines" />
      </div>
      <!-- 商品 -->
      <div class="product-div">
        <div class="deliver-box" @click="showDeliverInfo">
          <span class="title-span">预计送达</span>
          <span class="tip-span">
            次日达
            <svg-icon icon-class="arrows-right" />
          </span>
        </div>
        <div class="product-box">
          <div class="info-div">
            <div v-for="item in orderCart.slice(0, 4)" :key="item.goods_id">
              <img v-lazy="getProPic(item.goods_thumb)" :key="item.goods_thumb" />
              <div class="mask-div" v-if="item.is_on_sale !== '1'"></div>
            </div>
          </div>
          <span @click="gotoProList">
            共 {{ totalAmount }} 件
            <svg-icon icon-class="arrows-right" />
          </span>
        </div>
      </div>
      <!-- 清除按钮 -->
      <div class="clear-btn" @click="clearInvalidPro" v-if="hasWrong">一键清除失效商品</div>
      <!-- 备注 -->
      <div class="note-div">
        <div class="title-div">订单备注:</div>
        <input type="text" maxlength="60" clearable="true" v-model="orderNote" @blur="blur" />
      </div>
      <!-- 结算信息 -->
      <div class="bill-div">
        <div class="total-pay-div">
          <span>商品总价</span>
          <span>￥{{ totalMoney }}</span>
        </div>
        <div class="ticket-div">
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
            <span>￥{{ totalMoney }}</span>
          </div>
          <div class="deliver-div">
            <span>配送费</span>
            <span>{{ shipFee === 0 ? '包邮' : `￥${shipFee}` }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 结算按钮 -->
    <div class="pay-div">
      <div class="money-div">
        <span class="title-span">付款:</span>
        <span class="money-span">￥{{ totalMoney }}</span>
      </div>
      <div class="pay-btn" @click="gotoPay">
        <span>去支付</span>
      </div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { mapMutations } from 'vuex'
import { getDefaultAdd, createOrder, getOrderCartInfo, deleteCart } from '@/service/getData'
import { reqDomain } from '@/utils/env'
import { getCookie } from '@/utils/tools'
export default {
  data() {
    return {
      // 订单备注
      orderNote: '',
      // 是否有异常商品
      hasWrong: false,
      // 购物车 id 数组, 用于获取邮费
      cartIDs: null,
      // 邮费
      shipFee: 0,
      // 总费用
      totalMoney: 0,
      // 商品总数
      totalAmount: 0,
      // 购物车
      orderCart: [],
      // 失效商品列表
      disableList: [],
      addInfo: {},
      createOrderFlag: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      new BetterScroll('.order-container', {
        click: true
      })
    })
  },
  async created() {
    this.createOrderFlag = getCookie('createOrderFlag')

    // 保存购物车 ids
    this.cartIDs = this.$route.query.cartIds.split(',')

    // 获取收货地址信息
    await this.getAddress()

    // 获取购物车信息
    this.getOrderCart()
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'SAVE_ORDER_CART'
    ]),

    // 获取收货地址信息
    async getAddress() {
      await getDefaultAdd().then(res => {
        if (res.code === 0) {
          if (res.data) this.addInfo = res.data
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 获取购物车信息
    async getOrderCart() {
      if (this.cartIDs.length) {
        await getOrderCartInfo({
          address_id: this.addInfo.id,
          cart_ids: this.cartIDs.join(',')
        }).then(res => {
          if (res.code === 0) {
            if (res.data) {
              this.shipFee = res.data.fee === undefined ? '' : res.data.fee
              this.totalMoney = res.data.total_money === undefined ? 0 : res.data.total_money
              this.orderCart = res.data.list ? res.data.list : []
              this.totalAmount = 0
              this.orderCart.forEach(el => {
                let num = parseInt(el.goods_number)
                this.totalAmount += num
              })
              // 下单之前, 订单商品列表, 从 localStorage 中读取
              this.SAVE_ORDER_CART({
                list: this.orderCart,
                totalAmount: this.totalAmount,
                totalMoney: this.totalMoney
              })
              if (!this.orderCart.length) {
                this.showClear()
              }
              // 校验商品列表和提取购物车id
              this.checkWrongPro()
            }
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      } else {
        this.showClear()
      }
    },

    // 提示列表为空
    showClear() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '订单商品列表被清空',
        confirmBtn: {
          text: '返回购物车',
          active: true
        },
        cancelBtn: {
          text: '返回首页',
          active: false
        },
        onConfirm: () => {
          this.$router.replace({
            path: '/cart'
          })
        },
        onCancel: () => {
          this.$router.replace({
            path: '/'
          })
        }
      }).show()
    },

    // 选择收货地址
    slectedAddress() {
      this.$router.push({
        path: '/address/list',
        query: {
          id: this.addInfo.id
        }
      })
    },

    // 次日达信息
    showDeliverInfo() {
      this.$createDialog({
        type: 'alert',
        maskClosable: true,
        title: '次日达',
        content: '正常情况下商品最快到达您手中的时间，具体以快递员实际送达时间为准！'
      }).show()
    },

    // 处理商品图片
    getProPic(pic) {
      let reg = new RegExp('^http')
      if (!reg.test(pic)) {
        return reqDomain + pic
      } else {
        return pic
      }
    },

    // 清除失效商品
    async clearInvalidPro() {
      await deleteCart({
        cart_ids: this.disableList.join(',')
      }).then(async res => {
        if (res.code === 0) {
          if (res.data) {
            await this.getOrderCart()
            this.hasWrong = false
            this.$createToast({
              type: 'correct',
              time: 1000,
              txt: '清除成功'
            }).show()
          }
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 校验异常商品
    checkWrongPro() {
      this.orderCart.forEach(el => {
        if (el.is_on_sale !== '1') {
          this.hasWrong = true
          this.disableList.push(el.rec_id)
          this.cartIDs = this.cartIDs.filter(item => {
            return item !== el
          })
        }
      })
    },

    // 商品清单
    gotoProList() {
      this.$router.push({
        path: '/store/order/pro_list',
        query: {
          flag: this.hasWrong,
          disableOrders: this.disableList.join(',')
        }
      })
    },

    // 让页面滚动到顶部
    blur() {
      document.body.scrollTop = 0
    },

    // 生成订单
    gotoPay() {
      if (this.hasWrong) {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '订单中存在失效商品，请删除后再下单！'
        }).show()
      } else if (this.createOrderFlag === 'false') {
        this.$createToast({
          txt: '请选择收货地址',
          type: 'warn',
          time: 800
        }).show()
      } else {
        createOrder({
          remark: this.orderNote,
          address_id: this.addInfo.id,
          cart_ids: this.cartIDs
        }).then(res => {
          if (res.code === 0) {
            // 创建订单成功, 跳转支付页面
            this.$router.replace({
              path: '/store/order/pay',
              query: {
                orderId: res.data.order_id,
                orderSn: res.data.order_sn,
                totalPrice: this.totalMoney
              }
            })
          } else if (res.code === 10011) {
            // 存在失效订单
            this.hasWrong = true
            this.disableList = [...new Set(res.data.invalid)]
            this.disableList.forEach(ele => {
              let index = this.orderCart.findIndex(item => {
                return item.rec_id === ele
              })
              this.orderCart[index].is_on_sale = '0'
              this.cartIDs = this.cartIDs.filter(item => {
                return item !== ele
              })
              this.SAVE_ORDER_CART({
                list: this.orderCart
              })
            })
            this.$createDialog({
              type: 'alert',
              title: '提示',
              content: '订单中存在失效商品，请删除后再下单！'
            }).show()
          } else {
            // 创建订单失败
            // 10033: 联系福利管理员
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
.order-container {
  @include wh(100%, calc(100% - 3rem));
  .order-scroll-div {
    background-color: $bc;
    padding: 0.4rem 0.4rem 0 0.4rem;
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
            .mask-div {
              @include wh(2.5rem, 2.5rem);
              border-radius: 2.5rem;
              position: absolute;
              z-index: 1;
              background-color: rgba(190, 190, 190, 0.3);
            }
          }
        }
        span {
          @include sc(0.6rem, $fc);
        }
      }
    }
    .clear-btn {
      @include wh(100%, 2rem);
      background-color: #fff;
      border-radius: 0.4rem;
      @include flex(center, center, row);
      @include sc(0.7rem, $theme);
      font-weight: bold;
      margin-bottom: 0.4rem;
      letter-spacing: 0.05rem;
    }
    .note-div {
      @include wh(100%, 2rem);
      background-color: #fff;
      border-radius: 0.4rem;
      padding: 0 0.4rem;
      @include flex(center, flex-start, row);
      margin-bottom: 0.4rem;
      .title-div {
        @include sc(0.6rem, $fc);
        font-weight: bold;
        @include wh(3.2rem, 100%);
        @include flex(center, center, row);
        margin-right: 0.2rem;
      }
      input {
        @include wh(calc(100% - 3.4rem), 100%);
        caret-color: $theme;
        @include sc(0.7rem, $fc);
      }
    }
    .bill-div {
      @include wh(100%, 7rem);
      background-color: #fff;
      border-radius: 0.4rem;
      padding: 0 0.4rem;
      margin-bottom: 0.4rem;
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
  }
  .pay-div {
    @include wh(100%, 2rem);
    position: fixed;
    bottom: 0;
    left: 0;
    @include flex(center, space-between, row);
    box-shadow: 0px 0px 10px $bc;
    .money-div {
      @include wh(calc(100% - 5rem), 100%);
      background-color: #fff;
      @include flex(center, flex-start, row);
      .title-span {
        @include sc(0.7rem, $fc);
        font-weight: bold;
        margin-left: 0.4rem;
        margin-right: 0.6rem;
      }
      .money-span {
        @include sc(0.7rem, $theme);
        font-weight: bold;
      }
    }
    .pay-btn {
      @include wh(5rem, 100%);
      background-color: $theme;
      @include flex(center, center, row);
      span {
        @include sc(0.7rem, #fff);
        font-weight: bold;
        letter-spacing: 0.05rem;
      }
    }
  }
}
</style>
