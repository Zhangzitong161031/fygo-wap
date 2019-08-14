<template>
  <div class="artical-container">
    <div v-html="content" class="scroll-div"></div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { getArticalDetail } from '@/service/getData'
export default {
  data() {
    return {
      content: '',
      scroll: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BetterScroll('.artical-container', {
          click: true,
          probeType: 3
        })
        this.scroll.once('scroll', () => {
          this.refreshScroll()
        })
      }
    })
  },
  async created() {
    let id = this.$route.query.id
    await getArticalDetail({
      aid: id
    }).then(res => {
      if (res.code === 0) {
        this.content = res.data.content
      } else {
        this.$createToast({
          txt: res.msg,
          type: 'error',
          time: 800
        }).show()
      }
    })
  },
  methods: {
    refreshScroll() {
      this.scroll.refresh()
    }
  }
}
</script>

<style lang="scss">
.artical-container {
  @include wh(100%, 100%);
  background-color: #fff;
  .scroll-div {
    @include wh(100%, auto);
    background-color: #fff;
    @include sc(0.6rem, $fc);
    padding: 0.5rem;
    p {
      margin-top: 0rem !important;
      letter-spacing: 0.1rem;
      line-height: 1.6;
      text-align: justify;
    }
    span {
      line-height: 1.6;
      text-align: justify;
    }
  }
}
</style>
