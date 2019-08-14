<template>
  <div class="add-address-container">
    <div class="com-input-div">
      <div class="title-div">收货人</div>
      <div class="input-box">
        <input type="text" v-model="name" placeholder="收货人姓名" />
      </div>
    </div>
    <div class="com-input-div">
      <div class="title-div">手机号码</div>
      <div class="input-box">
        <input type="text" v-model="phone" placeholder="收货人手机" />
      </div>
    </div>
    <div class="com-input-div">
      <div class="title-div">所在地区</div>
      <div class="input-box" @click="showAddressPicker">
        <input type="text" v-model="zone" placeholder="请选择收货地区" readonly />
      </div>
    </div>
    <div class="com-input-div">
      <div class="title-div">详细地址</div>
      <div class="input-box">
        <input type="text" v-model="detaile" placeholder="街道, 门牌号等" />
      </div>
    </div>
    <div class="set-default-div">
      <div class="title-div">
        <span class="title-span">设为默认地址</span>
        <span class="tip-span">每次购物会优先定位到默认地址, 方便您轻松购物</span>
      </div>
      <div class="input-box">
        <cube-switch v-model="isDefault"></cube-switch>
      </div>
    </div>
    <div class="add-btn" @click="saveExpressAddress">保存收货地址</div>
  </div>
</template>

