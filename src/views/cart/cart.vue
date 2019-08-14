<template>
  <div class="cart-container">
    <!-- header -->
    <div v-if="cart.length" class="edit-div">
      <span>共{{ cartAmount }}件商品</span>
      <div :class="[checkList.length ? 'action-active-div' : 'action-div']" @click="deleSelected">删除</div>
    </div>
    <!-- cart list -->
    <div v-if="cart.length" class="product-content-div">
      <cube-checkbox-group v-model="checkList" @checked="productCkecked" @cancel-checked="productCancelCkecked">
        <cube-checkbox v-for="option in cart" :key="option.value" :option="option">
          <a href="javascript:;" @click.stop class="product-box">
            <cart-product :info="option" :isSelected="option.is_selected" @remove="removeFromCart" @refreshData="getCartList" @plus="amontPlus" @minus="amountMinus"></cart-product>
          </a>
        </cube-checkbox>
      </cube-checkbox-group>
    </div>
    <!-- footer -->
    <div v-if="cart.length" class="check-div">
      <cube-checkbox v-model="isAll" @input="isAllChanged" :disabled="isAllDisbaleed">全选</cube-checkbox>
      <div class="content-div">
        <div class="info-div">
          <div class="pay-box">
            <span class="title">合计: </span>
            <span class="money">¥{{ totalMoney }}</span>
          </div>
          <div class="total-box">
            <span class="total">总额: ¥{{ totalMoney }}</span>
            <span>优惠: ¥{{ reducedMoney }}</span>
          </div>
        </div>
        <div class="settle-div" @click="enterPayOrder">结算({{ totalAmount }})</div>
      </div>
    </div>
    <!-- NOTE -->
    <div v-if="!cart.length" class="empty-div">
      <svg-icon icon-class="empty" />
      <span>您还没有添加任何商品哦</span>
    </div>
  </div>
</template>

