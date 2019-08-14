import { addCart } from '@/service/getData'
import { SAVE_CART_COUNT } from './mutation-types'

export default {
  async addProductToCart(context, obj) {
    // 添加购物车
    await addCart({
      goods_id: obj.goodsId
    }).then(res => {
      if (res) {
        context.commit(SAVE_CART_COUNT, 1)
      }
    })
  }
}
