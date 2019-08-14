import { ISDEBUG } from './env'

/**
 * 打印
 */
export const debug = (() => {
  return ISDEBUG ? window.console.log : () => {}
})()

/**
 *  格式化 时间戳
 */
export const formateTimestamp = date => {
  const _date = new Date(date)
  const _y = _date.getFullYear()
  const _m = addZero(_date.getMonth() + 1)
  const _d = addZero(_date.getDate())
  const _h = addZero(_date.getHours())
  const _mm = addZero(_date.getMinutes())
  const _s = addZero(_date.getSeconds())
  return `${_y}-${_m}-${_d} ${_h}:${_mm}:${_s}`
}

export const addZero = num => {
  return `00${num}`.slice(-2)
}

/**
 *  读取 cookie
 */
export const getCookie = name => {
  if (!name) return
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  var arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
 *  保存 cookie
 */
export const setCookie = (name, value) => {
  if (!name) return
  if (getCookie(name)) delCookie(name)
  var Days = 30
  var exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

/**
 * 删除 cookie
 */
export const delCookie = name => {
  if (!name) return
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

/**
 * 存储 localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return JSON.parse(window.localStorage.getItem(name))
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}
