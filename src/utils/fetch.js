import { host } from './env'
import { getCookie } from '@/utils/tools'

export default async (url = '', data = {}, type = 'GET', loading = false) => {
  type = type.toUpperCase()
  url = host + url
  let toast = null

  let requestConfig = {
    method: type,
    headers: {
      Accept: 'application/json',
      'fygo-token': getCookie('auth_token')
      // 'Content-Type': 'multipart/form-data'
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
    mode: 'cors', // cors, no-cors 不会发送跨域请求, 后台判断 Origin 是否在指定的域名在许可范围内
    cache: 'default', // 浏览器会缓存, 如果服务器指示请求资源没有改变，从缓存中返回 no-cache, force-cache/default
    credentials: 'include' // 携带 cookie 情况, omit, same-origin, include
  }

  // get 请求将参数拼接到 url 后
  if (type === 'GET') {
    let dataStr = ''
    Object.keys(data).forEach(key => {
      if (data[key]) {
        dataStr += key + '=' + data[key] + '&'
      }
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }

  // post 请求将参数添加到请求头的 body 中
  if (type == 'POST') {
    var formData = new FormData()
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    requestConfig.body = formData
  }

  if (window.fetch) {
    // 记录进入app时的url, for js-sdk
    if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
      window.entryUrl = location.href.split('#')[0]
    }
    // 发起网络请求
    try {
      let vm = window.vm
      toast = vm.$createToast({
        time: 0,
        txt: '正在加载...',
        mask: true
      })
      if (loading) {
        toast.show()
      }
      // 为了避免后台接口不规范的问题, 以后code值的判断放到具体请求结果中去
      const response = await fetch(new Request(url, requestConfig))
      const responseJson = await response.json()
      toast.hide()
      // token 失效
      if (responseJson.code === 407) {
        vm.$router.replace({
          path: '/login',
          query: {
            openid: getCookie('openid')
          }
        })
      } else {
        return responseJson
      }
    } catch (error) {
      alert(error.message)
      toast.hide()
      throw new Error(error)
    }
  }
}
