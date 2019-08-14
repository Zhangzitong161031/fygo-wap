<template>
  <div class="mine-container">
    <div class="mine-scroll-div">
      <!-- 个人信息 -->
      <div class="user-info-div">
        <img v-lazy="pic" alt="user" v-if="userInfo.user_picture" />
        <img src="@/assets/user-icon.png" alt="user" v-else />
        <div class="info-div">
          <div class="user-div">
            <span class="name-span">{{ userInfo.user_name }}</span>
            <div class="company-div">{{ userInfo.company_name }}</div>
            <span @click="editUserInfo"><svg-icon icon-class="user-setting"/></span>
          </div>
          <div class="job-number-span">
            <div class="title-span">工号</div>
            <div class="num-span">{{ userInfo.job_number }}</div>
          </div>
        </div>
      </div>
      <!-- 我的福利 -->
      <div class="user-fuli-div">
        <div class="title-div">
          <span class="title-span">我的福利</span>
          <span @click="fuliManage">
            <span class="tip-span">福利管理</span>
            <svg-icon icon-class="arrows-right" />
          </span>
        </div>
        <div class="content-div">
          <div class="com-div">
            <span class="info-span">{{ fuliInfo.balance }}</span>
            <span>总余额</span>
          </div>
          <div class="com-div">
            <span class="info-span">{{ fuliInfo.online }}</span>
            <span>线上可用</span>
          </div>
          <div class="com-div">
            <span class="info-span">{{ fuliInfo.coupons }}</span>
            <span>优惠券</span>
          </div>
          <div class="com-div">
            <span class="info-span">{{ fuliInfo.excoupons }}</span>
            <span>体验券</span>
          </div>
        </div>
      </div>
      <!-- 我的订单 -->
      <div class="user-order-div">
        <div class="title-div">
          <span class="title-span">我的订单</span>
          <span @click="orderManage(0)">
            <span class="tip-span">订单管理</span>
            <svg-icon icon-class="arrows-right" />
          </span>
        </div>
        <div class="content-div">
          <div @click="orderManage(1)" class="com-div">
            <span><svg-icon icon-class="user-wait-pay"/></span>
            <span>待付款</span>
            <div class="badge-div" v-if="userInfo.wait_pay_num !== '0'">{{ userInfo.wait_pay_num }}</div>
          </div>
          <div @click="orderManage(2)" class="com-div">
            <span><svg-icon icon-class="user-wait-send"/></span>
            <span>待发货</span>
            <div class="badge-div" v-if="userInfo.wait_shipping_num !== '0'">{{ userInfo.wait_shipping_num }}</div>
          </div>
          <div @click="orderManage(3)" class="com-div">
            <span><svg-icon icon-class="user-wait-accept"/></span>
            <span>待收货</span>
            <div class="badge-div" v-if="userInfo.wait_delivery !== '0'">{{ userInfo.wait_delivery }}</div>
          </div>
          <div @click="orderManage(4)" class="com-div">
            <span><svg-icon icon-class="user-yet-done"/></span>
            <span>已完成</span>
          </div>
        </div>
      </div>
      <!-- 我的服务 -->
      <div class="user-service-div">
        <div class="title-div">
          <span class="title-span">我的服务</span>
          <span @click="serviceManage" hidden>
            <span class="tip-span">服务管理</span>
            <svg-icon icon-class="arrows-right" />
          </span>
        </div>
        <div class="content-div">
          <div @click="gotoNotify" class="com-div notify-div">
            <span><svg-icon icon-class="user-notify"/></span>
            <span>通知</span>
            <svg-icon icon-class="point-red" class="point-svg" v-if="hasNotifys" />
          </div>
          <div @click="gotoBill" class="com-div">
            <span><svg-icon icon-class="user-bill"/></span>
            <span>账单明细</span>
          </div>
          <div @click="gotoAddress" class="com-div">
            <span><svg-icon icon-class="user-address"/></span>
            <span>收货地址</span>
          </div>
          <div @click="callService" class="com-div">
            <span><svg-icon icon-class="user-phone"/></span>
            <span>联系客服</span>
          </div>
        </div>
        <div class="content-div column-2-div">
          <div @click="gotoFavoroite" class="com-div">
            <span><svg-icon icon-class="user-favorite"/></span>
            <span>收藏</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { BetterScroll } from 'cube-ui'
