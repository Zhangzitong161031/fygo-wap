<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <div class="search-div">
      <div class="search-box">
        <svg-icon icon-class="search" />
        <sovell-input placeholder="哈密瓜" type="search" @searchEvent="searchProduct" ref="searchInput"></sovell-input>
      </div>
      <span @click="searchProduct">搜索</span>
    </div>
    <div class="scroll-div" id="search-scroll-div">
      <div class="scroll-box" id="scroll-box">
        <!-- 历史搜索 -->
        <div class="history-div" v-show="!hiddenSKeyDiv">
          <div class="title-div" v-if="searchKeys.length">
            历史搜索
            <div class="clear-div" @click="clearHistory">
              <svg-icon icon-class="delete"></svg-icon>
              <span>清空历史记录</span>
            </div>
          </div>
          <div class="history-box">
            <div class="key-div" v-for="(item, index) in searchKeys" :key="index" @click="hotKeySearch(item)">{{ item }}</div>
          </div>
        </div>
        <!-- 热门搜索 -->
        <div class="hot-div" v-show="!hiddenSKeyDiv">
          <div class="title-div" v-if="hotSearch.length">
            热门搜索
          </div>
          <div class="hot-box">
            <div class="key-div" v-for="(item, index) in hotSearch" :key="index" @click="hotKeySearch(item)">{{ item }}</div>
          </div>
        </div>
        <!-- 推荐商品 -->
        <div class="title-div" v-show="!hiddenSKeyDiv">推荐商品</div>
        <div class="recommend-div">
          <ul>
            <li v-for="item of list" :key="item.sku">
              <product :info="item" :ref="item.sku" v-if="item.is_on_sale === '1'"></product>
            </li>
            <li id="search-extend-li">
              <span v-if="!list.length">暂无相关信息</span>
            </li>
            <loading v-if="isUpLoading && hiddenSKeyDiv" class="up-loading"></loading>
          </ul>
        </div>
      </div>
    </div>
    <!-- 购物车 -->
    <div class="cart-div" @click="enterCart">
      <svg-icon icon-class="big-cart" />
      <div class="badge-div" v-if="cartAmount">{{ cartAmount }}</div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import sovellInput from '@/components/input/sovellInput.vue'
