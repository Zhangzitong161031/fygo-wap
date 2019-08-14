<template>
  <div class="address-container">
    <div class="address-scroll-div">
      <cube-radio-group v-model="selected">
        <cube-radio v-for="option in addList" :key="option.value" :option="option" :hollow-style="true">
          <a href="javascript:;" @click.stop class="address-component">
            <div class="seleced-row">
              {{ option.user_name }}
              <div class="right-div">
                <span v-if="option.is_default === 1" class="tip-span">默认地址</span>
                <div @click.stop="editAddress(option)" v-if="is_set === 1"><svg-icon icon-class="edit" /></div>
              </div>
            </div>
            <div>{{ option.mobile_phone }}</div>
            <div class="add-div">
              {{ getAddreeDetail(option) }}
              <div @click.stop="deleteAddress(option)" v-if="is_set === 1"><svg-icon icon-class="delete-active" /></div>
            </div>
          </a>
        </cube-radio>
      </cube-radio-group>
      <!--  is_set === 1 后台开启新增地址功能-->
      <div class="change-btn" @click="addAddress" v-if="is_set === 1">新增收货地址</div>
      <div class="change-btn" @click="changeAdd" v-if="is_set === 0">设为默认</div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { getAddList, setDefaultAdd, delAddress } from '@/service/getData'
export default {
  data() {
    return {
      selected: null,
      addList: [],
      is_set: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      new BetterScroll('.address-container', {
        click: true
      })
    })
  },
  async created() {
    await this.getAddressList()
  },
  methods: {
    // 获取地址列表
    async getAddressList() {
      await getAddList().then(res => {
        if (res.code === 0) {
          this.addList = []
          this.is_set = res.is_set
          res.data.forEach(ele => {
            this.addList.push({
              ...ele,
              value: ele.id
            })
            if (ele.is_default === 1) {
              this.selected = ele.id
            }
          })
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 切换默认地址
    async changeAdd() {
      await setDefaultAdd({
        addr_id: this.selected
      }).then(async res => {
        if (res.code === 0) {
          await this.getAddressList()
          this.$createToast({
            txt: '设置成功',
            type: 'correct',
            time: 800
          }).show()
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 获取地址详情
    getAddreeDetail(info) {
      if (info.type && info.type.length) {
        return '[' + info.type + ']' + ' ' + info.province_name + info.city_name + info.area_name + info.address
      } else {
        return info.province_name + info.city_name + info.area_name + info.address
      }
    },

    // 添加地址
    addAddress() {
      this.$router.push({
        path: '/mine/service/address/add',
        query: {
          type: '0'
        }
      })
    },

    // 编辑地址
    editAddress(option) {
      this.$router.push({
        path: '/mine/service/address/add',
        query: {
          type: '1',
          name: option.user_name,
          phone: option.mobile_phone,
          province: option.province_name,
          city: option.city_name,
          area: option.area_name,
          zone: option.province_name + ' ' + option.city_name + ' ' + option.area_name,
          detaile: option.address,
          isDefault: option.is_default + '',
          addrId: option.id
        }
      })
    },

    // 删除地址
    deleteAddress(option) {
      this.$createDialog({
        type: 'confirm',
        title: '提示',
        content: `您是否要删除此地址?`,
        confirmBtn: {
          text: '确定',
          active: true
        },
        cancelBtn: {
          text: '取消',
          active: false
        },
        onConfirm: async () => {
          await delAddress({
            id: option.id
          }).then(async res => {
            await this.getAddressList()
            if (res.code === 0) {
              this.$createToast({
                txt: '删除成功',
                type: 'success',
                time: 800
              }).show()
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
  }
}
</script>

<style lang="scss" scoped>
.address-container {
  @include wh(100%, 100%);
  background-color: #fff;
  .address-scroll-div {
    @include wh(100%, auto);
    @include flex(center, flex-start);
    .cube-radio-group {
      @include wh(100%, auto);
      .cube-radio {
        padding: 0 0.5rem;
        @include wh(100%, auto);
        .address-component {
          @include wh(100%, auto);
          background-color: #fff;
          @include sc(0.6rem, $fc);
          // 配合 cube-radio 处理自定义点击事件
          position: relative;
          z-index: 1;
          .add-div {
            font-weight: bold;
            @include flex(center, space-between, row);
            .svg-icon {
              @include wh(0.8ren, 0.8rem);
            }
          }
          .seleced-row {
            @include flex(center, space-between, row);
            .right-div {
              @include flex(center, flex-start, row);
              .tip-span {
                @include sc(0.6rem, $theme);
                margin-right: 0.5rem;
              }
            }
          }
        }
      }
    }
    .change-btn {
      margin-top: 1rem;
      margin-bottom: 1rem;
      @include wh(calc(100% - 2rem), 2rem);
      background-color: $theme;
      @include sc(0.7rem, #fff);
      font-weight: bold;
      letter-spacing: 0.1rem;
      @include flex(center, center);
      border-radius: 0.2rem;
    }
  }
}
</style>
<style>
.cube-radio-ui::before {
  transform: scale(1);
}
.cube-radio_selected .cube-radio-ui i {
  transform: scale(1);
}
.cube-radio-hollow.cube-radio_selected .cube-radio-ui i::before,
.cube-radio-hollow.cube-radio_disabled .cube-radio-ui i::before {
  transform: translate(-50%, -50%) scale(0.8);
}
</style>
