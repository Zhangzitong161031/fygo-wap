<template>
  <div class="express-container">
    <!-- nav bar -->
    <nav-bar :navList="navList" @changeNav="navChange" v-if="navList.length > 1"></nav-bar>
    <div :class="[navList.length > 1 ? 'express-scroll-container1' : 'express-scroll-container2', 'express-scroll-container']">
      <div class="express-scroll-div">
        <!-- 订单信息 -->
        <div class="order-info-div">
          <div class="image-container-div">
            <div ref="picscroll" class="image-scroll-div">
              <div v-for="(pic, index) in expressInfo.goods_thumb" :key="index" class="img-div">
                <img v-lazy="pic" :key="pic" />
              </div>
            </div>
          </div>
          <div class="info-div">
            <div class="com-div com-div1">运单号码: {{ expressInfo.logistics_number }}</div>
            <div class="com-div">承运公司: {{ expressInfo.express_company }}</div>
          </div>
          <div class="status-div">
            <span>物流状态: </span>
            <span class="status-span">{{ expressInfo.shipping_state }}</span>
          </div>
        </div>
        <!-- 物流信息 -->
        <div class="express-div" v-if="logistics.length">
          <div class="title-div">物流跟踪</div>
          <ul>
            <li v-for="(express, index) in logistics" :key="express.operateState">
              <div class="express-box">
                <div class="message-span">{{ express.operateState }}</div>
                <div class="date-span">{{ express.operateTime }}</div>
                <svg-icon :icon-class="getExpressIcon(index)" />
              </div>
              <div class="space-div"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar/expressBar'
