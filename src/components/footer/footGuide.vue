<template>
  <section id="foot_guide">
    <section @click="gotoAddress({ path: '/home' })" class="guide_item">
      <svg-icon :icon-class="$route.path.indexOf('home') !== -1 ? 'home-active' : 'home'" />
      <span :class="$route.path.indexOf('home') !== -1 ? 'actice-span' : 'span'">首页</span>
    </section>
    <section @click="gotoAddress({ path: `/store` })" class="guide_item">
      <svg-icon :icon-class="$route.path.indexOf('store') !== -1 ? 'store-active' : 'store'" />
      <span :class="$route.path.indexOf('store') !== -1 ? 'actice-span' : 'span'">福易购</span>
    </section>
    <!-- <section @click="gotoAddress('/pay')" class="guide_item">
      <svg-icon :icon-class="$route.path.indexOf('pay') !== -1 ? 'pay-active' : 'pay'" />
      <span :class="$route.path.indexOf('pay') !== -1 ? 'actice-span' : 'span'">支付</span>
    </section> -->
    <section @click="gotoAddress('/cart')" class="guide_item cart-item">
      <svg-icon :icon-class="$route.path.indexOf('cart') !== -1 ? 'cart-active' : 'cart'" />
      <span :class="$route.path.indexOf('cart') !== -1 ? 'actice-span' : 'span'">购物车</span>
      <div class="badge-div" v-if="cartAmount">{{ cartAmount }}</div>
    </section>
    <section @click="gotoAddress('/mine')" class="guide_item">
      <svg-icon :icon-class="$route.path.indexOf('mine') !== -1 ? 'mine-active' : 'mine'" />
      <span :class="$route.path.indexOf('mine') !== -1 ? 'actice-span' : 'span'">我的</span>
    </section>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      cartAmount: 'cartAmount'
    })
  },
  methods: {
    gotoAddress(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss">
#foot_guide {
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: #fff;
  @include wh(100%, 1.95rem);
  display: flex;
  box-shadow: 0 -0.026667rem 0.053333rem rgba(0, 0, 0, 0);
  .guide_item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon_style {
      @include wh(0.8rem, 0.8rem);
      margin-top: 0.3rem;
      fill: #ccc;
    }
    span {
      @include sc(0.45rem, $diable);
      margin-top: 0.1rem;
    }
    .actice-span {
      @include sc(0.45rem, $theme);
      margin-top: 0.1rem;
    }
  }
  .cart-item {
    position: relative;
    .badge-div {
      position: absolute;
      top: 0.05rem;
      // right: 0.6rem;
      right: 1rem;
      @include sc(0.6rem, #fff);
      background-color: $theme;
      @include wh(auto, 0.8rem);
      min-width: 0.8rem;
      border-radius: 0.8rem;
      @include flex(center, center, row);
    }
  }
}
</style>
