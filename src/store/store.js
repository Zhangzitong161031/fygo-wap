import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  // 结算总数
  totalAmount: 0,
  // 结算总金额
  totalPrice: 0.0,
  // 购物车商品总数, 包含失效商品
  cartAmount: 0,
  // 购物车
  cart: [],
  // 结算购物车
  orderCart: [],
  // 收货地址
  addInfo: {},
  // 搜索关键字
  searchKey: '',
  searchKeys: [],
  // 订单列表 active_id
  orLtActiveId: 0,
  // 最近使用福利项目记录
  walfares: []
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
