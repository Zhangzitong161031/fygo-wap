<template>
  <div class="favorite-container">
    <!-- edit div -->
    <div class="edit-div">
      <span>共{{ totalFavorite }}件商品</span>
      <span class="edit-span" @click="editClick" v-if="favoriteList.length">{{ editType === 1 ? '编辑' : '完成' }}</span>
    </div>
    <!-- 商品列表 -->
    <div class="favorite-product-list">
      <loading v-if="isDownLoading" class="down-loading"></loading>
      <div id="scoll-list-div">
        <cube-checkbox-group v-model="checkList">
          <cube-checkbox v-for="option in favoriteList" :key="option.sku" :option="option">
            <a href="javascript:;" @click.stop class="product-box">
              <favorite-product :info="option" @refreshData="getFavoriteList"></favorite-product>
            </a>
          </cube-checkbox>
        </cube-checkbox-group>
        <li id="favorite-extend-li"></li>
        <loading v-if="isUpLoading" class="up-loading"></loading>
      </div>
    </div>
    <!-- delete div -->
    <div class="delete-div" v-if="editType === 2">
      <cube-checkbox v-model="isAll">全选</cube-checkbox>
      <div class="delete-btn" @click="delFavorite">删除({{ checkList.length }})</div>
    </div>
    <!-- 购物车 -->
    <div class="cart-div" @click="enterCart">
      <svg-icon icon-class="big-cart" />
      <div class="badge-div" v-if="cartAmount">{{ cartAmount }}</div>
    </div>
  </div>
</template>

