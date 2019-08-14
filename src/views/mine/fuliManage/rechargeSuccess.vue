<template>
  <div class="recharge-container">
    <div class="header-div">
      <div class="left-div">
        <svg-icon icon-class="recharge-icon" class="recharge-icon"></svg-icon>
      </div>
      <div class="title-div">福易购福利卡充值</div>
    </div>
    <div class="info-div">
      <svg-icon :icon-class="icon"></svg-icon>
      <div class="title-div">{{ title }}</div>
      <div class="tip-div">{{ tip }}</div>
    </div>
    <div class="commit-btn" @click="backHome">返回首页</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      icon: 'success',
      title: '充值成功',
      tip: '恭喜您，快去福利商城下单吧~'
    }
  },
  methods: {
    // 提交充值
    backHome() {
      this.$router.push({
        path: '/home'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.recharge-container {
  @include wh(100%, 100%);
  @include flex(center, flex-start);
  .header-div {
    @include wh(100%, 4rem);
    background-color: $theme;
    @include flex(center, flex-start, row);
    margin-bottom: 1rem;
    .left-div {
      @include wh(5rem, 100%);
      @include flex(center, center, row);
      .recharge-icon {
        @include wh(3rem, 3rem);
      }
    }
    .title-div {
      @include sc(0.7rem, #fff);
      @include wh(auto, 100%);
      @include flex(center, center, row);
      font-weight: bold;
      letter-spacing: 0.1rem;
    }
  }
  .info-div {
    @include flex(center, flex-start);
    margin-bottom: 1.5rem;
    .svg-icon {
      @include wh(2.5rem, 2.5rem);
      margin-bottom: 0.5rem;
    }
    .title-div {
      @include sc(0.6rem, $fc);
      font-weight: bold;
      margin-bottom: 0.8rem;
    }
    .tip-div {
      @include sc(0.4rem, $fc);
    }
  }
  .commit-btn {
    @include wh(calc(100% - 2rem), 2rem);
    background-color: $theme;
    @include sc(0.7rem, #fff);
    font-weight: bold;
    letter-spacing: 0.1rem;
    @include flex(center, center);
    border-radius: 0.2rem;
  }
}
</style>
