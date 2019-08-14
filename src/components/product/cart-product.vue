<template>
  <div class="cart-product-component" @click="gotoDetail">
    <div class="mask-div" v-if="info.is_on_sale !== '1'">已失效</div>
    <img v-lazy="pic" alt="pic" :key="pic" />
    <div class="content-div">
      <div class="title-div" :style="info.is_on_sale !== '1' ? 'color: #999;' : ''">{{ info.goods_name }}</div>
      <div class="price-div">
        <span class="price-span" :style="info.is_on_sale !== '1' ? 'color: #999;' : ''">¥ {{ info.goods_price }}</span>
        <div class="cart-div" v-if="info.is_on_sale !== '1'" @click.stop="deletePro(info.rec_id)">
          <span>x{{ amount }}</span>
          <svg-icon icon-class="delete-active" />
        </div>
        <div class="amount-div" v-if="info.is_on_sale === '1'" @click.stop="">
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
import { editCartNum, deleteCart } from '@/service/getData'
export default {
  data() {
    return {
      amount: 0 // 购买数量
    }
  },
  props: {
    info: {
      type: Object,
      required: true
    },
    isSelected: {
      type: String,
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
    info(val) {
      let num = val.goods_number
      this.amount = num === undefined ? 0 : parseInt(num)
    }
  },
  created() {
    let num = this.info.goods_number
    this.amount = num === undefined ? 0 : parseInt(num)
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'UPDATE_CART_COUNT'
    ]),

    // 点击增加
    async amountPlus() {
      this.$emit('plus', this.info.goods_id)
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
      if (this.amount === 1) {
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content: `您是否要移除此商品`,
          confirmBtn: {
            text: '确定',
            active: false
          },
          cancelBtn: {
            text: '取消',
            active: true
          },
          onConfirm: async () => {
            await editCartNum({
              type: 2,
              goods_id: this.info.goods_id
            }).then(() => {
              this.UPDATE_CART_COUNT(-1)
              this.amount--
              this.$emit('remove', this.info.rec_id)
            })
          }
        }).show()
      } else {
        this.$emit('minus', this.info.goods_id)
        await editCartNum({
          type: 2,
          goods_id: this.info.goods_id
        }).then(() => {
          this.UPDATE_CART_COUNT(-1)
          this.amount--
        })
      }
    },

    // 删除商品
    deletePro(cartID) {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: `您是否要移除此商品?`,
        confirmBtn: {
          text: '确定',
          active: false
        },
        cancelBtn: {
          text: '取消',
          active: true
        },
        onConfirm: async () => {
          await deleteCart({
            cart_ids: cartID
          }).then(res => {
            if (res) {
              this.$emit('refreshData')
            }
          })
        }
      }).show()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-product-component {
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
      @include wh(100%, auto);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1rem;
    }
    .price-div {
      @include flex(flex-end, space-between, row);
      @include wh(100%, auto);
      .price-span {
        @include sc(0.7rem, $theme);
        font-weight: bold;
      }
      .cart-div {
        @include flex(center, space-between, row);
        @include wh(auto, 1.2rem);
        span {
          @include sc(0.6rem, #999);
          margin-right: 0.4rem;
        }
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
