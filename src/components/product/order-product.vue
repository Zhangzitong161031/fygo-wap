<template>
  <div class="product-component">
    <div class="mask-div" v-if="info.is_on_sale !== '1'">已失效</div>
    <img v-lazy="pic" alt="pic" :key="pic" />
    <div class="content-div">
      <div class="title-div" :style="info.is_on_sale !== '1' ? 'color: #999;' : ''">{{ info.goods_name }}</div>
      <div class="price-div">
        <span class="price-span" :style="info.is_on_sale !== '1' ? 'color: #999;' : ''">¥{{ info.goods_price }}</span>
        <span class="amount-span" :style="info.is_on_sale !== '1' ? 'color: #999;' : ''">x {{ info.goods_number }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { reqDomain } from '@/utils/env'
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
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'UPDATE_TOTAL_AMOUNT',
      'UPDATE_CART'
    ])
  }
}
</script>

<style lang="scss" scoped>
.product-component {
  @include wh(100%, 4rem);
  padding: 0 0.5rem;
  border-bottom: 0.05rem solid $lc;
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
      @include wh(100%, 1rem);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1rem;
    }
    .price-div {
      @include flex(center, space-between, row);
      @include wh(100%, 1.2rem);
      .price-span {
        @include sc(0.7rem, $theme);
        font-weight: bold;
      }
      .amount-span {
        @include sc(0.6rem, $fc);
      }
    }
  }
}
</style>