<script>
import { getProvince, getCity, getArea, addAddress } from '@/service/getData'
export default {
  data() {
    return {
      // 姓名
      name: '',
      // 手机
      phone: '',
      // 所在地区
      zone: '',
      // 详细地址
      detaile: '',
      // 选择器数据
      addressData: [],
      // 省份列表
      province: [],
      // 城市列表
      city: [],
      // 区县列表
      area: [],
      // 选择器展示的数据id
      selectedIndex: [0, 0, 0],
      // 编辑省份index
      proIndex: 0,
      // 编辑城市index
      cityIndex: 0,
      // 编辑区县index
      areaIndex: 0,
      // 是否是默认地址
      isDefault: false,
      // 选择器选中的value值
      value: [],
      // 选择器对象
      addressPicker: null,
      // 地址id
      addrId: null,
      // 编辑省份
      provinceName: '',
      // 编辑城市
      cityName: '',
      // 编辑区县
      areaName: ''
    }
  },
  async created() {
    let query = this.$route.query
    // 获取省份
    await this.getProvinceList()

    if (query.type === '0') {
      // 添加新地址
      // 获取城市
      await this.getCityList(0)

      // 获取县区
      await this.getAreaList(0, 0)

      this.createAddressSelecter()

      // 设置选择器数据
      this.addressPicker.setData(this.addressData, this.selectedIndex)
    } else if (query.type === '1') {
      // 编辑地址
      this.name = query.name
      this.phone = query.phone
      this.zone = query.zone
      this.detaile = query.detaile
      this.isDefault = query.isDefault === '1' ? true : false
      this.addrId = query.addrId
      this.provinceName = query.province
      this.cityName = query.city
      this.areaName = query.area

      this.province.filter((item, i) => {
        if (item.region_name === this.provinceName) {
          this.proIndex = i
          this.value[0] = item.region_id
          return
        }
      })
      // 获取城市
      await this.getCityList(this.proIndex)

      this.city.filter((item, i) => {
        if (item.region_name === this.cityName) {
          this.cityIndex = i
          this.value[1] = item.region_id
          return
        }
      })
      // 获取县区
      await this.getAreaList(this.proIndex, this.cityIndex)

      this.area.filter((item, i) => {
        if (item.region_name === this.areaName) {
          this.areaIndex = i
          this.value[2] = item.region_id
          return
        }
      })

      this.createAddressSelecter()

      this.selectedIndex = [this.proIndex, this.cityIndex, this.areaIndex]

      // 设置选择器数据
      this.addressPicker.setData(this.addressData, this.selectedIndex)
    }
  },
  methods: {
    // 添加地址
    saveExpressAddress() {
      // 表单校验
      let msg = ''
      let phoneReg = new RegExp('^[0-9]{11}$')
      if (this.detaile === '') msg = '请填写详细地址'
      if (this.zone === '') msg = '请填选择所在地区'
      if (!phoneReg.test(this.phone)) msg = '请填写正确的手机号码'
      if (this.name === '') msg = '请填写收货人姓名'
      if (msg !== '') {
        this.$createToast({
          txt: msg,
          type: 'correct',
          time: 800
        }).show()
      } else {
        // 添加, 编辑地址
        addAddress({
          is_edit: this.$route.query.type === '0' ? 0 : 1,
          name: this.name,
          phone: this.phone,
          prov: this.value[0],
          city: this.value[1],
          area: this.value[2],
          address: this.detaile,
          addr_id: this.addrId,
          is_default: this.isDefault ? 1 : 0
        }).then(res => {
          if (res.code === 0) {
            this.$createToast({
              txt: '添加地址成功',
              type: 'correct',
              time: 800
            }).show()
            this.$router.go(-1)
          } else {
            this.$createToast({
              txt: res.msg,
              type: 'error',
              time: 800
            }).show()
          }
        })
      }
    },

    // 创建选择器
    createAddressSelecter() {
      this.addressPicker = this.$createCascadePicker({
        title: '所属地区',
        async: true,
        data: this.addressData,
        selectedIndex: this.selectedIndex,
        onSelect: this.selectHandle,
        onCancel: this.cancelHandle,
        onChange: this.changeHandle
      })
    },

    // 选择标签
    labeKeySearch(flag, id) {
      if (!flag) {
        this.labels.forEach((item, index) => {
          if (index === id) {
            item.isSelected = true
          } else {
            item.isSelected = false
          }
        })
      }
    },

    // 显示地址选择器
    showAddressPicker() {
      this.addressPicker.show()
    },

    // 获取省列表
    async getProvinceList() {
      await getProvince().then(async res => {
        if (res.code === 0) {
          this.province = [...res.data]
          this.province.forEach(item => {
            this.addressData.push({
              text: item.region_name,
              value: item.region_id,
              children: []
            })
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

    // 获取城市列表
    async getCityList(index = 0) {
      await getCity({
        prov: this.province[index].region_id
      }).then(res => {
        if (res.code === 0) {
          this.city = [...res.data]
          if (!this.addressData[index].children.length) {
            this.city.forEach(item => {
              this.addressData[index].children.push({
                text: item.region_name,
                value: item.region_id,
                children: []
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
    },

    // 获取区县列表
    async getAreaList(i = 0, index = 0) {
      await getArea({
        city: this.city[index].region_id
      }).then(res => {
        if (res.code === 0) {
          this.area = [...res.data]
          if (!this.addressData[i].children[index].children.length) {
            this.area.forEach(item => {
              this.addressData[i].children[index].children.push({
                text: item.region_name,
                value: item.region_id
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
    },

    // 地址切换
    async changeHandle(i, index) {
      if (i === 0) {
        // 省份切换
        this.proIndex = index

        // 更新城市列表
        await this.getCityList(index)

        // 更新区县列表
        await this.getAreaList(index, 0)

        // 设置选择器数据
        this.selectedIndex = [index, 0, 0]
        this.addressPicker.setData(this.addressData, this.selectedIndex)
      } else if (i === 1) {
        // 城市切换
        this.cityIndex = index

        // 更新区县列表
        await this.getAreaList(this.proIndex, index)

        // 设置选择器数据
        this.selectedIndex = [this.proIndex, index, 0]
        this.addressPicker.setData(this.addressData, this.selectedIndex)
      }
    },

    // 选择地址
    selectHandle(value, index, text) {
      if (this.value.join() !== value.join()) {
        this.detaile = ''
        this.value = [...value]
        this.zone = text.join(' ')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-address-container {
  @include wh(100%, 100%);
  background-color: $bc;
  @include flex(center, flex-start);
  .com-input-div {
    @include wh(100%, 2rem);
    @include flex(center, flex-start, row);
    background-color: #fff;
    border-bottom: solid 0.05rem #f6f6f6;
    .title-div {
      @include sc(0.6rem, $fc);
      @include wh(4rem, 100%);
      text-align: center;
      line-height: 2rem;
    }
    .input-box {
      @include wh(calc(100% - 4rem), 100%);
      @include sovell-input;
    }
  }
  .set-default-div {
    @include wh(100%, 2rem);
    background-color: #fff;
    @include flex(center, space-between, row);
    padding: 0 0.4rem;
    .title-div {
      @include flex(flex-start, center);
      .title-span {
        @include sc(0.6rem, $fc);
        margin-bottom: 0.2rem;
      }
      .tip-span {
        @include sc(0.5rem, $phc);
      }
    }
  }
  .add-btn {
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
</style>
<style>
.cube-switch .cube-switch-ui {
  height: 1rem;
}
</style>
