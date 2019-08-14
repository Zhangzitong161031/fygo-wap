<template>
  <div class="nav-welfare-component">
    <div class="nav-scroll-div" ref="welfarecomponent">
      <div v-for="item in navList" :key="item.id" @click="changeItem(item.id)" class="nav-div">
        <div :class="['name-div', activeID === item.id ? 'active-name' : '']">{{ item.name }}</div>
        <div class="dot-div" v-if="activeID === item.id"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
export default {
  props: ['navList', 'id'],
  data() {
    return {
      activeID: 1,
      scroll: null
    }
  },
  watch: {
    id(val) {
      this.activeID = val
    }
  },
  mounted() {
    if (!this.scroll) {
      let len = this.navList.length
      let totalLen = len * 2
      this.$refs.welfarecomponent.style.width = totalLen + 'rem'

      this.$nextTick(() => {
        this.scroll = new BetterScroll('.nav-welfare-component', {
          click: true,
          scrollX: true,
          scrollY: false,
          eventPassthrough: 'vertical'
        })
      })
    }
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
.nav-welfare-component {
  @include wh(100%, 2rem);
  position: fixed;
  z-index: 1;
  background-color: #fff;
  .nav-scroll-div {
    @include wh(auto, 2rem);
    @include flex(center, flex-start, row);
    .nav-div {
      @include wh(auto, 100%);
      margin-left: 1rem;
      .name-div {
        @include wh(100%, calc(100% - 0.1rem));
        @include flex(center, center);
        @include sc(0.7rem, $fc);
        font-weight: bold;
        white-space: nowrap;
      }
      .active-name {
        @include sc(0.7rem, $theme);
        font-weight: bold;
      }
      .dot-div {
        @include wh(100%, 0.1rem);
        background-color: $theme;
      }
    }
  }
}
</style>