<script>
import { getFavoriteProList, favoriteCancel } from '@/service/getData'
import favoriteProduct from '@/components/product/favorite-product.vue'
import { BetterScroll } from 'cube-ui'
import { mapState, mapMutations } from 'vuex'
import loading from '@/components/loading/loading'
export default {
  components: {
    favoriteProduct,
    loading
  },
  computed: {
    ...mapState({
      cartAmount: 'cartAmount'
    })
  },
  data() {
    return {
      totalFavorite: 0,
      // 1编辑, 2完成
      editType: 1,
      favoriteList: [],
      curPage: 1,
      isAll: false,
      // 被勾选的 cube-checkbox 的 option.value 集合
      checkList: [],
      normalLength: 0,
      // 刷新控制
      isDownLoading: false,
      isUpLoading: false,
      needUpLoading: false,
      scroll: null
    }
  },
  watch: {
    // 更新购物车商品选中状态
    // checkList 与 value 字段
    checkList(list) {
      if (list.length === this.favoriteList.length) {
        this.isAll = true
      } else {
        this.isAll = false
      }
    },
    isAll(flag) {
      if (flag) {
        this.checkList = []
        this.favoriteList.forEach(element => {
          if (!element.disabled) {
            this.checkList.push(element.value)
          }
        })
      } else {
        if (this.checkList.length === this.favoriteList.length) {
          this.checkList = []
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BetterScroll('.favorite-product-list', {
        click: true,
        pullDownRefresh: {
          threshold: 50,
          stop: 0
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
    await this.getFavoriteList()
    this.INIT_ORDER_CART()
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'UPDATE_CART_COUNT',
      'INIT_ORDER_CART'
    ]),

    // loading 判断
    checkLoading() {
      this.$nextTick(() => {
        this.scroll.refresh()
        let extend = document.getElementById('favorite-extend-li')
        let eHeight = extend.offsetHeight
        if (eHeight) {
          extend.style.height = 0
        }
        let parent = document.getElementsByClassName('favorite-product-list')[0]
        let scroll = document.getElementById('scoll-list-div')
        let pHeight = parent.offsetHeight
        let sHeight = scroll.offsetHeight
        if (pHeight >= sHeight) {
          extend.style.height = pHeight - sHeight + 1 + 'px'
        } else {
          this.needUpLoading = true
        }
      })
    },

    // 获取收藏夹列表
    async getFavoriteList(page = this.curPage, loading = true) {
      await getFavoriteProList(
        {
          page: page,
          limit: 10
        },
        loading
      ).then(res => {
        if (res.code === 0) {
          if (this.isUpLoading === true) {
            if (res.data) {
              this.favoriteList = [...this.favoriteList, ...res.data.list]
            }
          } else {
            this.favoriteList = res.data ? res.data.list : []
          }
          if (res.data) {
            this.curPage = parseInt(res.data.page)
            this.totalFavorite = parseInt(res.data.total)
          } else {
            this.curPage = 1
            this.totalFavorite = 0
          }
          this.favoriteList.forEach(ele => {
            ele.value = ele.rec_id // checkbox 字段
          })
          this.handleCheckbox(this.editType)
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

    // 下拉刷新
    async onPullingDown() {
      this.isDownLoading = true
      await this.getFavoriteList(1, false)
      this.isDownLoading = false
      this.scroll.finishPullDown()
    },

    // 上拉加载
    async onPullingUp() {
      if (this.needUpLoading) {
        this.isUpLoading = true
        await this.getFavoriteList(this.curPage + 1, false)
        this.isUpLoading = false
      }
      this.scroll.finishPullUp()
    },

    // 编辑收藏夹
    editClick() {
      this.editType = this.editType === 1 ? 2 : 1
      this.handleCheckbox(this.editType)
      this.checkList = []
    },

    // 隐藏, 显示 checkbox
    handleCheckbox(type) {
      this.$nextTick(() => {
        if (type === 1) {
          let nodes = document.getElementsByClassName('cubeic-round-border')
          for (let index = 0; index < nodes.length; index++) {
            nodes[index].style.opacity = 0
          }
        } else {
          let nodes = document.getElementsByClassName('cubeic-round-border')
          for (let index = 0; index < nodes.length; index++) {
            nodes[index].style.opacity = 1
          }
        }
      })
    },

    // 进入购物车页面
    enterCart() {
      this.$router.push({
        path: '/cart'
      })
    },

    // 删除收藏夹商品
    delFavorite() {
      if (!this.checkList.length) {
        this.$createToast({
          txt: '请选择要删除的商品',
          type: 'warn',
          time: 800
        }).show()
      } else {
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content: `您是否要从收藏夹移除选中的商品?`,
          confirmBtn: {
            text: '确定',
            active: false
          },
          cancelBtn: {
            text: '取消',
            active: true
          },
          onConfirm: async () => {
            await favoriteCancel({
              collect_ids: this.checkList.join(',')
            }).then(async res => {
              if (res.code === 0) {
                await this.getFavoriteList(1, false)
                this.checkList = []
                this.editType = 1
              } else {
                this.$createToast({
                  txt: res.msg,
                  type: 'error',
                  time: 800
                }).show()
              }
            })
          }
        }).show()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.favorite-container {
  @include wh(100%, 100%);
  background-color: #fff;
  .edit-div {
    @include wh(100%, 2rem);
    @include flex(center, space-between, row);
    position: fixed;
    top: 0;
    padding: 0 0.5rem;
    z-index: 2;
    background-color: #fff;
    span {
      @include sc(0.7rem, $fc);
    }
    .edit-span {
      @include sc(0.7rem, $theme);
    }
  }
  .favorite-product-list {
    @include wh(100%, calc(100% - 4rem));
    font-size: 0.8rem;
    padding: 0 0.5rem;
    position: relative;
    top: 2rem;
    .product-box {
      display: inline-block;
      @include wh(14.4rem, 100%);
      font-size: 1rem;
      // 配合 cube-checkbox 处理自定义点击事件
      position: relative;
      z-index: 1;
    }
    .down-loading {
      @include wh(100%, 2rem);
    }
    .up-loading {
      @include wh(100%, 2rem);
    }
  }
  .delete-div {
    @include wh(100%, 2rem);
    position: fixed;
    z-index: 1;
    bottom: 0;
    left: 0;
    background-color: $bc;
    padding-left: 0.5rem;
    @include flex(center, space-between, row);
    font-size: 0.8rem;
    .cube-checkbox {
      @include wh(4rem, 100%);
    }
    .delete-btn {
      @include wh(4rem, 100%);
      background-color: $theme;
      @include sc(0.7rem, #fff);
      font-weight: bold;
      @include flex(center, center, row);
    }
  }
  .cart-div {
    @include wh(2.5rem, 2.5rem);
    @include flex(center, center, row);
    border-radius: 4rem;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    bottom: 3rem;
    right: 1rem;
    z-index: 1;
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
