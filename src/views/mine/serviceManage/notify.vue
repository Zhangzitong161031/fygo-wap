<template>
  <div class="notify-container">
    <div class="header-div">
      <span>共 {{ notifyList.length }} 条通知</span>
      <span class="clear-btn" @click="clearNotify" v-if="notifyList.length">清空</span>
    </div>
    <div class="notify-content-div">
      <div class="notify-scroll-div" id="notify-scroll-div">
        <ul v-if="notifyList.length">
          <li><loading v-if="isDownLoading"></loading></li>
          <li v-for="(notify, index) in notifyList" :key="index">
            <notify-item :info="notify"></notify-item>
          </li>
          <li id="notify-extend-li"></li>
          <li><loading v-if="isUpLoading" class="up-loading"></loading></li>
        </ul>
        <div v-else class="none-notify-div">
          <loading v-if="isDownLoading"></loading>
          <div class="note-div">
            <span class="note-span">暂无通知消息</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { getNotifyList, clearNotify } from '@/service/getData'
import notifyItem from '@/components/notifyItem/notifyItem'
import loading from '@/components/loading/loading'
export default {
  components: {
    notifyItem,
    loading
  },
  data() {
    return {
      notifyList: [],
      nextPage: 1,
      scroll: null,
      isDownLoading: false,
      isUpLoading: false,
      extendList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BetterScroll('.notify-content-div', {
        click: true,
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        },
        pullUpLoad: {
          threshold: -20
        }
      })
      this.scroll.on('pullingDown', () => {
        this.onPullingDown()
      })
      this.scroll.on('pullingUp', () => {
        this.onPullingUp()
      })
    })
  },
  async created() {
    await this.getNotifys()
  },
  methods: {
    // 获取通知列表
    async getNotifys(page = 1) {
      await getNotifyList({
        page: page,
        limit: 10
      }).then(res => {
        if (res.code === 0) {
          if (res) {
            if (this.isUpLoading === true) {
              if (res.data.list) {
                this.notifyList = [...this.notifyList, ...res.data.list]
              }
            } else {
              this.notifyList = res.data.list ? [...res.data.list] : []
            }
            this.nextPage = res.data.list ? parseInt(res.data.page) + 1 : 2
          } else {
            this.notifyList = []
          }
          if (this.notifyList.length) {
            this.checkLoading()
          }
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // loading 判断
    checkLoading() {
      this.$nextTick(() => {
        this.scroll.refresh()
        let extend = document.getElementById('notify-extend-li')
        let eHeight = extend.offsetHeight
        if (eHeight) {
          extend.style.height = 0
        }
        let parent = document.getElementsByClassName('notify-content-div')[0]
        let scroll = document.getElementById('notify-scroll-div')
        let pHeight = parent.offsetHeight
        let sHeight = scroll.offsetHeight
        if (pHeight >= sHeight) {
          extend.style.height = pHeight - sHeight + 1 + 'px'
        }
      })
    },

    // 下拉刷新
    async onPullingDown() {
      this.isDownLoading = true
      await this.getNotifys()
      this.isDownLoading = false
      this.scroll.finishPullDown()
    },

    // 上拉加载
    async onPullingUp() {
      this.isUpLoading = true
      await this.getNotifys(this.nextPage)
      this.isUpLoading = false
      this.scroll.finishPullUp()
    },

    // 清空消息列表
    clearNotify() {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: '确认清空通知中心？',
        confirmBtn: {
          text: '清空',
          active: true
        },
        cancelBtn: {
          text: '取消',
          active: false
        },
        onConfirm: async () => {
          await clearNotify()
          await this.getNotifys()
        }
      }).show()
    }
  }
}
</script>

<style lang="scss" scoped>
.notify-container {
  @include wh(100%, 100%);
  .header-div {
    @include wh(100%, 2rem);
    @include flex(center, space-between, row);
    background-color: $bc;
    padding: 0 0.6rem;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    span {
      @include sc(0.7rem, $fc);
    }
    .clear-btn {
      @include sc(0.7rem, $theme);
    }
  }
  .notify-content-div {
    @include wh(100%, calc(100% - 2.4rem));
    position: relative;
    top: 2rem;
    padding: 0 0.4rem;
    .notify-scroll-div {
      ul {
        li {
          margin-bottom: 0.4rem;
        }
        .up-loading-li {
          @include flex(center, center, row);
          @include wh(100%, 1rem);
          .nomore-span {
            @include sc(0.6rem, $fc);
          }
        }
        .scroll-extend-li {
          @include wh(100%, 3rem);
        }
      }
      .none-notify-div {
        @include wh(100%, 29rem);
        .note-div {
          @include wh(100%, calc(100% - 2rem));
          @include flex(center, flex-start);
          .note-span {
            @include sc(0.8rem, $fc);
            margin-top: 8rem;
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
}
</style>