<script>
import cartProduct from '@/components/product/cart-product.vue'
import { BetterScroll } from 'cube-ui'
import { mapState, mapMutations } from 'vuex'
import { setCookie } from '@/utils/tools'
import { getCart, deleteCart, changeCartProStatus, getDefaultAdd } from '@/service/getData'
export default {
  components: {
    cartProduct
  },
  computed: {
    ...mapState({
      // 购物车商品总数
      cartAmount: 'cartAmount',
      addInfo: 'addInfo'
    })
  },
  data() {
    return {
      scroll: null,
      // 被勾选的 cube-checkbox 的 option.value 集合
      checkList: [],
      // 购物车列表
      cart: [],
      // 购物车中的有效商品列表
      onlineList: [],
      // 是否全选
      isAll: false,
      isAllDisbaleed: true,
      // 结算总数
      totalAmount: 0,
      // 结算总价
      totalMoney: 0.0,
      // 实付总额
      payMoney: '0.00',
      // 优惠额度
      reducedMoney: '0.00'
    }
  },
  async activated() {
    // 获取购物车列表
    await this.getCartList()

    // 获取收货地址信息
    if (!this.addInfo.id) {
      await this.getAddress()
    }

    // 刷新 better-scroll
    if (this.scroll) {
      this.scroll.refresh()
    }
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'SAVE_CART_COUNT',
      'CHANGE_ADDRESS'
    ]),

    // 获取收货地址信息
    async getAddress() {
      await getDefaultAdd().then(res => {
        if (res.code === 0) {
          if (res.data) this.CHANGE_ADDRESS(res.data)
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 获取购物车列表
    async getCartList() {
      await getCart().then(res => {
        if (res.code === 0) {
          this.cart = res.data.list ? res.data.list : []
          this.getCartAmount() // 计算购物车总数, 添加 checkbox 字段
          if (this.cart.length) {
            this.setProSelStatus() // 渲染购物车状态
            this.getCartPayData() // 计算结算数据
            if (!this.scroll) {
              this.$nextTick(() => {
                this.scroll = new BetterScroll('.product-content-div', {
                  click: true
                })
              })
            }
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

    // 计算购物车总数
    getCartAmount() {
      let cart = this.cart
      if (cart.length) {
        let cartAmount = 0
        cart.forEach(ele => {
          cartAmount += parseInt(ele.goods_number)
          ele.value = ele.rec_id // checkbox 字段
        })
        this.SAVE_CART_COUNT(cartAmount)
      } else {
        this.SAVE_CART_COUNT(0)
      }
    },

    // 设置商品选中状态
    setProSelStatus() {
      this.checkList = []
      this.onlineList = []
      this.cart.forEach(element => {
        if (element.is_on_sale === '1') {
          this.onlineList.push(element.rec_id)
          if (element.is_selected === '1') {
            this.checkList.push(element.rec_id)
          }
        } else {
          element.disabled = true
        }
      })
      if (this.onlineList.length === 0) {
        this.isAllDisbaleed = true
      } else if (this.onlineList.length && this.onlineList.length === this.checkList.length) {
        this.isAll = true
        this.isAllDisbaleed = false
      } else if (this.onlineList.length) {
        this.isAllDisbaleed = false
      }
    },

    // 计算结算数据
    getCartPayData() {
      let list = this.checkList
      let cart = this.cart
      if (list.length) {
        let totalAmount = 0
        let totalMoney = 0.0
        list.forEach(ele => {
          let index = cart.findIndex(item => {
            return item.rec_id === ele
          })
          if (index !== -1) {
            let product = cart[index]
            let num = parseInt(product.goods_number)
            let price = parseFloat(product.goods_price * 100000)
            totalAmount += num
            totalMoney += num * price
          }
        })
        this.totalAmount = totalAmount
        this.totalMoney = totalMoney / 100000
      } else {
        this.totalAmount = 0
        this.totalMoney = 0
      }
    },

    // 商品数量增加, 改变结算数据
    amontPlus(id) {
      let product = this.cart.filter(el => el.goods_id === id)[0]
      let num = parseInt(product.goods_number) + 1
      product.goods_number = `${num}`
      this.getCartPayData()
    },

    // 商品数量减少, 改变结算数据
    amountMinus(id) {
      let product = this.cart.filter(el => el.goods_id === id)[0]
      let num = parseInt(product.goods_number) - 1
      product.goods_number = `${num}`
      this.getCartPayData()
    },

    // 商品数量减少到 0 时, 移除商品
    removeFromCart(val) {
      this.cart = this.cart.filter(ele => {
        return ele.rec_id !== val
      })
      this.onlineList = this.onlineList.filter(ele => {
        return ele !== val
      })
      this.checkList = this.checkList.filter(ele => {
        return ele !== val
      })
      this.getCartPayData()
    },

    // 删除商品
    deleSelected() {
      if (this.checkList.length) {
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content: `您是否要移除已选中的商品?`,
          confirmBtn: {
            text: '确定',
            active: false
          },
          cancelBtn: {
            text: '取消',
            active: true
          },
          onConfirm: async () => {
            await deleteCart({
              cart_ids: this.checkList.join(',')
            }).then(res => {
              if (res.code === 0) {
                this.getCartList()
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
    },

    // 勾选
    async productCkecked(val) {
      await changeCartProStatus({
        type: 1,
        cart_ids: val
      }).then(res => {
        if (res.code === 0) {
          if (this.onlineList.length === this.checkList.length) {
            this.isAll = true
          }
          this.getCartPayData()
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 取消勾选
    async productCancelCkecked(val) {
      await changeCartProStatus({
        type: 2,
        cart_ids: val
      }).then(res => {
        if (res.code === 0) {
          this.isAll = false
          this.getCartPayData()
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 全选改变
    async isAllChanged(val) {
      if (val) {
        // 全选
        await changeCartProStatus({
          type: 1,
          cart_ids: this.onlineList.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.checkList = this.onlineList
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      } else {
        // 反选
        await changeCartProStatus({
          type: 2,
          cart_ids: this.checkList.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.checkList = []
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      }
      this.getCartPayData()
    },

    // 进入结算订单
    enterPayOrder() {
      // 应后台要求, 去掉此判断
      // if (this.addInfo.id) {
      if (this.totalAmount) {
        setCookie('createOrderFlag', false)
        this.$router.push({
          path: '/store/order',
          query: {
            cartIds: this.checkList.join(',')
          }
        })
      } else {
        this.$createToast({
          txt: '请选择结算商品',
          type: 'warn',
          time: 800
        }).show()
      }
      // } else {
      //   this.$createToast({
      //     txt: '请选择有效的收货地址',
      //     type: 'warn',
      //     time: 800
      //   }).show()
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-container {
  @include wh(100%, 100%);
  background-color: #fff;
  padding-top: 2rem;
  .edit-div {
    position: fixed;
    top: 0;
    padding: 0 0.5rem;
    @include wh(100%, 2rem);
    @include flex(center, space-between, row);
    span {
      @include sc(0.7rem, $fc);
    }
    .action-active-div {
      @include sc(0.7rem, $theme);
    }
    .action-div {
      @include sc(0.7rem, $fc);
    }
  }
  .product-content-div {
    @include wh(100%, calc(100% - 2rem));
    padding: 0 0.5rem;
    overflow: hidden;
    font-size: 0.8rem;
    .product-box {
      display: inline-block;
      @include wh(14.4rem, 100%);
      font-size: 1rem;
      // 配合 cube-checkbox 处理自定义点击事件
      position: relative;
      z-index: 1;
    }
  }
  .check-div {
    position: fixed;
    bottom: 1.95rem;
    padding: 0 0 0 0.5rem;
    background-color: $bc;
    @include wh(100%, 2rem);
    @include flex(center, flex-start, row);
    font-size: 0.8rem;
    .cube-checkbox {
      @include wh(3rem, 100%);
    }
    .content-div {
      @include wh(calc(100% - 3rem), 100%);
      @include flex(center, flex-start, row);
      .info-div {
        @include flex(flex-start, space-between);
        @include wh(calc(100% - 4rem), 100%);
        padding: 0.2rem 0;
        .pay-box {
          @include wh(100%, auto);
          @include flex(center, flex-start, row);
          flex-wrap: nowrap;
          .title {
            @include sc(0.6rem, $tc);
            font-weight: bold;
            margin-right: 0.2rem;
          }
          .money {
            @include sc(0.7rem, $theme);
            font-weight: bold;
          }
        }
        .total-box {
          @include wh(100%, auto);
          @include sc(0.6rem, $fc);
          .total {
            margin-right: 0.2rem;
          }
        }
      }
      .settle-div {
        @include wh(4rem, 100%);
        background-color: $theme;
        @include sc(0.7rem, #fff);
        font-weight: bold;
        @include flex(center, center, row);
      }
    }
  }
  .empty-div {
    @include wh(100%, 100%);
    @include flex(center, center);
    position: relative;
    top: -2rem;
    .svg-icon {
      @include wh(2.5rem, 2.5rem);
    }
    span {
      margin-top: 0.2rem;
      @include sc(0.6rem, $fc);
    }
  }
}
</style>
