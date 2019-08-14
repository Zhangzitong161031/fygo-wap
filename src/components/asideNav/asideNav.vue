<template>
  <div class="aside-nav-component">
    <ul>
      <li v-for="(item, index) of navList" :key="index" @click="changeMenu(item)" :class="curCate === item.cat_id ? 'actve-cli' : 'item-cli'">
        <div :class="curCate === item.cat_id ? 'border-div' : ''"></div>
        <div :class="curCate === item.cat_id ? 'actve-div' : 'item-div'">{{ item.cat_name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
export default {
  props: {
    navList: {
      required: true
    }
  },
  computed: {
    curCate() {
      return this.selectedCate === null ? this.navList[0].cat_id : this.selectedCate
    }
  },
  data() {
    return {
      selectedCate: null,
      scroll: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BetterScroll('.aside-nav-component', {
          scrollY: true,
          click: true
        })
      }
    })
  },
  activated() {
    // 刷新 better-scroll
    if (this.scroll) {
      this.scroll.refresh()
    }
  },
  methods: {
    // 切换商品类目
    changeMenu(item) {
      if (this.selectedCate !== item.cat_id) {
        this.selectedCate = item.cat_id
        this.$emit('changeMenu', item.cat_id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.aside-nav-component {
  @include wh(100%, 100%);
  background-color: $bc;
  overflow: hidden;
  ul {
    li {
      @include flex(center, center, row);
      .border-div {
        @include wh(0.2rem, 0.65rem);
        background-color: $theme;
      }
      .item-div {
        @include wh(calc(100% - 0.2rem), 2rem);
        @include flowC;
        @include sc(0.65rem, $fc);
        @include flex(center, center);
      }
      .actve-div {
        @include wh(calc(100% - 0.2rem), 2rem);
        @include flowC;
        @include sc(0.65rem, $theme);
        @include flex(center, center);
      }
    }
    .actve-cli {
      background-color: #fff;
    }
    .item-cli {
      background-color: $bc;
    }
  }
}
</style>
