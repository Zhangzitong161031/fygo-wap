<template>
  <div class="product-component" @click="gotoDetail">
    <img v-lazy="pic" alt="pic" :key="pic" />
    <div class="content-div">
      <div class="title-div">{{ info.goods_name }}</div>
      <div class="tip-div">{{ info.goods_brief }}</div>
      <div class="price-div">
        <span class="price-span">¥ {{ info.shop_price }}</span>
        <!-- cart icon -->
        <div class="cart-div" v-if="showCart && amount === 0" @click.stop="clickBuy">
          <svg-icon icon-class="paycart" />
        </div>
        <!-- plus, minus -->
        <div class="amount-div" v-if="!showCart || amount !== 0" @click.stop="">
          <div @click.stop="amountMinus"><svg-icon icon-class="minus" /></div>
          <span>{{ amount }}</span>
          <div @click.stop="amountPlus"><svg-icon icon-class="plus" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { reqDomain } from '@/utils/env'
import { addCart, editCartNum } from '@/service/getData'
export default {
  data() {
    return {
      showCart: true, // 移除购物车
      amount: 0 // 购买数量
    }
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    pic() {
      let reg = new RegExp('^http')
      if (!reg.test(this.info.goods_thumb)) {
        return reqDomain + this.info.goods_thumb
      } else {
        return this.info.goods_thumb
      }
    }
  },
  watch: {
    // 响应 keep-alive 数据更新
    // 1.第一个handler：其值是一个回调函数。即监听到变化时应该执行的函数。
    // 2.第二个是deep：其值是true或false；确认是否深入监听。（一般监听时是不能监听到对象属性值的变化的，数组的值变化可以听到。）
    // 3.第三个是immediate：其值是true或false；确认是否以当前的初始值执行handler的函数。
    info: {
      handler(val) {
        let num = val.cart_number
        this.amount = num === undefined || num === '0' ? 0 : parseInt(num)
        this.showCart = num === undefined || num === '0' || num === 0 ? true : false
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'UPDATE_CART_COUNT'
    ]),

    // 添加购物车
    async clickBuy() {
      await addCart({
        goods_id: this.info.goods_id
      }).then(res => {
        if (res) {
          if (res.code === 0) {
            this.UPDATE_CART_COUNT(1)
            this.showCart = false
            this.amount++
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        }
      })
    },

    // 点击增加
    async amountPlus() {
      await editCartNum({
        type: 1,
        goods_id: this.info.goods_id
      }).then(() => {
        this.UPDATE_CART_COUNT(1)
        this.amount++
      })
    },

    // 点击减少
    async amountMinus() {
      await editCartNum({
        type: 2,
        goods_id: this.info.goods_id
      }).then(() => {
        this.UPDATE_CART_COUNT(-1)
        if (this.amount === 1) {
          this.showCart = true
        }
        this.amount--
      })
    },

    // 进入商品详情
    gotoDetail() {
      this.$router.push({
        path: '/store/detail',
        query: {
          id: this.info.goods_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product-component {
  @include wh(100%, 5rem);
  padding: 0 0.5rem;
  border-bottom: 0.05rem solid $lc;
  @include flex(center, flex-start, row);
  img {
    @include wh(3rem, 3rem);
    margin-right: 0.3rem;
  }
  .content-div {
    @include wh(calc(100% - 3rem - 0.5rem), 3rem);
    .title-div {
      @include sc(0.7rem, $tc);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.1rem;
      line-height: 1rem;
    }
    .tip-div {
      @include wh(100%, 0.6rem);
      @include sc(0.6rem, $tipc);
      @include flowC;
      margin-bottom: 0.5rem;
    }
    .price-div {
      @include flex(center, space-between, row);
      @include wh(100%, 1.2rem);
      .price-span {
        @include sc(0.7rem, $theme);
        font-weight: bold;
      }
      .cart-div {
        @include flex(center, center);
        @include wh(1.2rem, 1.2rem);
        background-color: $theme;
        border-radius: 1.2rem;
      }
      .amount-div {
        @include wh(3.5rem, 1.2rem);
        @include flex(center, space-around, row);
        span {
          @include sc(0.75rem, $fc);
        }
        div {
          @include flex(center, center);
        }
      }
    }
  }
}
</style>
