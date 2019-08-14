// eslint-disable-next-line
import {
  UPDATE_SEARCH_KEY,
  SAVE_SEARCH_KEYS,
  GET_SEARCH_KEYS,
  CHANGE_ORDER_LIST_ID,
  SAVE_CART_COUNT,
  UPDATE_CART_COUNT,
  CHANGE_ADDRESS,
  SAVE_ORDER_CART,
  INIT_ORDER_CART,
  SAVE_WALFARE_RECORD,
  GET_WALFARE_RECORD
} from './mutation-types.js'

import { setStore, getStore } from '@/utils/tools'

export default {
  // 保存购物车数量
  [SAVE_CART_COUNT](state, val) {
    state.cartAmount = val
    setStore('cartAmount', state.cartAmount)
  },

  // plus, minus
  [UPDATE_CART_COUNT](state, val) {
    state.cartAmount += val
    if (state.cartAmount < 0) {
      state.cartAmount = 0
    }
    setStore('cartAmount', state.cartAmount)
  },

  // 更新收货地址
  [CHANGE_ADDRESS](state, info) {
    state.addInfo = info
  },

  // 保存结算购物车
  [SAVE_ORDER_CART](state, obj) {
    if (obj.list) {
      state.orderCart = [...obj.list]
      setStore('orderCart', state.orderCart)
    }

    if (obj.totalAmount !== undefined) {
      state.totalAmount = obj.totalAmount
      setStore('totalAmount', state.totalAmount)
    }

    if (obj.totalMoney !== undefined) {
      state.totalPrice = obj.totalMoney
      setStore('totalPrice', state.totalPrice)
    }
  },

  // 初始化购物车
  [INIT_ORDER_CART](state) {
    state.orderCart = getStore('orderCart')
    state.totalAmount = getStore('totalAmount')
    state.totalPrice = getStore('totalPrice')
    state.cartAmount = getStore('cartAmount')
  },

  // 更新搜索关键字
  [UPDATE_SEARCH_KEY](state, key) {
    state.searchKey = key
  },

  // 保存搜索关键字
  [SAVE_SEARCH_KEYS](state, key) {
    if (key === 'clearHistory') {
      state.searchKeys = []
    } else {
      let index = state.searchKeys.findIndex(ele => {
        return ele === key
      })
      if (index !== -1) {
        state.searchKeys.splice(index, 1)
      }
      state.searchKeys.unshift(key)
    }
    setStore('searchKeys', state.searchKeys)
  },

  // 获取本地搜索关键字
  [GET_SEARCH_KEYS](state) {
    let keys = getStore('searchKeys')
    state.searchKeys = keys ? keys : []
  },

  // 更新订单列表 active_id
  [CHANGE_ORDER_LIST_ID](state, id) {
    state.orLtActiveId = id
  },

  // 保存福利访问记录
  [SAVE_WALFARE_RECORD](state, item) {
    let index = state.walfares.findIndex(ele => {
      return ele.name === item.name
    })
    if (index !== -1) {
      state.walfares.splice(index, 1)
    }
    state.walfares.unshift(item)
    setStore('walfares', state.walfares)
  },

  // 获取福利访问记录
  [GET_WALFARE_RECORD](state) {
    let keys = getStore('walfares')
    state.walfares = keys ? keys : []
  }
}
