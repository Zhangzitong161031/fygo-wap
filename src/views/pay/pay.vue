<template>
  <div class="pay-container">
    <div class="content-div">
      <div class="top-div">
        <!-- 条形码 -->
        <svg id="barcode" @click="showBarCode"></svg>
        <!-- 二维码 -->
        <!-- <div id="qrcode" ref="qrcode"></div> -->
        <img :src="QRImage" @click="refreshQRECode" />
        <!-- 选择付款账户 -->
        <div class="select-div" @click="changeAccount">
          <div class="title-div">
            <svg-icon icon-class="fygo-pay" />
            <div class="title-content-div">
              <div class="title-span">{{ accountText }}</div>
              <div class="tip-span">优先使用此支付方式付款</div>
            </div>
          </div>
          <svg-icon icon-class="arrows-right" />
        </div>
      </div>
    </div>
    <!-- action div -->
    <div class="action-div">
      <div class="com-div">
        <svg-icon icon-class="pay-code-active" />
        <span class="active-span">付款码</span>
      </div>
      <div class="com-div" @click="scanCode">
        <svg-icon icon-class="scan-code" />
        <span>扫一扫</span>
      </div>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-jsapi'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcodejs2'
import { host } from '@/utils/env'
import { mapMutations } from 'vuex'
import { getQRCode } from '@/service/getData'
export default {
  data() {
    return {
      // 账户名称, 账户id
      accountText: '福利余额',
      active: 0,
      // 条形码内容
      barCode: '1234567890123',
      // 二维码内容
      qrCode: '此二维码纯为效果展示',
      // QRCode 图片
      QRImage: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.barcode()
    })
  },
  async created() {
    // 初始化购物车总数
    this.INIT_ORDER_CART()

    // 获取二维码
    await this.refreshQRECode()
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'INIT_ORDER_CART'
    ]),
    // 生成二维码
    qrcode() {
      new QRCode('qrcode', {
        width: 180,
        height: 180,
        text: this.qrCode,
        colorDark: '#000',
        colorLight: '#fff',
        correctLevel: QRCode.CorrectLevel.H
      })
    },

    // 获取二维码
    async refreshQRECode() {
      await getQRCode().then(res => {
        if (res.code === 0) {
          this.QRImage = res.data[0]
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 生成条形码
    barcode() {
      JsBarcode('#barcode', this.barCode, {
        format: 'itf14',
        width: 2.1,
        displayValue: true,
        text: this.barCode.substring(0, 4) + '****** ' + '查看数字',
        fontSize: 16
      })
    },

    // 显示条形码
    showBarCode() {
      this.$createDialog({
        type: 'alert',
        title: '条形码',
        content: this.barCode
      }).show()
    },

    // 选择付款账户
    changeAccount() {
      this.$createActionSheet({
        title: '选择优先支付方式',
        active: this.active,
        data: [
          {
            content: '福利余额'
          },
          {
            content: '微信零钱'
          },
          {
            content: '储蓄卡'
          }
        ],
        onSelect: (item, index) => {
          this.accountText = item.content
          this.active = index
        },
        onCancel: () => {}
      }).show()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-container {
  @include wh(100%, 100%);
  @include flex(center, space-between);
  padding: 1rem 0 0.5rem 0;
  background-color: $theme;
  .content-div {
    @include wh(calc(100% - 2rem), calc(100% - 2.5rem));
    background-color: #fff;
    border-radius: 0.4rem;
    @include flex(center, center);
    .top-div {
      @include wh(100%, 100%);
      @include flex(center, space-between);
      padding: 0.2rem 0 0 0;
      img {
        @include wh(8rem, 8rem);
      }
      .select-div {
        @include wh(calc(100% - 1rem), 2.5rem);
        border-top: solid 0.05rem $lc;
        @include flex(center, space-between, row);
        .title-div {
          @include flex(center, flex-start, row);
          @include wh(100%, 100%);
          .svg-icon {
            margin-right: 0.2rem;
          }
          .title-content-div {
            .title-span {
              @include sc(0.6rem, $fc);
              line-height: 1rem;
            }
            .tip-span {
              @include sc(0.45rem, $fc);
            }
          }
        }
      }
    }
  }
  .action-div {
    @include wh(100%, 2rem);
    @include flex(center, space-between, row);
    padding: 0 3rem;
    .com-div {
      @include wh(auto, 100%);
      @include flex(center, flex-start);
      .svg-icon {
        @include wh(1.8rem, 1.8rem);
        margin-bottom: 0.3rem;
      }
      span {
        @include sc(0.6rem, #e6e6e6);
        font-weight: bold;
      }
      .active-span {
        @include sc(0.6rem, #fff);
        font-weight: bold;
      }
    }
  }
}
</style>
<style>
.cube-action-sheet-space {
  height: 6px;
  background-color: rgba(37, 38, 45, 0.05);
}
</style>
