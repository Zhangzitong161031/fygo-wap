<template>
  <div class="store-container">
    <!-- header -->
    <div class="header">
      <div class="add-div" @click="slectedAddress">
        <svg-icon icon-class="address" />
        <span>{{ getCurrentAdd() }}</span>
        <svg-icon icon-class="arrows-down" />
      </div>
      <ul class="search-div" @click="searchProduct">
        <svg-icon icon-class="search" />
        <span>哈密瓜</span>
      </ul>
    </div>
    <!-- content -->
    <div class="content">
      <!-- aside -->
      <div class="aside-nav" ref="wrapper">
        <aside-nav :navList="navList" @changeMenu="changeMenu($event)"></aside-nav>
      </div>
      <!-- list -->
      <div class="product-list" id="store-product-list">
        <ul id="store-list-div">
          <li><loading v-if="isDownLoading"></loading></li>
          <li v-for="item of productList" :key="item.goods_id">
            <product :info="item" v-if="item.is_on_sale === '1'"></product>
          </li>
          <li id="store-extend-li">
            <span v-if="!productList.length">暂无相关信息</span>
          </li>
          <loading v-if="isUpLoading" class="up-loading"></loading>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { getNavList, getProductList, getDefaultAdd, getCart } from '@/service/getData'
import product from '@/components/product/product'
import asideNav from '@/components/asideNav/asideNav'
import loading from '@/components/loading/loading'
import { mapMutations } from 'vuex'
export default {
  components: {
    product,
    asideNav,
    loading
  },
  data() {
    return {
      navList: [], // 类目列表
      productList: [], // 商品列表
      curPage: 1,
      navChangeFlag: false,
      slectedCate: null, // 当前选中的商品类目
      scroll: null, // 商品列表滚动视图
      isDownLoading: false, // 下拉刷新loading
      isUpLoading: false, // 上拉加载loading
      extendList: [], // 不能滚动时加入扩展
      cartList: [],
      addInfo: {}
    }
  },
  mounted() {
    // 创建商品列表滚动视图
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BetterScroll('.product-list', {
          scrollY: true,
          click: true,
          pullDownRefresh: {
            threshold: 50,
            stop: 30
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
      }
    })
  },
  async created() {
    // 获取默认收货地址, 商品列表依赖于收货地址
    await getDefaultAdd().then(res => {
      if (res.code === 0) {
        this.addInfo = res.data
      } else {
        this.$createToast({
          txt: res.msg,
          type: 'error',
          time: 800
        }).show()
      }
    })

    // 获取类目列表
    await getNavList().then(res => {
      if (res.code === 0) {
        this.navList = res.data ? res.data : []
      } else {
        this.$createToast({
          txt: res.msg,
          type: 'error',
          time: 800
        }).show()
      }
    })

    // 获取商品列表
    await this.getFirstProList()

    // 初始化购物车总数
    this.INIT_ORDER_CART()
  },
  async activated() {
    // 判断是否是地址切换, 如果是, 重新获取商品列表, 不用获取购物车数据
    let flag = false
    await getDefaultAdd().then(async res => {
      if (res.code === 0) {
        if (res.data.id !== this.addInfo.id) {
          await this.getFirstProList()
          this.addInfo = res.data
          this.scroll.scrollTo(0, 0, 100)
          flag = true
        }
      } else {
        this.$createToast({
          txt: res.msg,
          type: 'error',
          time: 800
        }).show()
      }
    })

    // 获取购物车数据, 刷新商品列表购买数量
    if (this.productList.length && !flag) {
      await this.getCartList()
    }

    // 刷新 better-scroll
    if (this.scroll) {
      this.scroll.refresh()
    }
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'INIT_ORDER_CART'
    ]),
    // loading 判断
    checkLoading() {
      this.$nextTick(() => {
        // 重新计算 scroll-content
        this.scroll.refresh()
        // scroll-content 高度小于 scroll-wrapper 时, 添加 extend-li
        let extend = document.getElementById('store-extend-li')
        let eHeight = extend.offsetHeight
        if (eHeight) {
          extend.style.height = 0
        }
        let parent = document.getElementById('store-product-list')
        let scroll = document.getElementById('store-list-div')
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

    // 获取首页数据
    async getFirstProList(loading = true, page = 1) {
      await getProductList(
        {
          page: page,
          limit: 15,
          cate_id: this.slectedCate === null ? this.navList[0].cat_id : this.slectedCate
        },
        loading
      ).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.productList = res.data.list ? [...res.data.list] : []
          } else {
            this.productList = []
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

    // 获取购物车列表, 刷新商品购物车数据
    async getCartList() {
      await getCart().then(res => {
        if (res.code === 0) {
          this.cartList = res.data.list ? res.data.list : []
          let flag = false
          this.productList.forEach(item => {
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
    },

    // 商品类目切换
    async changeMenu(val) {
      this.navChangeFlag = true
      this.slectedCate = val
      await this.getFirstProList()
    },

    // 下拉刷新
    async onPullingDown() {
      this.isDownLoading = true
      this.getFirstProList(false)
    },

    // 上拉加载
    async onPullingUp() {
      this.isUpLoading = true
      await getProductList(
        {
          page: this.curPage + 1,
          limit: 15,
          cate_id: this.slectedCate === null ? this.navList[0].cat_id : this.slectedCate
        },
        false
      ).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.productList = [...this.productList, ...res.data.list]
            this.curPage = parseInt(res.data.page)
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

    // 选择收货地址
    slectedAddress() {
      this.$router.push({
        path: '/address/list',
        query: {
          id: this.addInfo.id
        }
      })
    },

    // 拼接当前显示的收货地址
    getCurrentAdd() {
      let addInfo = this.addInfo
      if (addInfo.id && addInfo.id.length) {
        return addInfo.province_name + addInfo.city_name + addInfo.area_name + addInfo.address
      } else {
        return ''
      }
    },

    // 商品搜索
    searchProduct() {
      this.$router.push({
        path: '/store/search'
      })
    }
  }
}
</script>

<style lang="scss">
.store-container {
  @include wh(100%, 100%);
  background-color: #fff;
  .header {
    @include wh(100%, 2rem);
    background-color: #fff;
    @include flex(center, flex-start, row);
    padding: 0rem 0.5rem;
    .add-div {
      @include wh(40%, 1rem);
      @include flex(center, flex-start, row);
      .svg-icon {
        @include wh(0.7rem, 0.7rem);
        margin-right: 0.2rem;
      }
      span {
        @include sc(0.6rem, $fc);
        margin-right: 0.2rem;
        max-width: 60%;
        height: auto;
        @include flowC;
      }
    }
    .search-div {
      @include wh(60%, 1.3rem);
      background-color: $bc;
      border-radius: 0.2rem;
      @include flex(center, center, row);
      .svg-icon {
        @include wh(0.8rem, 0.8rem);
        margin-right: 0.2rem;
      }
      span {
        @include sc(0.6rem, $phc);
      }
    }
  }
  .content {
    @include wh(100%, calc(100% - 2rem));
    display: flex;
    .aside-nav {
      @include wh(4rem, 100%);
    }
    .product-list {
      @include wh(calc(100% - 4rem), 100%);
      background-color: #fff;
      overflow: hidden;
      #store-extend-li {
        @include flex(flex-start, center, row);
        span {
          @include sc(0.6rem, $fc);
          margin-top: 4rem;
        }
      }
    }
  }
}
</style>
