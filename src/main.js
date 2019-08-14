import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import Cube from 'cube-ui'
import VueLazyload from 'vue-lazyload'
import './utils/rem'
import './icons'
import { debug } from './utils/tools'
import loadingImg from './icons/loadingpic.png'
import loadingError from './icons/loadingerror.png'

Vue.use(Cube)
Vue.use(VueLazyload, {
  preLoad: 1.3, // 预加载高度的比例, 默认 1.3
  loading: loadingImg,
  error: loadingError,
  attempt: 1 // 尝试的次数
})

Vue.config.productionTip = false
Vue.prototype.$debug = debug

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
