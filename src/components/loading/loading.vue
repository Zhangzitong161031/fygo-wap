<template>
  <div class="loading-component">
    <img src="./loading.gif" />
    <span>努力加载中</span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.loading-component {
  @include flex(center, center, row);
  img {
    width: 0.8rem;
    height: 0.8rem;
    margin-right: 0.2rem;
  }
  span {
    @include sc(0.6rem, $fc);
  }
}
</style>
