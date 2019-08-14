<template>
  <div id="app">
    <!-- router-view -->
    <section :class="[isKeepAlive && showFootBar !== false ? 'footer-container' : 'container']">
      <transition name="router-fade">
        <keep-alive>
          <router-view v-if="isKeepAlive" mode="out-in"></router-view>
        </keep-alive>
      </transition>
      <transition name="router-fade">
        <router-view v-if="!isKeepAlive" mode="out-in"></router-view>
      </transition>
    </section>
    <!-- 底部bar -->
    <foot-guide v-if="isKeepAlive && showFootBar !== false"></foot-guide>
  </div>
</template>

<script>
import footGuide from './components/footer/footGuide'
export default {
  components: {
    footGuide
  },
  computed: {
    isKeepAlive() {
      return this.$route.meta.keepAlive
    },
    showFootBar() {
      return this.$route.meta.showFootBar
    }
  }
}
</script>

<style lang="scss">
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-to {
  opacity: 0;
}
#app {
  @include wh(100%, 100%);
  background-color: $bc;
  .footer-container {
    @include wh(100%, calc(100% - 1.95rem));
    background-color: $bc;
  }
  .container {
    @include wh(100%, 100%);
    background-color: $bc;
  }
}
</style>
<style lang="scss">
.cube-toast {
  .cube-popup-mask {
    background-color: #fff !important;
    opacity: 0 !important;
  }
  .cube-popup-container {
    .cube-popup-content {
      .cube-toast-icon {
        color: $theme;
      }
      .cube-toast-tip {
        color: $theme !important;
      }
    }
  }
}
.cube-action-sheet {
  .cube-popup-container {
    .cube-popup-content {
      .cube-action-sheet-panel {
        .cube-action-sheet-space {
          height: 0.05rem;
          background-color: #ebebeb;
        }
      }
    }
  }
}
</style>