import { getUserInfo } from '@/service/getData'
import { reqDomain } from '@/utils/env'
export default {
  data() {
    return {
      userInfo: {
        cart_num: '0',
        wait_pay_num: '0',
        wait_shipping_num: '0',
        wait_delivery: '0'
      },
      fuliInfo: {
        balance: '0',
        online: '0',
        coupons: '0',
        excoupons: '0'
      },
      hasNotifys: false,
      scroll: null
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
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BetterScroll('.mine-container', {
          click: true
        })
      }
    })
  },
  async activated() {
    await getUserInfo().then(res => {
      if (res.code === 0) {
        this.userInfo = res.data
        this.fuliInfo.balance = res.data.user_money
        this.fuliInfo.online = res.data.online_balance
        if (res.data.mail_num !== '0') {
          this.hasNotifys = true
        } else {
          this.hasNotifys = false
        }
      } else {
        this.$createToast({
          txt: res.msg,
          type: 'error',
          time: 800
        }).show()
      }
    })

    // 初始化购物车数据
    this.INIT_ORDER_CART()

    // 刷新 better-scroll
    if (this.scroll) {
      this.scroll.refresh()
    }
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'CHANGE_ORDER_LIST_ID',
      'INIT_ORDER_CART'
    ]),

    // 编辑员工信息
    editUserInfo() {
      this.$router.push({
        path: '/mine/user_info'
      })
    },

    // 福利管理
    fuliManage() {
      this.$router.push({
        path: '/mine/fuli_manage'
      })
    },

    // 订单管理
    orderManage(type) {
      this.CHANGE_ORDER_LIST_ID(type)
      this.$router.push({
        path: '/mine/order_manage'
      })
    },

    // 服务管理
    serviceManage() {
      this.$router.push({
        path: '/mine/service_manage'
      })
    },

    // 通知中心
    gotoNotify() {
      this.$router.push({
        path: '/mine/service/notify'
      })
    },

    // 账单明细
    gotoBill() {
      this.$router.push({
        path: '/mine/service/bill'
      })
    },

    // 收货地址
    gotoAddress() {
      this.$router.push({
        path: '/mine/service/address'
      })
    },
    // 联系客服
    callService() {
      this.$nextTick(() => {
        this.$createActionSheet({
          title: '呼叫',
          data: [
            {
              content: '<a href="tel:18857125118">+86-18857125118</a>',
              class: 'call-service'
            }
          ]
        }).show()
      })
    },

    // 收藏
    gotoFavoroite() {
      this.$router.push({
        path: '/mine/service/favorite'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mine-container {
  @include wh(100%, 100%);
  .mine-scroll-div {
    padding: 0.4rem;
    background-color: $bc;
    .user-info-div {
      @include wh(100%, 4rem);
      background-color: $userbc;
      border-radius: 0.4rem;
      @include flex(center, flex-start, row);
      padding-left: 1rem;
      img {
        @include wh(2.5rem, 2.5rem);
        border-radius: 2.5rem;
      }
      .info-div {
        @include wh(calc(100% - 2.5rem), 2.5rem);
        @include flex(flex-start, space-between);
        padding: 0.2rem 0 0.2rem 0.2rem;
        .user-div {
          @include flex(center, flex-start, row);
          @include wh(100%, auto);
          .name-span {
            margin-right: 0.4rem;
            @include sc(0.6rem, $fc);
            font-weight: bold;
            max-width: 3rem;
            @include flowC;
            line-height: 1rem;
          }
          .company-div {
            @include sc(0.6rem, $fc);
            max-width: 6rem;
            @include flowC;
          }
          .svg-icon {
            @include wh(1rem, 1rem);
            position: relative;
            top: -0.08rem;
            margin-left: 0.4rem;
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
    .user-fuli-div {
      @include wh(100%, 5rem);
      background-color: #fff;
      border-radius: 0.4rem;
      margin-top: 0.5rem;
      padding: 0 0.4rem;
      .title-div {
        @include flex(center, space-between, row);
        border-bottom: solid 0.05rem $lc;
        @include wh(100%, 2rem);
        .title-span {
          @include sc(0.7rem, $fc);
          font-weight: bold;
        }
        .tip-span {
          @include sc(0.6rem, $fc);
        }
        .svg-icon {
          @include wh(1rem, 1rem);
          position: relative;
          top: 0.15rem;
        }
      }
      .content-div {
        @include wh(100%, 3rem);
        @include flex(center, space-between, row);
        .com-div {
          @include wh(3rem, 100%);
          @include flex(center, center);
          span {
            @include sc(0.6rem, $fc);
          }
          .info-span {
            @include sc(0.7rem, $userbc);
            font-weight: bold;
            margin-bottom: 0.3rem;
          }
        }
      }
    }
    .user-order-div {
      @include wh(100%, 5rem);
      background-color: #fff;
      border-radius: 0.4rem;
      margin-top: 0.5rem;
      padding: 0 0.4rem;
      .title-div {
        @include flex(center, space-between, row);
        border-bottom: solid 0.05rem $lc;
        @include wh(100%, 2rem);
        .title-span {
          @include sc(0.7rem, $fc);
          font-weight: bold;
        }
        .tip-span {
          @include sc(0.6rem, $fc);
        }
        .svg-icon {
          @include wh(1rem, 1rem);
          position: relative;
          top: 0.15rem;
        }
      }
      .content-div {
        @include wh(100%, 3rem);
        @include flex(center, space-between, row);
        .com-div {
          @include wh(3rem, 100%);
          @include flex(center, center);
          position: relative;
          span {
            @include sc(0.6rem, $fc);
          }
          .svg-icon {
            @include wh(1.2rem, 1.2rem);
            margin-bottom: 0.3rem;
          }
          .badge-div {
            position: absolute;
            top: 0.3rem;
            right: 0.5rem;
            @include sc(0.4rem, #fff);
            @include wh(auto, 0.6rem);
            min-width: 0.6rem;
            border-radius: 0.6rem;
            background-color: $theme;
            @include flex(center, center, row);
            padding: 0.08rem;
          }
        }
      }
    }
    .user-service-div {
      @include wh(100%, 8rem);
      background-color: #fff;
      border-radius: 0.4rem;
      margin-top: 0.5rem;
      padding: 0 0.4rem;
      .title-div {
        @include flex(center, space-between, row);
        border-bottom: solid 0.05rem $lc;
        @include wh(100%, 2rem);
        .title-span {
          @include sc(0.7rem, $fc);
          font-weight: bold;
        }
        .tip-span {
          @include sc(0.6rem, $fc);
        }
        .svg-icon {
          @include wh(1rem, 1rem);
          position: relative;
          top: 0.15rem;
        }
      }
      .content-div {
        @include wh(100%, 3rem);
        @include flex(center, space-between, row);
        .com-div {
          @include wh(3rem, 100%);
          @include flex(center, center);
          span {
            @include sc(0.6rem, $fc);
          }
          .svg-icon {
            @include wh(1.2rem, 1.2rem);
            margin-bottom: 0.3rem;
          }
        }
      }
      .column-2-div {
        @include flex(center, flex-start, row);
      }
      .notify-div {
        position: relative;
        .point-svg {
          position: absolute;
          top: 0;
          right: 0.2rem;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.call-service {
  a {
    display: inline-block;
    @include wh(100%, 100%);
  }
}
</style>
