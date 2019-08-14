<template>
  <div class="favorite-product-component" @click.stop="gotoDetail">
    <div class="mask-div" v-if="info.is_on_sale !== '1'">已失效</div>
    <img v-lazy="pic" alt="pic" :key="pic" />
    <div class="content-div">
      <div class="title-div" :style="info.is_on_sale !== '1' ? 'color: #999;' : ''">{{ info.goods_name }}</div>
      <div class="price-div">
        <span class="price-span" :style="info.is_on_sale !== '1' ? 'color: #999;' : ''">¥{{ info.shop_price }}</span>
        <div class="delete-div" v-if="info.is_on_sale !== '1'" @click.stop="deletePro()">
          <svg-icon icon-class="delete-active" />
        </div>
        <div class="cart-div" v-if="info.is_on_sale === '1' && !amount" @click.stop="clickBuy">
          <svg-icon icon-class="paycart" />
        </div>
        <div class="amount-div" v-if="info.is_on_sale === '1' && amount" @click.stop="">
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
import { addCart, editCartNum, favoritePro } from '@/service/getData'
export default {
  data() {
    return {
      amount: 0
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
  props: {
    info: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: false
    }
  },
  created() {
    let num = this.info.cart_number
    this.amount = num === undefined ? 0 : parseInt(num)
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'UPDATE_CART_COUNT'
    ]),

    // 点击购买
    async clickBuy() {
      await addCart({
        goods_id: this.info.goods_id
      }).then(res => {
        if (res.code === 0) {
          this.UPDATE_CART_COUNT(1)
          this.amount++
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
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
        this.amount--
      })
    },

    // 进入商品详情
    gotoDetail() {
      if (this.info.is_on_sale == '1') {
        this.$router.push({
          path: '/store/detail',
          query: {
            id: this.info.goods_id
          }
        })
      }
    },

    // 删除商品
    deletePro() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: `您是否要从收藏夹移除此商品?`,
        confirmBtn: {
          text: '确定',
          active: false
        },
        cancelBtn: {
          text: '取消',
          active: true
        },
        onConfirm: async () => {
          await favoritePro({
            goods_id: this.info.goods_id
          }).then(res => {
            if (res) {
              this.$emit('refreshData')
            }
          })
        }
      }).show()
    }
  }
}
</script>

<style lang="scss" scoped>
.favorite-product-component {
  @include wh(100%, 4rem);
  padding: 0 0.5rem;
  @include flex(center, flex-start, row);
  .mask-div {
    @include wh(3rem, 3rem);
    margin-right: 0.3rem;
    position: absolute;
    z-index: 1;
    background-color: rgba(100, 100, 100, 0.3);
    @include sc(0.8rem, rgb(245, 239, 239));
    @include flex(center, center);
    font-weight: bold;
  }
  img {
    @include wh(3rem, 3rem);
    margin-right: 0.3rem;
  }
  .content-div {
    @include wh(calc(100% - 3rem - 0.5rem), 3rem);
    @include flex(flex-start, space-between);
    .title-div {
      @include sc(0.7rem, $tc);
      margin-bottom: -0.2rem;
      line-height: 1rem;
      @include wh(100%, 1rem);
      @include flowC;
    }
    .price-div {
      @include flex(center, space-between, row);
      @include wh(100%, 1.2rem);
      .price-span {
        @include sc(0.7rem, $theme);
        font-weight: bold;
      }
      .delete-div {
        @include flex(center, center);
        @include wh(1.2rem, 1.2rem);
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
<style>
.cube-checkbox-wrap {
  padding: 0;
}
</style>
