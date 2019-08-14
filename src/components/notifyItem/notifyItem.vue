<template>
  <div class="notify-item-container">
    <div class="title-div" @click="showDetail">
      <span class="name-span">{{ info.title }}</span>
      <svg-icon :icon-class="close ? 'arrows-down' : 'arrows-up'"></svg-icon>
    </div>
    <div class="tip-div" v-if="close">
      <span class="tip-span">{{ info.content }}</span>
      <span class="time-span">{{ getTime(info.add_time) }}</span>
    </div>
    <div class="send-notify-div" v-if="!close && info.type === '1'">
      <span>您的福利已发货:</span>
      <span>订单号码: {{ info.order_sn }}</span>
      <span>配送公司: {{ info.shipping_name }}</span>
      <span>运单号码: {{ info.order_no }}</span>
      <span>发货时间: {{ info.shipping_time }}</span>
    </div>
    <div class="deliver-notify-div" v-if="!close && info.type === '2'">
      <span>您的福利已投递:</span>
      <span>
        取件码:
        <span class="key-span">
          {{ info.pickup_code }}
        </span>
      </span>
      <span>订单号码: {{ info.order_sn }}</span>
      <span>配送公司: {{ info.shipping_name }}</span>
      <span>运单号码: {{ info.order_no }}</span>
      <span>快递员手机: {{ info.courier_phone }}</span>
      <span>
        取件地址:
        <span class="key-span">
          {{ info.pickup_address }}
        </span>
      </span>
      <span>投递时间: {{ getTime(info.receive_time) }}</span>
    </div>
  </div>
</template>

<script>
import { readNotify } from '@/service/getData'
import { formateTimestamp } from '@/utils/tools'
export default {
  // eslint-disable-next-line
  props: [
    'info'
  ],
  data() {
    return {
      close: true,
      isRead: false
    }
  },
  created() {
    this.isRead = this.info.is_read
  },
  methods: {
    // 显示消息详情
    async showDetail() {
      if (this.isRead !== '1') {
        await readNotify({
          mail_id: this.info.id
        }).then(res => {
          if (res) {
            this.isRead = true
          }
        })
      }
      this.close = !this.close
    },

    // 获取时间
    getTime(date) {
      if (date) {
        return formateTimestamp(parseInt(date) * 1000)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notify-item-container {
  background-color: #fff;
  border-radius: 0.2rem;
  padding: 0.4rem;
  span {
    @include sc(0.6rem, $fc);
  }
  .title-div {
    @include flex(center, space-between, row);
    margin-bottom: 0.2rem;
    .name-span {
      font-weight: bold;
    }
    .svg-icon {
      @include wh(1rem, 1rem);
    }
  }
  .tip-div {
    @include flex(center, space-between, row);
    .tip-span {
      width: calc(100% - 6rem);
      @include flowC;
    }
    .time-span {
      display: inline-block;
      width: 6rem;
    }
  }
  .send-notify-div,
  .deliver-notify-div {
    @include flex(flex-start, flex-start);
    span {
      margin-bottom: 0.25rem;
    }
    .key-span {
      @include sc(0.6rem, $theme);
    }
  }
}
</style>
