<template>
  <div class="product-detail-container">
    <div class="product-content-div">
      <div class="slide-div">
        <cube-slide ref="slide" :data="images">
          <cube-slide-item v-for="(item, index) in images" :key="index">
            <img :src="item" :key="item" />
          </cube-slide-item>
        </cube-slide>
        <div @click="tapFavorite" class="favorite-div">
          <svg-icon :icon-class="isFavorite ? 'favorite-active' : 'favorite'" />
        </div>
      </div>
      <div class="info-div">
        <div class="price-box">
          <span class="money-span"><svg-icon icon-class="money" />{{ proInfo.shop_price }}</span>
          <span>已有 {{ proInfo.sale_num }} 位同事购买</span>
        </div>
        <div class="title-box">{{ proInfo.goods_name }}</div>
        <div class="sub-title-box">{{ proInfo.goods_brief }}</div>
        <div class="service-div">
          <ul>
            <li v-for="(type, index) in proInfo.service" :key="index">
              <div class="dot-div"></div>
              <span>{{ type }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="spec-div" v-if="proInfo.goods_params && proInfo.goods_params.length">
        <div class="tip-box">规格参数</div>
        <div v-for="(item, index) in proInfo.goods_params" :key="index" class="spec-box">
          <div class="name-span">{{ item.name }}</div>
          <div class="content-span">{{ item.value }}</div>
        </div>
      </div>
      <div class="detail-div">
        <div class="tip-box">商品详情</div>
        <div class="detail-desc" v-if="proInfo.desc_mobile && proInfo.desc_mobile !== ''">
          <img v-for="(pic, index) in detailPics" :key="index" v-lazy="pic" />
        </div>
      </div>
    </div>
    <div class="cart-div">
      <div class="icon-div" @click="enterCart">
        <div class="badge-div" v-show="amount">{{ amount }}</div>
        <svg-icon icon-class="detail-cart" />
      </div>
      <div class="title-div" @click="addToCart" v-if="isOnsale === '1'">加入购物车</div>
      <div class="title-close-div" v-if="isOnsale !== '1'">已下架</div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { mapState, mapMutations } from 'vuex'
import { getProDetail, favoritePro, addCart, editCartNum, getCart } from '@/service/getData'
export default {
  data() {
    return {
      isFavorite: false, // 收藏
      proId: null, // 商品id
      proInfo: {}, // 详情信息
      images: [], // 轮播图
      amount: 0, // 购物车总数
      orderCart: [], // 购物车
      isOnsale: '1',
      detailPics: [],
      scroll: null
    }
  },
  computed: {
    ...mapState({
      cartAmount: 'cartAmount'
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BetterScroll('.product-detail-container', {
        click: true
      })
    })
  },
  async created() {
    this.proId = this.$route.query.id
    await this.getProDetail()

    // 初始化购物车数量
    this.INIT_ORDER_CART()
    this.amount = this.cartAmount
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'UPDATE_CART_COUNT',
      'INIT_ORDER_CART'
    ]),

    // 获取商品详情
    async getProDetail() {
      await getProDetail({
        goods_id: this.proId
      }).then(res => {
        if (res.code === 0) {
          this.images = res.data.goods_img
          this.proInfo = res.data
          this.isFavorite = res.data.is_collect === 1
          this.isOnsale = res.data.is_on_sale
          this.getPicLink(this.proInfo.desc_mobile)
          this.$nextTick(() => {
            this.scroll.refresh()
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

    // 获取 html 字符串中所有图片链接
    getPicLink(htmlstr) {
      var reg = /(http|https):([^'|"]*)?(.jpg|.gif|.png|.jpeg|.bmp$)/gi
      this.detailPics = htmlstr.match(reg)
    },

    // 点击收藏
    tapFavorite() {
      favoritePro({
        goods_id: this.proId
      }).then(res => {
        if (res.code === 0) {
          this.isFavorite = !this.isFavorite
          let text = this.isFavorite ? '收藏成功' : '取消收藏'
          this.$createToast({
            txt: text,
            type: 'correct',
            time: 800
          }).show()
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 获取购物车商品, 判断商品是否已经在购物车中
    async getCartList() {
      await getCart().then(res => {
        if (res.code === 0) {
          if (res.data) this.orderCart = res.data.list ? res.data.list : []
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 加入购物车
    async addToCart() {
      await this.getCartList()
      let index = this.orderCart.findIndex(ele => {
        return ele.goods_id === this.proId
      })
      if (index === -1) {
        // 加入购物车
        await addCart({
          goods_id: this.proId
        }).then(res => {
          if (res.code === 0) {
            this.UPDATE_CART_COUNT(1)
            this.amount++
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      } else {
        // 点击增加
        await editCartNum({
          type: 1,
          goods_id: this.proId
        }).then(res => {
          if (res.code === 0) {
            this.UPDATE_CART_COUNT(1)
            this.amount++
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      }
    },

    // 进入购物车页面
    enterCart() {
      this.$router.push({
        path: '/cart'
      })
    }
  }
}
</script>

<style lang="scss">
.product-detail-container {
  @include wh(100%, calc(100% - 2rem));
  .product-content-div {
    @include wh(100%, auto);
    .slide-div {
      @include wh(100%, 12rem);
      @include flex(center, center, row);
      background-color: #fff;
      .cube-slide {
        @include wh(100%, 100%);
        .cube-slide-group {
          @include wh(100%, 100%);
          .cube-slide-item {
            @include flex(center, center, row);
            @include wh(100%, 100%);
            img {
              @include wh(12rem, 100%);
            }
          }
        }
        .cube-slide-dots {
          span {
            @include wh(0.35rem, 0.35rem);
            border-radius: 0.35rem;
            margin-right: 0.2rem;
          }
        }
      }
      .favorite-div {
        position: absolute;
        top: 1rem;
        right: 1rem;
        .svg-icon {
          @include wh(1.3rem, 1.3rem);
        }
      }
    }
    .info-div {
      padding: 1rem 0.5rem 0 0.5rem;
      background-color: #fff;
      .price-box {
        @include flex(center, space-between, row);
        @include sc(0.6rem, $fc);
        .money-span {
          @include sc(1rem, $theme);
          font-weight: bold;
          .svg-icon {
            @include wh(0.7rem, 0.7rem);
            position: relative;
            bottom: 0.05rem;
          }
        }
      }
      .title-box {
        @include sc(0.7rem, $tc);
        margin-top: 0.5rem;
        font-weight: bold;
        line-height: 1.1rem;
        @include wh(100%, auto);
        @include clam;
      }
      .sub-title-box {
        @include wh(100%, auto);
        @include sc(0.6rem, $tc);
        margin-top: 0.2rem;
        line-height: 0.8rem;
        @include clam;
      }
      .service-div {
        margin-top: 0.5rem;
        border-top: solid 0.05rem $lc;
        @include flex(center, center, row);
        @include wh(100%, 1.6rem);
        ul {
          @include wh(100%, 100%);
          @include flex(center, space-between, row);
          flex-wrap: wrap;
          li {
            @include flex(center, flex-start, row);
            .dot-div {
              @include wh(6px, 6px);
              border-radius: 6px;
              background-color: $dc;
            }
            span {
              @include sc(0.6rem, $tc);
              margin-left: 0.2rem;
            }
          }
        }
      }
    }
    .spec-div {
      margin-top: 0.5rem;
      background-color: #fff;
      padding: 0.5rem;
      @include wh(100%, auto);
      .tip-box {
        border-left: 0.2rem solid $theme;
        padding: 0 0.5rem;
        @include sc(0.7rem, $tc);
        font-weight: bold;
      }
      .spec-box {
        @include wh(100%, auto);
        @include flex(center, flex-start, row);
        margin-top: 1rem;
        .name-span {
          @include wh(4rem, auto);
          @include sc(0.6rem, $fc);
          margin-right: 0.5rem;
        }
        .content-span {
          @include wh(calc(100% - 4.5rem), auto);
          @include sc(0.6rem, $tc);
          line-height: 0.8rem;
        }
      }
    }
    .detail-div {
      margin-top: 0.5rem;
      background-color: #fff;
      padding: 0.5rem;
      @include wh(100%, auto);
      .tip-box {
        border-left: 0.2rem solid $theme;
        padding: 0 0.5rem;
        @include sc(0.7rem, $tc);
        font-weight: bold;
      }
      .detail-desc {
        margin-top: 1rem;
        p {
          @include sc(0.6rem, $tc);
          margin-bottom: 0.5rem;
        }
        img {
          @include wh(100%, auto);
        }
      }
    }
  }
  .cart-div {
    @include wh(100%, 2rem);
    @include flex(center, flex-start, row);
    background-color: $theme;
    position: fixed;
    bottom: 0;
    .icon-div {
      @include wh(3.3rem, 100%);
      @include flex(center, center, row);
      position: relative;
      background-color: #fff;
      .svg-icon {
        @include wh(1.55rem, 1.55rem);
      }
      .badge-div {
        position: absolute;
        top: 0.28rem;
        right: 0.5rem;
        @include sc(0.6rem, #fff);
        background-color: $theme;
        @include wh(auto, 0.8rem);
        min-width: 0.8rem;
        border-radius: 0.8rem;
        @include flex(center, center, row);
      }
    }
    .title-div {
      @include wh(calc(100% - 3.3rem), 100%);
      @include flex(center, center, row);
      @include sc(0.75rem, #fff);
      font-weight: bold;
    }
    .title-close-div {
      @include wh(calc(100% - 3.3rem), 100%);
      @include flex(center, center, row);
      @include sc(0.75rem, #fff);
      font-weight: bold;
      background-color: $diable;
    }
  }
}
.cube-popup-container {
  height: 100%;
  .cube-toast-icon {
    color: $theme;
  }
}
</style>
