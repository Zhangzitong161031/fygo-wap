import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // history, hash
  mode: 'history',
  // 在node中，有全局变量process表示的是当前的node进程, process.env包含着关于系统环境的信息, BASE_URL: '/, NODE_ENV: 'development
  // base: process.env.BASE_URL,
  base: '/wap/',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      // 登录
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue')
    },
    {
      // 首页
      path: '/home',
      name: 'home',
      meta: { keepAlive: true },
      component: () => import('@/views/home/home.vue')
    },
    {
      // 商城
      path: '/store',
      name: 'store',
      meta: { keepAlive: true },
      component: () => import('@/views/store/store.vue')
    },
    {
      // 支付
      path: '/pay',
      name: 'pay',
      component: () => import('@/views/pay/pay.vue')
    },
    {
      // 购物车
      path: '/cart',
      name: 'cart',
      meta: { keepAlive: true },
      component: () => import('@/views/cart/cart.vue')
    },
    {
      // 我的
      path: '/mine',
      name: 'mine',
      meta: { keepAlive: true },
      component: () => import('@/views/mine/mine.vue')
    },
    {
      // 商品详情
      path: '/store/detail',
      name: 'detail',
      component: () => import('@/views/store/detail/detail.vue')
    },
    {
      // 商品搜索
      path: '/store/search',
      name: 'search',
      meta: {
        keepAlive: true,
        showFootBar: false
      },
      component: () => import('@/views/store/search/search.vue')
    },
    {
      // 收货地址列表
      path: '/address/list',
      name: 'addressList',
      component: () => import('@/views/store/addressList/addressList.vue')
    },
    {
      // 下单
      path: '/store/order',
      name: 'order',
      component: () => import('@/views/store/order/order.vue')
    },
    {
      // 商品清单
      path: '/store/order/pro_list',
      name: 'proList',
      component: () => import('@/views/store/order/proList.vue')
    },
    {
      // 确认支付
      path: '/store/order/pay',
      name: 'payOrder',
      component: () => import('@/views/store/order/payOrder.vue')
    },
    {
      // 支付成功
      path: '/store/order/pay_success',
      name: 'paySuccess',
      component: () => import('@/views/store/order/paySuccess.vue')
    },
    {
      // 订单详情
      path: '/store/order/detail',
      name: 'orderDetail',
      component: () => import('@/views/store/order/orderDetail.vue')
    },
    {
      // 物流详情
      path: '/store/order/express',
      name: 'express',
      component: () => import('@/views/store/order/express.vue')
    },
    {
      // 个人信息
      path: '/mine/user_info',
      name: 'userInfo',
      component: () => import('@/views/mine/userInfo/userInfo.vue')
    },
    {
      // 福利管理
      path: '/mine/fuli_manage',
      name: 'fuliManage',
      component: () => import('@/views/mine/fuliManage/fuliManage.vue')
    },
    {
      // 订单管理
      path: '/mine/order_manage',
      name: 'orderManage',
      component: () => import('@/views/mine/orderManage/orderManage.vue')
    },
    {
      // 服务管理
      path: '/mine/service_manage',
      name: 'serviceManage',
      component: () => import('@/views/mine/serviceManage/serviceManage.vue')
    },
    {
      // 通知中心
      path: '/mine/service/notify',
      name: 'notify',
      component: () => import('@/views/mine/serviceManage/notify.vue')
    },
    {
      // 账单明细
      path: '/mine/service/bill',
      name: 'bill',
      component: () => import('@/views/mine/serviceManage/bill.vue')
    },
    {
      // 账单详情
      path: '/mine/service/bill_detail',
      name: 'billDetail',
      component: () => import('@/views/mine/serviceManage/billDetail.vue')
    },
    {
      // 收货地址
      path: '/mine/service/address',
      name: 'address',
      component: () => import('@/views/mine/serviceManage/address.vue')
    },
    {
      // 添加收货地址
      path: '/mine/service/address/add',
      name: 'addAddress',
      component: () => import('@/views/mine/serviceManage/addAddress.vue')
    },
    {
      // 收藏夹
      path: '/mine/service/favorite',
      name: 'favorite',
      component: () => import('@/views/mine/serviceManage/favorite.vue')
    },
    {
      // 首页文章详情
      path: '/home/artical',
      name: 'artical',
      component: () => import('@/views/home/artical.vue')
    },
    {
      // 我的福利
      path: '/home/welfare',
      name: 'welfare',
      component: () => import('@/views/home/welfare.vue')
    },
    {
      // 福利充值
      path: '/mine/service/recharge',
      name: 'recharge',
      component: () => import('@/views/mine/fuliManage/recharge.vue')
    },
    {
      // 确认充值
      path: '/mine/service/comfirm-recharge',
      name: 'comfirmRecharge',
      component: () => import('@/views/mine/fuliManage/comfirmRecharge.vue')
    },
    {
      // 充值结果
      path: '/mine/service/recharge-success',
      name: 'rechargeSuccess',
      component: () => import('@/views/mine/fuliManage/rechargeSuccess.vue')
    }
  ]
})

// vue 路由守卫: 全局守卫
// 还有 路由独享的守卫, 组件内的守卫
router.beforeEach((to, from, next) => {
  next()
})

export default router
