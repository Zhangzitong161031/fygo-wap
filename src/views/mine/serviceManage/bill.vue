<template>
  <div class="bill-container">
    <!-- bill-select -->
    <div class="header-box">
      <div class="bill-select-div">
        <sovell-date-select @refresh="refreshBillList"></sovell-date-select>
        <div class="total-bill-div">
          <div>支出: ￥{{ totalOut }}</div>
          <div>收入: ￥{{ totalIn }}</div>
        </div>
      </div>
      <div class="space-div"></div>
      <div class="bill-header-div">
        <div :class="[navActiveId === 11 ? 'active-div' : 'com-div']" @click="navChange(11)">支出</div>
        <div :class="[navActiveId === 12 ? 'active-div' : 'com-div']" @click="navChange(12)">收入</div>
      </div>
    </div>
    <!-- bill-info -->
    <div class="bill-parent-div" id="bill-parent-div">
      <div class="bill-scroll-div" id="bill-scroll-div">
        <ul>
          <li><loading v-if="isDownLoading"></loading></li>
          <li v-for="(item, index) in billList" :key="index" @click="gotoBillDetail(item.order_id)" class="bill-item-li">
            <div class="info-box">
              <div class="title-div">{{ item.goods_name }}</div>
              <div class="date-div">{{ item.pay_time }}</div>
            </div>
            <div class="money-box">{{ navActiveId === 11 ? `-${item.order_amount}` : `+${item.order_amount}` }}</div>
          </li>
          <li id="bill-extend-li"></li>
          <li><loading v-if="isUpLoading" class="up-loading"></loading></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import sovellDateSelect from '@/components/select/sovellDateSelect'
import loading from '@/components/loading/loading'
import { getBillList, getBillCount } from '@/service/getData'
import { addZero } from '@/utils/tools'
const date = new Date()
export default {
  components: {
    sovellDateSelect,
    loading
  },
  data() {
    return {
      // 支出
      totalOut: '5332.99',
      // 收入
      totalIn: '99999.99',
      // 账单列表
      billList: [],
      // 下一页
      nextPage: 1,
      // nav-active-id
      navActiveId: 11,
      // 当前时间戳
      cruDate: `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-01 00:00:00`,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      // 下拉刷新
      isDownLoading: false,
      // 上拉加载
      isUpLoading: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BetterScroll('.bill-parent-div', {
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
    await this.getBills()
    await this.getBillTotal()
  },
  methods: {
    // 获取账单列表
    async getBills(loading = true, page = 1, type = this.navActiveId, curTime = this.cruDate) {
      await getBillList(
        {
          type: type,
          page_no: page,
          page_size: 10,
          start_time: curTime,
          end_time: this.getNextMonth()
        },
        loading
      ).then(res => {
        if (res.code === 0) {
          this.billList = res.data.list ? [...res.data.list] : []
          this.nextPage = 2
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

    // 获取账单总金额
    async getBillTotal() {
      await getBillCount({
        start_time: this.cruDate,
        end_time: this.getNextMonth()
      }).then(res => {
        if (res.code === 0) {
          this.totalOut = res.data.sale
          this.totalIn = res.data.income
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 获取下月日期
    getNextMonth() {
      if (this.month === 12) {
        return `${this.year + 1}-01-01 00:00:00`
      }
      return `${this.year}-${addZero(this.month + 1)}-01 00:00:00`
    },

    // loading 判断
    checkLoading() {
      this.$nextTick(() => {
        this.scroll.refresh()
        let extend = document.getElementById('bill-extend-li')
        let eHeight = extend.offsetHeight
        if (eHeight) {
          extend.style.height = 0
        }
        let parent = document.getElementById('bill-parent-div')
        let scroll = document.getElementById('bill-scroll-div')
        let pHeight = parent.offsetHeight
        let sHeight = scroll.offsetHeight
        if (pHeight >= sHeight) {
          extend.style.height = pHeight - sHeight + 1 + 'px'
        }
      })
    },

    // 切换月份, 刷新列表
    async refreshBillList(selectedVal, val) {
      this.cruDate = selectedVal
      this.year = val[0]
      this.month = val[1]
      await this.getBills()
      await this.getBillTotal()
    },

    // nav bar 切换
    async navChange(id) {
      this.navActiveId = id
      await this.getBills()
    },

    // 下拉刷新
    async onPullingDown() {
      this.isDownLoading = true
      await this.getBills(false)
    },

    // 上拉加载
    async onPullingUp() {
      this.isUpLoading = true
      await getBillList(
        {
          type: this.navActiveId,
          page_no: this.nextPage,
          page_size: 10,
          start_time: this.cruDate,
          end_time: this.getNextMonth()
        },
        false
      ).then(res => {
        if (res.code === 0) {
          if (res.data.list) {
            this.billList = [...this.billList, ...res.data.list]
            this.nextPage = res.data.list.length ? parseInt(res.data.page) + 1 : parseInt(res.data.page)
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

    // 账单详情
    gotoBillDetail(id) {
      this.$router.push({
        path: '/mine/service/bill_detail',
        query: {
          orderId: id,
          type: this.navActiveId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bill-container {
  position: relative;
  @include wh(100%, 100%);
  .header-box {
    position: relative;
    z-index: 1;
    .bill-select-div {
      @include wh(100%, 2rem);
      background-color: #fff;
      @include flex(center, space-between, row);
      padding: 0 0.4rem;
      .total-bill-div {
        @include wh(auto, 100%);
        @include sc(0.6rem, $fc);
        padding: 0.3rem 0;
        @include flex(flex-start, space-between);
      }
    }
    .space-div {
      @include wh(100%, 0.2rem);
      background-color: $bc;
    }
    .bill-header-div {
      @include wh(100%, 2rem);
      @include flex(center, flex-start, row);
      background-color: #fff;
      .com-div {
        @include wh(50%, 100%);
        @include flex(center, center);
        border-bottom: solid 0.05rem $lc;
        @include sc(0.7rem, $fc);
      }
      .active-div {
        @include wh(50%, 100%);
        @include flex(center, center);
        @include sc(0.7rem, $theme);
        border-bottom: solid 0.05rem $theme;
      }
    }
  }
  .bill-parent-div {
    @include wh(100%, calc(100% - 4.2rem));
    background-color: #fff;
    .bill-scroll-div {
      @include wh(100%, auto);
      ul {
        background-color: #fff;
        .bill-item-li {
          @include wh(100%, 2.5rem);
          border-bottom: solid 0.05rem $lc;
          padding: 0 0.4rem;
          @include flex(center, space-between, row);
          .info-box {
            @include wh(75%, 100%);
            @include sc(0.6rem, $fc);
            @include flex(flex-start, center);
            .title-div {
              width: 100%;
              margin-bottom: 0.4rem;
              @include flowC;
              line-height: 0.8rem;
            }
            .date-div {
              @include sc(0.5rem, $fc);
            }
          }
          .money-box {
            @include sc(0.6rem, $fc);
          }
        }
      }
    }
  }
}
</style>
