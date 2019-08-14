<template>
  <div class="order-detail-container">
    <div class="order-detail-scroll">
      <!-- 商品列表 -->
      <div class="pro-lis-div">
        <ul>
          <li v-for="item of proList" :key="item.goods_id">
            <order-product :info="item" :ref="item.goods_id"></order-product>
          </li>
        </ul>
      </div>
      <!-- 清除按钮 -->
      <div class="clear-btn" @click="clearInvalidPro" v-if="hasWrong">一键清除失效商品</div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { mapState, mapMutations } from 'vuex'
import orderProduct from '@/components/product/order-product'
import { getOrderProList, deleteCart } from '@/service/getData'
export default {
  data() {
    return {
      hasWrong: false,
      orderId: null,
      proList: [],
      // 清除失效商品的id
      disableOrders: null
    }
  },
  components: {
    orderProduct
  },
  mounted() {
    this.$nextTick(() => {
      new BetterScroll('.order-detail-container', {
        click: true
      })
    })
  },
  async created() {
    let query = this.$route.query
    this.hasWrong = typeof query.flag === 'string' ? (query.flag === 'true' ? true : false) : query.flag
    this.orderId = query.orderId ? query.orderId : null
    this.disableOrders = query.disableOrders ? query.disableOrders : null

    if (this.orderId === null) {
      // 下单页面 -> 订单商品列表
      this.INIT_ORDER_CART()
      this.proList = [...this.orderCart]
    } else {
      // 订单详情 -> 订单商品列表
      await this.getProList()
    }
  },
  computed: {
    ...mapState({
      // 下单页面
      orderCart: 'orderCart'
    })
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'INIT_ORDER_CART',
      'SAVE_ORDER_CART'
    ]),

    // 获取商品清单 - 订单详情页面
    async getProList() {
      await getOrderProList({
        order_id: this.orderId
      }).then(res => {
        if (res.code === 0) {
          this.proList = [...res.data.list]
          // 订单id查询商品清单每一 is_on_sale 字段
          this.proList.forEach(ele => {
            ele.is_on_sale = '1'
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

    // 清除按钮
    async clearInvalidPro() {
      await deleteCart({
        cart_ids: this.disableOrders
      }).then(async res => {
        if (res.code === 0) {
          if (res.data) {
            this.proList = this.proList.filter(ele => {
              return ele.is_on_sale === '1'
            })

            let totalAmount = 0
            let totalMoney = 0
            this.proList.forEach(ele => {
              let num = parseInt(ele.goods_number)
              let price = parseInt(ele.goods_price * 100)
              totalAmount += num
              totalMoney += num * price
            })

            this.SAVE_ORDER_CART({
              list: this.proList,
              totalAmount: totalAmount,
              totalMoney: totalMoney / 100
            })

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
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail-container {
  @include wh(100%, 100%);
  .order-detail-scroll {
    background-color: $bc;
    @include flex(center, flex-start);
    .pro-lis-div {
      @include wh(100%, auto);
      background-color: #fff;
      margin-bottom: 1rem;
    }
    .clear-btn {
      @include wh(calc(100% - 0.8rem), 2rem);
      background-color: #fff;
      border-radius: 0.4rem;
      @include flex(center, center, row);
      @include sc(0.7rem, $theme);
      font-weight: bold;
      margin-bottom: 0.4rem;
      letter-spacing: 0.05rem;
    }
  }
}
</style>
