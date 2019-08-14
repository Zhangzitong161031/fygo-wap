<template>
  <div class="welfare-container">
    <div class="record-div" v-if="walfares.length">
      <div class="title-div" ref="titleitem">最近使用</div>
      <div class="menu-div" ref="liveitem">
        <div class="item" v-for="item in walfares.slice(0, 4)" :key="item.name" @click="tapItem(item)">
          <svg-icon :icon-class="item.icon" />
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="space-div"></div>
    </div>

    <nav-bar :navList="navList" :id="id" @changeNav="navChange"></nav-bar>

    <div class="walfare-wrap" ref="walfarewrap">
      <div class="walfare-scroll-div">
        <div class="menu-div" ref="eatitem">
          <div class="item" v-for="item in navList[0].sub" :key="item.name" @click="tapItem(item)">
            <svg-icon :icon-class="item.icon" />
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="title-div" ref="titleitem">住</div>
        <div class="menu-div" ref="liveitem">
          <div class="item" v-for="item in navList[1].sub" :key="item.name" @click="tapItem(item)">
            <svg-icon :icon-class="item.icon" />
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="title-div">行</div>
        <div class="menu-div" ref="travelitem">
          <div class="item" v-for="item in navList[2].sub" :key="item.name" @click="tapItem(item)">
            <svg-icon :icon-class="item.icon" />
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="title-div">生活</div>
        <div class="menu-div" ref="lifeitem">
          <div class="item" v-for="item in navList[3].sub" :key="item.name" @click="tapItem(item)">
            <svg-icon :icon-class="item.icon" />
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div class="title-div">商务</div>
        <div class="menu-div" ref="businessitem">
          <div class="item" v-for="item in navList[4].sub" :key="item.name" @click="tapItem(item)">
            <svg-icon :icon-class="item.icon" />
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div id="extend"></div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar/welfareBar'
import { BetterScroll } from 'cube-ui'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    navBar
  },
  data() {
    return {
      navList: [
        {
          name: '吃',
          id: 1,
          sub: [
            {
              name: '福利商城',
              icon: 'walfare-store'
            },
            {
              name: '在线订餐',
              icon: 'walfare-order'
            },
            {
              name: '生鲜净菜',
              icon: 'fresh'
            },
            {
              name: '咖啡饮品',
              icon: 'coffe'
            }
          ]
        },
        {
          name: '住',
          id: 2,
          sub: [
            {
              name: '特惠酒店',
              icon: 'walfare-hotel'
            },
            {
              name: '公寓民宿',
              icon: 'walfare-home'
            }
          ]
        },
        {
          name: '行',
          id: 3,
          sub: [
            {
              name: '企业用车',
              icon: 'walfare-didi'
            },
            {
              name: '火车定票',
              icon: 'walfare-train'
            },
            {
              name: '飞机定票',
              icon: 'walfare-plan'
            }
          ]
        },
        {
          name: '生活',
          id: 4,
          sub: [
            {
              name: '充值缴费',
              icon: 'walfare-recharge'
            },
            {
              name: '健康体检',
              icon: 'medical'
            },
            {
              name: '洗理服务',
              icon: 'walfare-wash'
            },
            {
              name: '驾校培训',
              icon: 'walfare-drive'
            },
            {
              name: '生日礼物',
              icon: 'walfare-birthday'
            },
            {
              name: '节日特供',
              icon: 'walfare-festival'
            },
            {
              name: '本地特色',
              icon: 'walfare-specialty'
            }
          ]
        },
        {
          name: '商务',
          id: 5,
          sub: [
            {
              name: '商务礼品',
              icon: 'gift'
            },
            {
              name: '停车预约',
              icon: 'walfare-stop'
            },
            {
              name: '访客登记',
              icon: 'walfare-visitor'
            },
            {
              name: '包车服务',
              icon: 'walfare-chart'
            },
            {
              name: '芝麻开门',
              icon: 'walfare-sesame'
            },
            {
              name: '企业内购',
              icon: 'walfare-gorup'
            }
          ]
        }
      ],
      scroll: null,
      id: 1,
      flag: false
    }
  },
  computed: {
    ...mapState({
      walfares: 'walfares'
    })
  },
  created() {
    this.GET_WALFARE_RECORD()
  },
  mounted() {
    if (!this.scroll) {
      this.$nextTick(() => {
        this.scroll = new BetterScroll('.walfare-wrap', {
          click: true,
          // 实时的派发 scroll 事件, 知道滚动的位置
          probeType: 3
        })
        this.scroll.on('scroll', pos => {
          this.onScroll(pos)
        })

        // 如果是手动切换 navBar, 不监听滚动事件
        this.scroll.on('scrollEnd', () => {
          this.flag = false
        })

        this.w = this.$refs.titleitem.offsetHeight
        this.w1 = this.$refs.eatitem.offsetHeight
        this.w2 = this.$refs.liveitem.offsetHeight
        this.w3 = this.$refs.travelitem.offsetHeight
        this.w4 = this.$refs.lifeitem.offsetHeight
        this.w5 = this.$refs.businessitem.offsetHeight
        let wrapH = this.$refs.walfarewrap.offsetHeight
        document.getElementById('extend').style.height = wrapH - this.w5 - this.w + 'px'
      })
    }
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'SAVE_WALFARE_RECORD',
      'GET_WALFARE_RECORD'
    ]),

    // 监听 navBar 事件, 滚动 scroll
    navChange(id) {
      this.flag = true
      if (id === 1) {
        this.scroll.scrollTo(0, 0, 100)
      } else if (id === 2) {
        let w = this.w1 - 1
        this.scroll.scrollTo(0, -w, 100)
      } else if (id === 3) {
        let w = this.w1 + this.w + this.w2 - 1
        this.scroll.scrollTo(0, -w, 100)
      } else if (id === 4) {
        let w = this.w1 + this.w + this.w2 + this.w + this.w3 - 1
        this.scroll.scrollTo(0, -w, 100)
      } else if (id === 5) {
        let w = this.w1 + this.w + this.w2 + this.w + this.w3 + this.w + this.w4 - 1
        this.scroll.scrollTo(0, -w, 100)
      }
    },

    // 监听滚动事件, 切换navBar
    onScroll(pos) {
      // 如果是手动切换 navBar, 不监听滚动事件
      if (!this.flag) {
        let y = -pos.y
        if (y < this.w1 - 1) {
          this.id = 1
        } else if (y >= this.w1 - 1 && y < this.w1 + this.w2 + this.w - 1) {
          this.id = 2
        } else if (y >= this.w1 + this.w + this.w2 - 1 && y < this.w1 + this.w2 + this.w3 + this.w * 2 - 1) {
          this.id = 3
        } else if (y >= this.w1 + this.w2 + this.w3 + this.w * 2 - 1 && y < this.w1 + this.w2 + this.w3 + this.w4 + this.w * 3 - 1) {
          this.id = 4
        } else if (y >= this.w1 + this.w2 + this.w3 + this.w4 + this.w * 3 - 1 && y < this.w1 + this.w2 + this.w3 + this.w4 + this.w4 + this.w * 4 - 1) {
          this.id = 5
        }
      }
    },

    // 跳转
    tapItem(item) {
      this.SAVE_WALFARE_RECORD(item)
      this.$createToast({
        txt: item.name,
        type: 'warn',
        time: 800
      }).show()
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.welfare-container {
  @include wh(100%, 100%);
  background-color: #fff;
  .record-div {
    position: relative;
    z-index: 1;
    .space-div {
      @include wh(100%, 0.5rem);
      background-color: $bc;
    }
  }
  .walfare-wrap {
    position: relative;
    top: 2rem;
    @include wh(100%, calc(100% - 2rem));
    .walfare-scroll-div {
      @include wh(100%, auto);
    }
  }
  .menu-div {
    @include flex(center, flex-start, row);
    @include wh(100%, auto);
    padding-bottom: 1rem;
    background-color: #fff;
    flex-wrap: wrap;
    .item {
      @include flex(center, space-between);
      margin-left: 1.25rem;
      margin-top: 1rem;
      span {
        @include sc(0.6rem, $fc);
        margin-top: 0.2rem;
      }
    }
  }
  .title-div {
    @include wh(100%, 1.5rem);
    @include sc(0.7rem, $fc);
    @include flex(flex-start, center);
    background-color: #fff;
    padding-left: 1rem;
    font-weight: bold;
  }
}
</style>
