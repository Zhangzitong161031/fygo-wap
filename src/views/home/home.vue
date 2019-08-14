<template>
  <div class="home-container">
    <div class="home-scroll-div">
      <!-- top info div -->
      <div class="top-info-div">
        <!-- 个人信息 -->
        <div class="user-info-div">
          <div class="user-div">
            <img v-lazy="pic" alt="user" v-if="userInfo.user_picture" />
            <img src="@/assets/user-icon.png" alt="user" v-else />
            <div class="info-div">
              <div class="user-box">
                <div class="name-span">{{ userInfo.user_name }}</div>
                <div class="company-box">{{ userInfo.company_name }}</div>
              </div>
              <div class="job-number-span">
                <div class="title-span">工号</div>
                <div class="num-span">{{ userInfo.job_number }}</div>
              </div>
            </div>
          </div>
          <div class="money-div">
            <div class="com-div">
              <div class="title-span">账户余额</div>
              <div class="money-span">{{ userInfo.user_money }}</div>
            </div>
            <div class="com-div">
              <div class="title-span">线上可用</div>
              <div class="money-span">{{ userInfo.online_balance }}</div>
            </div>
            <div class="com-div">
              <div class="title-span">线下可用</div>
              <div class="money-span">{{ userInfo.offline_balance }}</div>
            </div>
          </div>
        </div>
        <!-- action div -->
        <div class="action-div">
          <div class="com-div" @click="scanCode">
            <svg-icon icon-class="scan-white" />
            <span>扫一扫</span>
          </div>
          <div class="com-div" @click="payMoney">
            <svg-icon icon-class="pay-white" class="pay-icon" />
            <span>支付</span>
          </div>
          <div class="com-div" @click="gotoStore">
            <svg-icon icon-class="store-white" />
            <span>福利商城</span>
          </div>
          <div class="com-div" @click="onlineOrder">
            <svg-icon icon-class="order-white" />
            <span>在线订餐</span>
          </div>
        </div>
      </div>
      <!-- 更多类目 -->
      <div class="menu-list-div">
        <div class="com-div" @click="gotoStoreCate('生鲜净菜')">
          <svg-icon icon-class="fresh" />
          <span>生鲜净菜</span>
        </div>
        <div class="com-div" @click="gotoStoreCate('健康体检')">
          <svg-icon icon-class="medical" />
          <span>健康体检</span>
        </div>
        <div class="com-div" @click="gotoStoreCate('咖啡饮品')">
          <svg-icon icon-class="coffe" class="coffe-icon" />
          <span class="com-span">咖啡饮品</span>
        </div>
        <div class="com-div" @click="gotoStoreCate('商务礼品')">
          <svg-icon icon-class="gift" class="gift-icon" />
          <span class="com-span">商务礼品</span>
        </div>
        <div class="com-div" @click="gotoWelfare">
          <svg-icon icon-class="more" class="more-icon" />
          <span class="com-span">全部</span>
        </div>
      </div>
      <!-- notify div -->
      <div class="notify-info-div">
        <div class="article-slide-div">
          <cube-slide ref="slide" :data="items">
            <cube-slide-item v-for="(item, index) in items" :key="index">
              <img :src="getPic(item.file_url)" @click="checkNoDetail(item.article_id)" />
            </cube-slide-item>
          </cube-slide>
        </div>

        <div class="notify-slide-div" @click="gotoNotify">
          <div class="icon-div"><svg-icon icon-class="notify" /></div>
          <div class="notify-slide">
            <div id="box">
              <ul id="con1" ref="con1" :class="{ anim: animate === true }">
                <li v-for="(item, index) in notices" :key="index">
                  <div class="inform-span">{{ item.content }}</div>
                  <div class="date-span">{{ getTime(item.add_time) }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- fuli div -->
      <!-- <div class="fuli-info-div">
        <div class="title-div">我的福利</div>
        <div class="item-div">
          <div class="fir-row">
            <div class="fir-column com-column" @click="gotoStore">
              <svg-icon icon-class="sulin-icon" />
              <span>
                <div class="title-span">福利商城</div>
                <div class="tip-span">苏宁商品专供</div>
              </span>
            </div>
            <div class="com-column" @click="onlineOrder">
              <svg-icon icon-class="repast-icon" />
              <span>
                <div class="title-span">在线订餐</div>
                <div class="tip-span">线上食堂订餐</div>
              </span>
            </div>
          </div>
          <div class="sec-row">
            <div class="fir-column com-column" @click="medicalHealth">
              <svg-icon icon-class="medical-icon" />
              <span>
                <div class="title-span">医疗健康</div>
                <div class="tip-span">预约体验挂号</div>
              </span>
            </div>
            <div class="com-column" @click="foodManage">
              <svg-icon icon-class="food-icon" />
              <span>
                <div class="title-span">膳食推荐</div>
                <div class="tip-span">健康饮食百科</div>
              </span>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 企业推荐区域 -->
      <div class="recommend-pro-div">
        <div class="pro-div">
          <div class="top-div">
            <div class="left-div">
              <div class="title-div">
                <span class="title-span">今日必抢</span>
                <span class="tip-span">美味嗨不停</span>
              </div>
              <div class="product-div">
                <img v-for="(item, index) in BQList" :key="index" v-lazy="getPic(item.goods_thumb)" @click="gotoProductDetail(item.goods_id)" />
              </div>
            </div>
            <div class="right-div" @click="checkCate">
              <div class="title-div">
                <span class="title-span">节日福利</span>
                <span class="tip-span">甜蜜嘉年华</span>
              </div>
              <div class="product-div">
                <img src="@/assets/JR1.png" />
                <img src="@/assets/JR2.png" />
              </div>
            </div>
          </div>

          <div class="bottom-div" @click="checkCate">
            <div class="title-div">
              <span class="title-span">
                企业内购
                <span class="tip-span">大牌不止5折</span>
              </span>
              <div class="icon-div">
                <span class="tip-span">更多</span>
                <svg-icon icon-class="arrows-right" />
              </div>
            </div>
            <div class="product-div">
              <img src="@/assets/NG1.png" />
              <img src="@/assets/NG2.png" />
              <img src="@/assets/NG3.png" />
            </div>
          </div>
        </div>
      </div>
      <!-- 每日必抢 -->
      <div class="hot-info-div">
        <div class="title-div" @click="gotoStore">
          <span class="title-span">今日热销</span>
          <div class="icon-div">
            <span class="tip-span">更多热销</span>
            <svg-icon icon-class="arrows-right" />
          </div>
        </div>
        <div class="hot-div" v-if="hotList.length">
          <div v-for="(item, index) in hotList" :key="index" @click="gotoProductDetail(item.goods_id)" class="product-div">
            <img v-lazy="getPic(item.goods_thumb)" :key="item.goods_thumb" />
            <div class="title-span">{{ item.goods_name }}</div>
            <div class="money-span">￥{{ item.shop_price }}</div>
          </div>
          <div v-if="hotList.length === 2 || hotList.length === 1" class="product-extend-div"></div>
          <div v-if="hotList.length === 1" class="product-extend-div"></div>
        </div>
        <div v-else class="hot-note-info">
          <span>暂无相关信息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { getUserInfo, getNotifyList, getHotProductList, getArticalSlide, getDefaultAdd } from '@/service/getData'
import { reqDomain, host } from '@/utils/env'
import { mapMutations } from 'vuex'
import { formateTimestamp } from '@/utils/tools'
import { setCookie } from '@/utils/tools'
import wx from 'weixin-jsapi'
export default {
  data() {
    return {
      userInfo: {},
      scrollInterval: null,
      animate: false,
      notices: [
        {
          content: '暂无通知',
          add_time: ''
        }
      ],
      items: [],
      hotList: [],
      BQList: [],
      beScroll: null
    }
  },
  computed: {
    pic() {
      let reg = new RegExp('^http')
      if (!reg.test(this.userInfo.user_picture)) {
        return reqDomain + this.userInfo.user_picture
      } else {
        return this.userInfo.user_picture
      }
    }
  },
  mounted() {
    if (!this.beScroll) {
      this.$nextTick(() => {
        this.beScroll = new BetterScroll('.home-container', {
          click: true
        })
      })
    }
  },
  async created() {
    if (this.$route.query.openid) {
      setCookie('openid', this.$route.query.openid)
    }
    // 获取默认收货地址 - 为后台定位
    await getDefaultAdd().then(res => {
      if (res.code !== 0) {
        this.$createToast({
          txt: res.msg,
          type: 'error',
          time: 800
        }).show()
      }
    })
  },
  // 路由离开时滚到顶部, 路由进入时刷新布局, 重新计算页面高度
  deactivated() {
    if (this.beScroll) {
      this.beScroll.scrollTo(0, 0, 100)
    }
  },
  async activated() {
    if (this.beScroll) {
      this.$nextTick(() => {
        this.beScroll.refresh()
      })
    }
    // 获取用户信息
    await this.getUser()

    // 获取通知
    await this.getNfList()

    // 获取公告轮播图
    await this.getNotifySlides()

    // 获取热门商品
    await this.getHot()
  },
  beforeDestroy() {
    clearInterval(this.scrollInterval)
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'SAVE_CART_COUNT'
    ]),

    // 获取用户信息
    async getUser() {
      await getUserInfo().then(res => {
        if (res.code === 0) {
          this.userInfo = res.data
          this.SAVE_CART_COUNT(parseInt(res.data.cart_num))
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 获取公告轮播图
    async getNotifySlides() {
      await getArticalSlide().then(res => {
        if (res.code === 0) {
          this.items = res.data ? res.data : []
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 跳转公告详细
    checkNoDetail(id) {
      this.$router.push({
        path: '/home/artical',
        query: {
          id: id
        }
      })
    },

    // 获取通知消息
    async getNfList() {
      await getNotifyList().then(res => {
        if (res.code === 0) {
          if (res.data.list) this.notices = res.data.list
          if (this.notices.length > 1) {
            // 消息滚动
            this.scrollInterval = setInterval(this.scroll, 3000)
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

    // 获取热门商品
    async getHot() {
      await getHotProductList().then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.hotList = res.data.hot_data ? res.data.hot_data.filter(pro => pro.is_on_sale !== '0').slice(0, 3) : []
            this.BQList = res.data.best_data ? res.data.best_data.filter(pro => pro.is_on_sale !== '0').slice(0, 2) : []
          } else {
            this.hotList = []
            this.BQList = []
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

    // 字幕公告滚动
    scroll() {
      this.animate = true
      setTimeout(() => {
        this.notices.push(this.notices[0])
        this.notices.shift()
        this.animate = false
      }, 1500)
    },

    // 获取时间
    getTime(date) {
      return date === '' ? '' : formateTimestamp(parseInt(date) * 1000)
    },

    // 获取商品图片
    getPic(thumb) {
      let reg = new RegExp('^http')
      if (!reg.test(thumb)) {
        return reqDomain + thumb
      } else {
        return thumb
      }
    },

    // 注入权限验证配置
    async doconfig() {
      let toast = this.$createToast({
        time: 0,
        txt: '',
        mask: true
      }).show()
      let signLink = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.entryUrl
      let url = host + '/signature?url=' + signLink
      try {
        const response = await fetch(url)
        const res = await response.json()
        if (res) {
          await wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ['scanQRCode']
          })
        }
        toast.hide()
      } catch (error) {
        alert(error.message)
        toast.hide()
        throw new Error(error)
      }
    },

    // 扫一扫
    async scanCode() {
      await this.doconfig()
      wx.ready(() => {
        wx.scanQRCode({
          needResult: 1,
          scanType: ['qrCode', 'barCode'],
          success: res => {
            var result = res.resultStr
            if (/http[s]{0,1}:\/\/([\w.]+\/?)\S*/.test(result)) {
              window.location.href = result
            } else {
              alert(result)
            }
          }
        })
      })
    },

    // 支付
    payMoney() {
      this.$router.push({
        path: '/pay'
      })
    },

    // 福利商城
    gotoStore() {
      this.$router.push({
        path: '/store'
      })
    },

    // 在线订餐
    onlineOrder() {
      this.$createToast({
        txt: '在线订餐',
        type: 'correct',
        time: 800
      }).show()
    },

    // 跳转消息中心
    gotoNotify() {
      this.$router.push({
        path: '/mine/service/notify'
      })
    },

    // 商品详情
    gotoProductDetail(val) {
      this.$router.push({
        path: '/store/detail',
        query: {
          id: val
        }
      })
    },

    // 医疗健康
    medicalHealth() {
      this.$createToast({
        txt: '医疗健康',
        type: 'correct',
        time: 800
      }).show()
    },

    // 膳食推荐
    foodManage() {
      this.$createToast({
        txt: '膳食推荐',
        type: 'correct',
        time: 800
      }).show()
    },

    // 跳转我的福利
    gotoWelfare() {
      this.$router.push({
        path: '/home/welfare'
      })
    },

    // 节日福利, 企业内购
    checkCate() {
      this.$createToast({
        txt: '敬请期待',
        type: 'warn',
        time: 800
      }).show()
    },

    // 跳转商城类目
    gotoStoreCate(name) {
      this.$createToast({
        txt: name,
        type: 'warn',
        time: 800
      }).show()
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  @include wh(100%, 100%);
  background-color: #fff;
  .home-scroll-div {
    .top-info-div {
      @include wh(100%, 10rem);
      background-color: #3e3e3e;
      padding: 0.4rem;
      .user-info-div {
        @include wh(100%, auto);
        background-color: $userbc;
        border-radius: 0.4rem;
        @include flex(flex-start, center);
        padding: 0.4rem 0rem;
        .user-div {
          @include flex(center, flex-start, row);
          @include wh(100%, auto);
          margin-left: 1rem;
          img {
            @include wh(2.5rem, 2.5rem);
            border-radius: 2.5rem;
          }
          .info-div {
            @include wh(calc(100% - 2.5rem), 2.5rem);
            @include flex(flex-start, space-between);
            padding: 0.2rem 0 0.4rem 0.2rem;
            .user-box {
              @include flex(center, flex-start, row);
              width: 100%;
              .name-span {
                margin-right: 0.4rem;
                @include sc(0.6rem, $fc);
                font-weight: bold;
                max-width: 3rem;
                @include flowC;
                line-height: 1rem;
              }
              .company-box {
                @include sc(0.6rem, $fc);
                max-width: 8rem;
                @include flowC;
              }
            }
            .job-number-span {
              @include sc(0.6rem, $fc);
              @include wh(auto, 0.8rem);
              border-radius: 1rem;
              overflow: hidden;
              @include flex(center, flex-start, row);
              font-weight: bold;
              .title-span {
                @include wh(1.7rem, 100%);
                background-color: #cfac7d;
                @include sc(0.5rem, $fc);
                @include flex(center, center, row);
                font-weight: bold;
              }
              .num-span {
                @include wh(auto, 100%);
                background-color: #eee;
                @include sc(0.5rem, $fc);
                @include flex(center, center, row);
                font-weight: bold;
                padding: 0 0.2rem;
                min-width: 2rem;
              }
            }
          }
        }
        .money-div {
          @include wh(100%, auto);
          @include flex(center, space-between, row);
          margin-top: 0.5rem;
          .com-div {
            @include wh(33%, 100%);
            flex-grow: 1;
            flex-shrink: 1;
            @include flex(center, center);
            .title-span {
              @include sc(0.6rem, $fc);
              margin-bottom: 0.2rem;
            }
            .money-span {
              @include sc(0.6rem, $fc);
            }
          }
        }
      }
      .action-div {
        @include wh(100%, 4rem);
        @include flex(center, space-between, row);
        padding: 0 0.5rem;
        margin-top: 0.2rem;
        .com-div {
          @include flex(center, center);
          @include wh(auto, auto);
          .svg-icon {
            @include wh(1.5rem, 1.5rem);
            margin-bottom: 0.3rem;
          }
          span {
            @include sc(0.6rem, #fff);
          }
        }
      }
    }
    .menu-list-div {
      @include wh(100%, 3rem);
      @include flex(center, space-between, row);
      padding: 0 0.5rem;
      .com-div {
        @include flex(center, center);
        .svg-icon {
          @include wh(1rem, 1rem);
        }
        .coffe-icon,
        .gift-icon,
        .more-icon {
          @include wh(1.3rem, 1.3rem);
        }
        span {
          @include sc(0.6rem, #858585);
          margin-top: 0.3rem;
        }
        .com-span {
          position: relative;
          top: -0.12rem;
        }
      }
    }
    .notify-info-div {
      @include wh(100%, auto);
      .article-slide-div {
        @include wh(100%, 4rem);
        padding: 0.4rem;
      }
      .notify-slide-div {
        @include wh(100%, auto);
        @include flex(center, flex-start, row);
        padding: 0.2rem 0.4rem;
        .icon-div {
          @include wh(1rem, 1rem);
          margin: 0 0.1rem;
          position: relative;
          top: -0.1rem;
        }
        .notify-slide {
          @include sc(0.6rem, $fc);
          @include wh(calc(100% - 1rem), 1rem);
          @include flex(center, center);
          #box {
            @include wh(100%, 1rem);
            overflow: hidden;
          }
          .anim {
            transition: all 0.5s;
            margin-top: -1rem;
          }
          #con1 li {
            list-style: none;
            @include wh(100%, 1rem);
            line-height: 1rem;
            @include flex(center, space-between, row);
            .inform-span {
              @include wh(calc(100% - 5rem), 100%);
              @include flowC;
              @include sc(0.6rem, $fc);
            }
            .date-span {
              @include wh(5rem, 100%);
              @include sc(0.5rem, $fc);
            }
          }
        }
      }
    }
    .fuli-info-div {
      @include wh(100%, auto);
      margin-top: 0.5rem;
      .title-div {
        @include wh(100%, auto);
        @include sc(0.7rem, $fc);
        font-weight: bold;
        padding: 0 0.4rem;
        margin-bottom: 0.5rem;
      }
      .item-div {
        @include wh(100%, 6rem);
        .com-column {
          @include wh(50%, 100%);
          @include flex(center, center, row);
          .svg-icon {
            @include wh(1.2rem, 1.2rem);
            margin-right: 0.4rem;
          }
          .title-span {
            @include sc(0.6rem, $fc);
            font-weight: bold;
            margin-bottom: 0.2rem;
          }
          .tip-span {
            @include sc(0.5rem, $fc);
          }
        }
        .fir-row {
          @include wh(100%, 50%);
          border-top: solid 0.05rem $lc;
          @include flex(center, center, row);
          .fir-column {
            border-right: solid 0.05rem $lc;
          }
        }
        .sec-row {
          @include wh(100%, 50%);
          border-top: solid 0.05rem $lc;
          border-bottom: solid 0.05rem $lc;
          @include flex(center, center, row);
          .fir-column {
            border-right: solid 0.05rem $lc;
          }
        }
      }
    }
    .recommend-pro-div {
      @include wh(100%, 14rem);
      background-color: $bc;
      padding: 0.4rem;
      .pro-div {
        @include wh(100%, 100%);
        background-color: #fff;
        border-radius: 0.2rem;
        .top-div {
          @include wh(100%, 45%);
          border-bottom: solid 0.05rem $lc;
          display: flex;
          .left-div {
            @include wh(50%, 100%);
            border-right: solid 0.05rem $lc;
            .title-div {
              @include wh(100%, 2rem);
              @include flex(flex-start, center);
              padding: 0.5rem 0rem 0rem 0.5rem;
              .title-span {
                @include sc(0.6rem, $fc);
                font-weight: bold;
                margin-bottom: 0.2rem;
              }
              .tip-span {
                @include sc(0.5rem, $fc);
              }
            }
            .product-div {
              @include wh(100%, calc(100% - 1.8rem));
              @include flex(center, space-around, row);
              img {
                @include wh(3rem, 3rem);
              }
            }
          }
          .right-div {
            @include wh(50%, 100%);
            .title-div {
              @include wh(100%, 2rem);
              @include flex(flex-start, center);
              padding: 0.5rem 0rem 0rem 0.5rem;
              .title-span {
                @include sc(0.6rem, $fc);
                font-weight: bold;
                margin-bottom: 0.2rem;
              }
              .tip-span {
                @include sc(0.5rem, $fc);
              }
            }
            .product-div {
              @include wh(100%, calc(100% - 1.8rem));
              @include flex(center, space-around, row);
              img {
                @include wh(3rem, 3rem);
              }
            }
          }
        }
        .bottom-div {
          @include wh(100%, 55%);
          .title-div {
            @include wh(100%, auto);
            padding: 0 0.2rem 0 0.5rem;
            margin-bottom: 0.5rem;
            margin-top: 0.5rem;
            @include flex(center, space-between, row);
            .title-span {
              @include sc(0.6rem, $fc);
              font-weight: bold;
            }
            .tip-span {
              @include sc(0.5rem, $fc);
            }
            .icon-div {
              @include flex(center, flex-end, row);
              .tip-span {
                @include sc(0.5rem, $fc);
              }
              .svg-icon {
                @include wh(1rem, 1rem);
              }
            }
          }
          .product-div {
            @include wh(100%, calc(100% - 1.8rem));
            @include flex(center, space-around, row);
            img {
              @include wh(4rem, 4rem);
            }
          }
        }
      }
    }
    .hot-info-div {
      @include wh(100%, auto);
      margin-bottom: 1rem;
      .title-div {
        @include wh(100%, auto);
        padding: 0 0.6rem;
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        @include flex(center, space-between, row);
        .title-span {
          @include sc(0.6rem, $fc);
          font-weight: bold;
        }
        .icon-div {
          @include flex(center, flex-end, row);
          .tip-span {
            @include sc(0.5rem, $fc);
          }
          .svg-icon {
            @include wh(1rem, 1rem);
          }
        }
      }
      .hot-div {
        @include wh(100%, 5.2rem);
        @include flex(flex-start, space-between, row);
        padding: 0 0.4rem;
        .product-div {
          @include wh(30%, 5rem);
          border: solid 0.05rem $lc;
          @include flex(center, space-between);
          padding: 0.2rem;
          img {
            @include wh(3rem, 3rem);
          }
          .title-span {
            @include sc(0.5rem, $fc);
            @include wh(100%, auto);
            @include flowC;
          }
          .money-span {
            @include sc(0.6rem, red);
          }
        }
        .product-extend-div {
          @include wh(30%, 100%);
        }
      }
      .hot-note-info {
        @include flex(center, center, row);
        span {
          @include sc(0.6rem, $fc);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.cube-slide {
  @include wh(100%, 100%);
  .cube-slide-group {
    @include wh(100%, 100%);
    .cube-slide-item {
      @include flex(center, center, row);
      @include wh(100%, 100%);
      img {
        @include wh(100%, 100%);
      }
    }
    .cube-slide-dots {
      span {
        @include wh(0.3rem, 0.1rem);
        margin-right: 0.2rem;
      }
    }
  }
}
</style>
