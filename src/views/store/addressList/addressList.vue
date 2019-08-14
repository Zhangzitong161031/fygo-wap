<template>
  <div class="address-container">
    <div class="address-scroll-div">
      <cube-radio-group v-model="selected">
        <cube-radio v-for="option in addList" :key="option.value" :option="option" :hollow-style="true">
          <div class="address-component">
            <div>{{ option.user_name }}</div>
            <div>{{ option.mobile_phone }}</div>
            <div class="add-div">{{ getAddreeDetail(option) }}</div>
          </div>
        </cube-radio>
      </cube-radio-group>
      <div class="change-btn" @click="changeAdd">切换地址</div>
      <div class="add-btn" @click="addAdress" v-if="is_set === 1">新增地址</div>
    </div>
  </div>
</template>

<script>
import { BetterScroll } from 'cube-ui'
import { getAddList, changeAcceptAdd } from '@/service/getData'
import { setCookie } from '@/utils/tools'
export default {
  data() {
    return {
      selected: null,
      addList: [],
      defalutID: null,
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
    this.defalutID = this.$route.query.id
    await getAddList().then(res => {
      if (res.code === 0) {
        this.addList = []
        this.selected = res.data ? res.data[0].id : ''
        this.is_set = res.is_set
        if (res.data && res.data.length) {
          res.data.forEach(ele => {
            this.addList.push({
              ...ele,
              value: ele.id
            })
          })
        }
      } else {
        this.$createToast({
          txt: res.msg,
          type: 'error',
          time: 800
        }).show()
      }
    })
    this.selected = this.defalutID
  },
  methods: {
    // 切换地址
    async changeAdd() {
      await changeAcceptAdd({
        address_id: this.selected
      }).then(res => {
        if (res.code === 0) {
          setCookie('createOrderFlag', true)
          this.$router.go(-1)
        } else {
          this.$createToast({
            txt: res.msg,
            type: 'error',
            time: 800
          }).show()
        }
      })
    },

    // 处理地址详情
    getAddreeDetail(info) {
      if (info.type && info.type.length) {
        return '[' + info.type + ']' + ' ' + info.province_name + info.city_name + info.area_name + info.address
      } else {
        return info.province_name + info.city_name + info.area_name + info.address
      }
    },

    // 新增地址
    addAdress() {
      this.$router.push({
        path: '/mine/service/address/add',
        query: {
          type: '0'
        }
      })
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
          .add-div {
            font-weight: bold;
          }
        }
      }
    }
    .change-btn {
      margin-top: 1rem;
      @include wh(calc(100% - 2rem), 2rem);
      background-color: $theme;
      @include sc(0.7rem, #fff);
      font-weight: bold;
      letter-spacing: 0.1rem;
      @include flex(center, center);
      border-radius: 0.2rem;
    }
    .add-btn {
      margin-top: 0.5rem;
      @include wh(calc(100% - 2rem), 2rem);
      background-color: #fff;
      @include sc(0.7rem, $theme);
      font-weight: bold;
      letter-spacing: 0.1rem;
      @include flex(center, center);
      border-radius: 0.2rem;
      border: solid $theme 0.1rem;
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
