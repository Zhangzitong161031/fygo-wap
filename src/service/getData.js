import fetch from '@/utils/fetch'

// 获取商品分类列表
export const getNavList = () => fetch('/mobile/index.php/CategoryList')

// 获取商品列表
export const getProductList = (obj, loading) => fetch('/mobile/index.php/goodsList', obj, 'GET', loading)

// 获取推荐商品列表
export const getHotProductList = (obj, loading = true) => fetch('/mobile/index.php/goodsHot', obj, 'GET', loading)

// 购物车列表
export const getCart = (obj, loading = true) => fetch('/mobile/index.php/cartsLists', obj, 'GET', loading)

// 添加购物车
export const addCart = (obj, loading = true) => fetch('/mobile/index.php/addCarts', obj, 'POST', loading)

// 购物车数量增, 减
export const editCartNum = (obj, loading = true) => fetch('/mobile/index.php/cartsNumEdit', obj, 'POST', loading)

// 购物车删除
export const deleteCart = obj => fetch('/mobile/index.php/cartsDel', obj, 'POST')

// 购物车商品选中, 取消选中
export const changeCartProStatus = (obj, loading = true) => fetch('/mobile/index.php/cartIsSelected', obj, 'POST', loading)

// 商品详情
export const getProDetail = (obj, loading = true) => fetch('/mobile/index.php/goodsDetail', obj, 'GET', loading)

// 收藏, 取消收藏
export const favoritePro = obj => fetch('/mobile/index.php/goodsCollect', obj)

// 批量取消收藏
export const favoriteCancel = obj => fetch('/mobile/index.php/collectDel', obj)

// 获取收藏夹商品列表
export const getFavoriteProList = (obj, loading) => fetch('/mobile/index.php/collectList', obj, 'GET', loading)

// 获取地址列表
export const getAddList = () => fetch('/mobile/index.php/AddressList')

// 获取默认收货地址
export const getDefaultAdd = () => fetch('/mobile/index.php/defaultAddress')

// 设置默认地址
export const setDefaultAdd = obj => fetch('/mobile/index.php/setDefaultAddress', obj)

// 地址切换
export const changeAcceptAdd = (obj, loading = true) => fetch('/mobile/index.php/editAddress', obj, 'POST', loading)

// 获取用户信息
export const getUserInfo = obj => fetch('/mobile/index.php/getUserInfo', obj)

// 获取验证码
export const getVerifyCode = (obj, loading = true) => fetch('/mobile/index.php/sendCode', obj, 'GET', loading)

// 登录
export const userLogin = (obj, loading = true) => fetch('/mobile/index.php/login', obj, 'GET', loading)

// 获取文章轮播图
export const getArticalSlide = obj => fetch('/mobile/index.php/getArticles', obj)

// 获取文章详情
export const getArticalDetail = obj => fetch('/mobile/index.php/getArticle', obj)

// 获取账单明细列表
export const getBillList = (obj, loading) => fetch('/mobile/index.php/billDetails', obj, 'GET', loading)

// 获取账单总金额
export const getBillCount = obj => fetch('/mobile/index.php/allIncomePay', obj, 'GET')

// 获取账单详情
export const getBillDetail = obj => fetch('/mobile/index.php/billDetail', obj)

// 获取通知列表
export const getNotifyList = obj => fetch('/mobile/index.php/getMails', obj)

// 阅读通知
export const readNotify = obj => fetch('/mobile/index.php/mailsEdit', obj)

// 清空通知列表
export const clearNotify = () => fetch('/mobile/index.php/mailsDel')

// 生成订单
export const createOrder = (obj, loading = true) => fetch('/mobile/index.php/addOrders', obj, 'POST', loading)

// 获取可用余额
export const getBalance = () => fetch('/mobile/index.php/getBalance')

// 立即支付
export const payOrder = (obj, loading = true) => fetch('/mobile/index.php/orderPayment', obj, 'POST', loading)

// 获取订单详情
export const getOrderDetail = (obj, loading = true) => fetch('/mobile/index.php/orderDetail', obj, 'GET', loading)

// 获取订单详情 - 商品列表
export const getOrderProList = (obj, loading) => fetch('/mobile/index.php/orderGoodsDetail', obj, 'GET', loading)

// 获取订单列表
export const getOrderList = (obj, loading) => fetch('/mobile/index.php/orderLists', obj, 'GET', loading)

// 提醒发货
export const remindShip = (obj, loading = true) => fetch('/mobile/index.php/reminderShipment', obj, 'GET', loading)

// 取消订单
export const cancelOrder = (obj, loading = true) => fetch('/mobile/index.php/orderCancel', obj, 'POST', loading)

// 删除订单
export const deleteOrder = (obj, loading = true) => fetch('/mobile/index.php/orderDelete', obj, 'POST', loading)

// 确认收货
export const comfirmReceive = (obj, loading = true) => fetch('/mobile/index.php/confirmReceipt', obj, 'POST', loading)

// 获取热词
export const getHotKeys = () => fetch('/mobile/index.php/searchKeyword')

// 获取购物车信息
export const getOrderCartInfo = (obj, loading = true) => fetch('/mobile/index.php/dataInfoShow', obj, 'POST', loading)

// 获取物流信息
export const getShipingInfo = (obj, loading = true) => fetch('/mobile/index.php/getShipping', obj, 'POST', loading)

// 退出登录
export const userLoginOut = (obj, loading = true) => fetch('/mobile/index.php/logout', obj, 'GET', loading)

// 再来一单
export const anotherOrder = (obj, loading = true) => fetch('/mobile/index.php/anotherOrder', obj, 'POST', loading)

// 获取省份列表
export const getProvince = () => fetch('/mobile/index.php/getProvince')

// 获取城市列表
export const getCity = obj => fetch('/mobile/index.php/getCity', obj)

// 获取区县列表
export const getArea = obj => fetch('/mobile/index.php/getArea', obj)

// 添加收货地址
export const addAddress = (obj, loading = true) => fetch('/mobile/index.php/addressAdd', obj, 'POST', loading)

// 删除收货地址
export const delAddress = (obj, loading = true) => fetch('/mobile/index.php/addressDel', obj, 'POST', loading)

// 添加收货地址
export const getQRCode = (obj, loading = true) => fetch('/mobile/index.php/makeQrcode', obj, 'GET', loading)

// 获取供货商列表
export const getSuppliers = () => fetch('/mobile/index.php/getSuppliers')

// 获取充值卡信息
export const getRachargeInfo = (obj, loading = true) => fetch('/mobile/index.php/GetCardInfo', obj, 'GET', loading)

// 充值卡充值
export const cardRecharge = (obj, loading = true) => fetch('/mobile/index.php/recharge', obj, 'GET', loading)
