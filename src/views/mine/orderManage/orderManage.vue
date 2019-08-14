<template>
  <div class="order-manage-container">
    <!-- nav bar -->
    <nav-bar :navList="navList" @changeNav="navChange"></nav-bar>
    <div class="order-scroll-div">
      <!-- 订单列表 -->
      <div class="order-list-div" id="order-list-div">
        <ul>
          <li><loading v-if="isDownLoading"></loading></li>
          <li v-for="item of orderList" :key="item.order_id">
            <order-item :info="item" @refresh="getFirstProList"></order-item>
          </li>
          <li id="order-extend-li">
            <div class="note-div" v-if="isNone && !orderList.length">
              <span class="note-span">暂无相关记录</span>
              <div class="order-btn" @click="gotoStore">去下单</div>
            </div>
          </li>
          <li><loading v-if="isUpLoading" class="up-loading"></loading></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import navBar from '@/components/navBar/navBar'
import orderItem from '@/components/orderItem/orderItem'
import loading from '@/components/loading/loading'
import { getOrderList } from '@/service/getData'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    navBar,
    orderItem,
    loading
  },
  data() {
    return {
      scroll: null,
      isDownLoading: false,
      isUpLoading: false,
      navChangeFlag: false,
      navList: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '待付款'
        },
        {
          id: 2,
          name: '待发货'
        },
        {
          id: 3,
          name: '待收货'
        },
        {
          id: 4,
          name: '已完成'
        }
      ],
      orderList: [],
      curPage: 1,
      extendList: [],
      isNone: false
    }
  },
  computed: {
    ...mapState({
      activeID: 'orLtActiveId'
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BetterScroll('.order-scroll-div', {
        click: true,
        pullDownRefresh: {
          threshold: 50,
          stop: 20
        },
        pullUpLoad: {
          threshold: 30
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
    await this.getFirstProList()
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'CHANGE_ORDER_LIST_ID'
    ]),

    // loading 判断
    checkLoading() {
      this.$nextTick(() => {
        // 重新计算 scroll-content
        this.scroll.refresh()
        // scroll-content 高度小于 scroll-wrapper 时, 添加 extend-li
        let extend = document.getElementById('order-extend-li')
        let eHeight = extend.offsetHeight
        if (eHeight) {
          extend.style.height = 0
        }
        let parent = document.getElementsByClassName('order-scroll-div')[0]
        let scroll = document.getElementById('order-list-div')
        let pHeight = parent.offsetHeight
        let sHeight = scroll.offsetHeight
        if (pHeight >= sHeight) {
          extend.style.height = pHeight - sHeight + 1 + 'px'
        }
        // 当切换 NavBar 时, scroll-content 滚到最顶部
        if (this.navChangeFlag) {
          this.scroll.scrollTo(0, 0, 100)
          this.navChangeFlag = false
        }
      })
    },

    // 获取首页商品列表
    async getFirstProList(loading = true) {
      await getOrderList(
        {
          page: 1,
          order_status: this.activeID
        },
        loading
      ).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.orderList = res.data.list ? [...res.data.list] : []
            this.isNone = res.data.length ? false : true
          } else {
            this.orderList = []
            this.isNone = true
          }
          this.curPage = 1
          if (this.isDownLoading) {
            this.isDownLoading = false
            this.scroll.finishPullDown()
          }
          this.checkLoading()
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // nav bar 切换
    async navChange(id) {
      this.navChangeFlag = true
      this.CHANGE_ORDER_LIST_ID(id)
      await this.getFirstProList()
    },

    // 下拉刷新
    async onPullingDown() {
      this.isDownLoading = true
      await this.getFirstProList(false)
    },

    // 上拉加载
    async onPullingUp() {
      this.isUpLoading = true
      await getOrderList(
        {
          page: this.curPage + 1,
          order_status: this.activeID
        },
        false
      ).then(res => {
        if (res.code === 0) {
          if (res.data) {
            if (res.data.list) {
              this.orderList = [...this.orderList, ...res.data.list]
              this.curPage = parseInt(res.data.page)
            }
          }
          this.isUpLoading = false
          this.scroll.finishPullUp()
          this.checkLoading()
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 去下单
    gotoStore() {
      this.$router.push({
        path: '/store'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-manage-container {
  @include wh(100%, 100%);
  .order-scroll-div {
    @include wh(100%, calc(100% - 3rem));
    position: relative;
    top: 2rem;
    .order-list-div {
      padding: 0 0.4rem;
      ul {
        li {
          margin-bottom: 0.6rem;
        }
        #order-extend-li {
          .note-div {
            @include wh(100%, calc(100% - 2rem));
            @include flex(center, center);
            .note-span {
              @include sc(0.8rem, $fc);
              margin-bottom: 0.5rem;
            }
            .order-btn {
              @include wh(4rem, 1rem);
              border-radius: 1rem;
              border: solid 0.05rem $blc;
              @include sc(0.6rem, $fc);
              @include flex(center, center, row);
            }
          }
        }
      }
    }
  }
}
</style>