import { BetterScroll } from 'cube-ui'
import { getShipingInfo } from '@/service/getData'
import { reqDomain } from '@/utils/env'
export default {
  components: {
    navBar
  },
  data() {
    return {
      orderId: null,
      shippingInfos: [],
      expressInfo: {},
      logistics: [],
      expressPhone: '',
      navList: [],
      scroll: null,
      imgeScroll: null,
      activeId: 0
    }
  },
  computed: {
    pic() {
      if (this.expressInfo.goods_thumb) {
        let reg = new RegExp('^http')
        if (!reg.test(this.expressInfo.goods_thumb[0])) {
          return reqDomain + this.expressInfo.goods_thumb[0]
        } else {
          return this.expressInfo.goods_thumb[0]
        }
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BetterScroll('.express-scroll-container', {
          click: true
        })
      }
    })
  },
  async created() {
    this.orderId = this.$route.query.orderId
    await this.getExpressInfo()
  },
  methods: {
    // 获取物流信息
    async getExpressInfo() {
      await getShipingInfo({
        order_id: this.orderId
      }).then(res => {
        if (res.code === 0) {
          this.shippingInfos = res.data.shipping_info

          this.expressInfo = this.shippingInfos[0]
          this.logistics = this.expressInfo.logistics

          this.shippingInfos.forEach((item, index) => {
            this.navList.push({
              id: index,
              name: '包裹' + ' ' + ++index
            })
          })

          this.$nextTick(() => {
            this.replaceExpressMobile()

            let len = this.expressInfo.goods_thumb.length
            let totalLen = len * 3.2 + 0.2
            this.$refs.picscroll.style.width = totalLen + 'rem'

            if (!this.imgeScroll) {
              this.imgeScroll = new BetterScroll('.image-container-div', {
                click: true,
                scrollX: true,
                scrollY: false,
                eventPassthrough: 'vertical'
              })
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

    // nav bar 切换
    navChange(id) {
      if (id !== this.activeId) {
        this.activeId = id
        this.expressInfo = {}
        this.expressInfo = this.shippingInfos[id]
        this.logistics = this.expressInfo.logistics

        this.$nextTick(() => {
          this.scroll.refresh()
          this.scroll.scrollTo(0, 0, 100)
          this.replaceExpressMobile()

          this.imgeScroll.refresh()
          let len = this.expressInfo.goods_thumb.length
          let totalLen = len * 3.2 + 0.2
          this.$refs.picscroll.style.width = totalLen + 'rem'
        })
      }
    },

    // 获取物流地址 icon
    getExpressIcon(index) {
      let icon = ''
      if (index === this.expressInfo.logistics.length - 1) {
        if (this.expressInfo.logistics.length === 1) {
          icon = 'send-active'
        } else {
          icon = 'send-disable'
        }
      } else if (index === 0) {
        if (this.expressInfo.shipping_state === '已签收') {
          icon = 'complete-active'
        } else {
          icon = 'deliver-active'
        }
      } else {
        icon = 'point-disable'
      }
      return icon
    },

    // 获取时间
    getTime(date) {
      return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)} ${date.substring(8, 10)}:${date.substring(10, 12)}:${date.substring(12, 14)}`
    },

    // 处理地址中的电话号码
    replaceExpressMobile() {
      const telReg = new RegExp('[0-9]{5,11}')
      var node = document.getElementsByClassName('message-span')
      for (let index = 0; index < node.length; index++) {
        let ele = node[index]
        if (telReg.test(ele.innerHTML)) {
          let context = ele.innerHTML
          let phone = context.match(telReg)[0]
          ele.innerHTML = context.replace(telReg, `<a href="tel:${phone}" style="color: #00aeff;">${phone}</a>`)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.express-container {
  @include wh(100%, 100%);
  .express-scroll-container1 {
    @include wh(100%, calc(100% - 2rem));
    position: relative;
    top: 2rem;
    margin-top: 0.4rem;
  }
  .express-scroll-container2 {
    @include wh(100%, 100%);
  }
  .express-scroll-div {
    background-color: $bc;
    @include wh(100%, auto);
    .order-info-div {
      @include wh(100%, auto);
      background-color: #fff;
      margin-bottom: 0.4rem;
      padding-top: 0.4rem;
      .image-container-div {
        @include wh(100%, auto);
      }
      .image-scroll-div {
        margin-bottom: 0.4rem;
        @include flex(center, flex-start, row);
        .img-div {
          @include wh(3rem, 3rem);
          border-radius: 3rem;
          margin-left: 0.2rem;
          background-color: $bc;
          @include flex(center, center);
          img {
            @include wh(2rem, 2rem);
          }
        }
      }
      .info-div {
        padding: 0 0.2rem 0 0.2rem;
        @include flex(center, flex-start, row);
        @include sc(0.6rem, $fc);
        .com-div {
          margin-bottom: 0.4rem;
        }
        .com-div1 {
          margin-right: 1rem;
        }
      }
      .status-div {
        padding-left: 0.2rem;
        @include sc(0.6rem, $fc);
        padding-bottom: 0.4rem;
        .status-span {
          @include sc(0.6rem, $theme);
        }
      }
    }
    .express-div {
      background-color: #fff;
      .title-div {
        @include sc(0.7rem, $fc);
        @include wh(100%, 1.5rem);
        line-height: 1.5rem;
        border-bottom: solid 0.05rem $lc;
        margin-bottom: 0.4rem;
        padding-left: 0.5rem;
      }
      ul {
        padding: 0.2rem 0.2rem 0.2rem 1rem;
      }
      .express-box {
        @include flex(flex-start, space-between);
        padding-left: 0.6rem;
        border-left: solid 0.05rem $bc;
        position: relative;
        .message-span {
          @include sc(0.6rem, $fc);
          margin-bottom: 0.4rem;
          line-height: 0.8rem;
        }
        .date-span {
          @include sc(0.6rem, $fc);
        }
        .svg-icon {
          @include wh(1rem, 1rem);
          position: absolute;
          top: -0.2rem;
          left: -0.53rem;
        }
      }
      .space-div {
        @include wh(1rem, 1rem);
        background-color: #fff;
        border-left: solid 0.05rem $bc;
      }
    }
  }
  a {
    color: $telc;
  }
}
</style>