import product from '@/components/product/product'
import loading from '@/components/loading/loading'
import { getProductList, getHotKeys, getHotProductList, getCart } from '@/service/getData'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    sovellInput,
    product,
    loading
  },
  computed: {
    ...mapState({
      cartAmount: 'cartAmount',
      searchKey: 'searchKey',
      searchKeys: 'searchKeys'
    })
  },
  data() {
    return {
      // 热门搜索
      hotSearch: [],
      // 展示列表
      list: [],
      // 推荐商品列表
      recommendProList: [],
      // 搜索商品列表
      searchProList: [],
      curPage: 1,
      // 点击搜索, 隐藏部分 div
      hiddenSKeyDiv: false,
      // 上拉加载loading
      isUpLoading: false,
      scroll: null,
      cartList: []
    }
  },
  mounted() {
    // 创建商品列表滚动视图
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BetterScroll('.scroll-div', {
          scrollY: true,
          click: true,
          pullUpLoad: {
            threshold: 30
          }
        })
        this.scroll.on('pullingUp', () => {
          this.onPullingUp()
        })
      }
    })
  },
  async created() {
    this.INIT_ORDER_CART()
    this.GET_SEARCH_KEYS()
    await this.getHotSearchKeys()
    await this.getHotProList()
  },
  destroyed() {
    this.UPDATE_SEARCH_KEY('')
  },
  async activated() {
    if (this.list.length) {
      await this.getCartList()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/store' && from.path === '/store/search') {
      if (this.$vnode && this.$vnode.data.keepAlive) {
        if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
          if (this.$vnode.componentOptions) {
            var key = this.$vnode.key === null ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '') : this.$vnode.key
            var cache = this.$vnode.parent.componentInstance.cache
            var keys = this.$vnode.parent.componentInstance.keys
            if (cache[key]) {
              if (keys.length) {
                var index = keys.indexOf(key)
                if (index > -1) {
                  keys.splice(index, 1)
                }
              }
              delete cache[key]
            }
          }
        }
      }
      this.$destroy()
    }
    next()
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'INIT_ORDER_CART',
      'UPDATE_SEARCH_KEY',
      'SAVE_SEARCH_KEYS',
      'GET_SEARCH_KEYS'
    ]),

    // 获取搜索热词
    async getHotSearchKeys() {
      await getHotKeys().then(res => {
        if (res.code === 0) {
          if (res.data) this.hotSearch = res.data.value ? res.data.value.split(',') : []
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 获取推荐商品列表
    async getHotProList() {
      await getHotProductList().then(res => {
        if (res.code === 0) {
          this.list = []
          if (res.data) {
            this.recommendProList = res.data.hot_data ? res.data.hot_data : []
            this.list = this.recommendProList
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
        let extend = document.getElementById('search-extend-li')
        let eHeight = extend.offsetHeight
        if (eHeight) {
          extend.style.height = 0
        }
        let parent = document.getElementById('search-scroll-div')
        let scroll = document.getElementById('scroll-box')
        let pHeight = parent.offsetHeight
        let sHeight = scroll.offsetHeight
        if (pHeight >= sHeight) {
          extend.style.height = pHeight - sHeight + 1 + 'px'
        }
        // console.log(pHeight, sHeight, extend.offsetHeight)
      })
    },

    // 获取首页搜索商品
    async getSearchProList() {
      await getProductList(
        {
          keyword: this.searchKey,
          page: 1,
          limit: 15
        },
        true
      ).then(res => {
        if (res.code === 0) {
          this.list = []
          if (res.data) {
            this.searchProList = res.data.list ? res.data.list : []
            this.list = this.searchProList
          }
          this.curPage = 1
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

    // 上拉加载
    async onPullingUp() {
      // 推荐商品不分页
      if (this.hiddenSKeyDiv) {
        this.isUpLoading = true
        await getProductList(
          {
            keyword: this.searchKey,
            page: this.curPage + 1,
            limit: 15
          },
          false
        ).then(res => {
          if (res.code === 0) {
            if (res.data) {
              this.searchProList = [...this.searchProList, ...res.data.list]
              this.list = this.searchProList
              this.curPage = parseInt(res.data.page)
            }
            this.isUpLoading = false
            this.checkLoading()
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      }
      this.scroll.finishPullUp()
    },

    // 搜索商品
    async searchProduct() {
      // 收起软键盘
      this.$refs.searchInput.hiddenKeyborad()
      this.list = []
      if (this.searchKey !== '') {
        this.SAVE_SEARCH_KEYS(this.searchKey)
        this.hiddenSKeyDiv = true
        await this.getSearchProList()
      } else {
        this.hiddenSKeyDiv = false
        await this.getHotProList()
      }
    },

    // 热词搜索
    async hotKeySearch(key) {
      this.SAVE_SEARCH_KEYS(key)
      this.hiddenSKeyDiv = true
      this.UPDATE_SEARCH_KEY(key)
      await this.getSearchProList()
    },

    // 清除历史搜索记录
    clearHistory() {
      this.SAVE_SEARCH_KEYS('clearHistory')
    },

    // 进入购物车页面
    enterCart() {
      this.$router.push({
        path: '/cart'
      })
    },

    // 获取购物车列表, 刷新商品购物车数据
    async getCartList() {
      await getCart().then(res => {
        if (res.code === 0) {
          this.cartList = res.data.list ? res.data.list : []
          let flag = false
          this.list.forEach(item => {
            flag = false
            this.cartList.forEach(ele => {
              if (ele.goods_id === item.goods_id) {
                if (ele.goods_number) {
                  item.cart_number = ele.goods_number
                }
                flag = true
              }
            })
            if (!flag) {
              // 先置 null 的目的是让 product 组件能够 watch 到变化
              item.cart_number = null
              item.cart_number = 0
            }
          })
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  @include wh(100%, 100%);
  background-color: #fff;
  .search-div {
    @include wh(100%, 2rem);
    @include flex(center, space-between, row);
    position: fixed;
    top: 0rem;
    padding: 0 0.5rem;
    .search-box {
      @include wh(calc(100% - 2rem), 1.3rem);
      background-color: $bc;
      border-radius: 1.3rem;
      @include flex(center, flex-start, row);
      .svg-icon {
        @include wh(1rem, 1rem);
        margin-right: 0.2rem;
        margin-left: 0.3rem;
      }
      .sovell-input-div {
        width: calc(100% - 2.5rem);
        display: inline-block;
      }
    }
    span {
      @include sc(0.7rem, $theme);
      font-weight: bold;
    }
  }
  .scroll-div {
    background-color: #fff;
    padding: 0 0.5rem;
    @include wh(100%, calc(100% - 2rem));
    position: relative;
    top: 2rem;
    overflow: hidden;
    .scroll-box {
      .title-div {
        @include sc(0.6rem, #3c3c3c);
        @include flex(center, space-between, row);
        font-weight: bold;
        padding: 0.7rem 0 0 0;
        .clear-div {
          .svg-icon {
            @include wh(0.7rem, 0.7rem);
          }
          span {
            @include sc(0.6rem, $fc);
            margin-left: 0.2rem;
          }
        }
      }
      .hot-box,
      .history-box {
        @include wh(100%, auto);
        max-height: 3.5rem;
        @include flex(flex-start, flex-start, row);
        flex-wrap: wrap;
        overflow: hidden;
        .key-div {
          max-width: 8.2rem;
          @include flowC;
          @include sc(0.6rem, $fc);
          border: 0.06rem solid #d9d9d9;
          border-radius: 0.15rem;
          margin: 0.5rem 0.5rem 0 0;
          padding: 0.2rem 0.2rem;
        }
      }
      .recommend-div {
        .up-loading {
          @include wh(100%, 2rem);
        }
        #search-extend-li {
          @include flex(flex-start, center, row);
          span {
            @include sc(0.6rem, $fc);
            margin-top: 4rem;
          }
        }
      }
    }
  }
  .cart-div {
    @include wh(2.5rem, 2.5rem);
    @include flex(center, center, row);
    border-radius: 4rem;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    .svg-icon {
      @include wh(1.3rem, 1.3rem);
    }
    .badge-div {
      position: absolute;
      top: 0.4rem;
      right: 0.3rem;
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
