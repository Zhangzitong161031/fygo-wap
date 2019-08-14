<template>
  <div class="nav-component">
    <div v-for="item in navList" :key="item.id" @click="changeItem(item.id)" class="nav-div">
      <div :class="['name-div', activeID === item.id ? 'active-name' : '']">{{ item.name }}</div>
      <div class="dot-div" v-if="activeID === item.id"></div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
export default {
  // eslint-disable-next-line
  props: [
    'navList'
  ],
  data() {
    return {
      activeID: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      new BetterScroll('.nav-component', {
        click: true,
        scrollX: true,
        scrollY: false
      })
    })
  },
  methods: {
    changeItem(id) {
      this.activeID = id
      this.$emit('changeNav', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-component {
  @include wh(100%, 2rem);
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  @include flex(center, space-around, row);
  .nav-div {
    @include wh(1rem, 100%);
    @include flex(center, space-between);
    flex: 1;
    .name-div {
      @include wh(100%, calc(100% - 0.1rem));
      @include flex(center, center);
      @include sc(0.7rem, $fc);
      font-weight: bold;
    }
    .active-name {
      @include sc(0.7rem, $theme);
      font-weight: bold;
    }
    .dot-div {
      @include wh(65%, 0.1rem);
      background-color: $theme;
    }
  }
}
</style>
