<template>
  <div class="sovell-select-component" @click="selectChange">
    <span>{{ vaule }}</span>
    <svg-icon :icon-class="close ? 'sort-down' : 'sort-up'"></svg-icon>
  </div>
</template>

<script>
import { addZero } from '@/utils/tools'
export default {
  data() {
    return {
      vaule: '本月',
      close: true,
      datePicker: null
    }
  },
  methods: {
    selectChange() {
      this.close = !this.close
      var myDate = new Date()
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '日期选择',
          min: new Date(myDate.getFullYear() - 2, myDate.getMonth()),
          max: myDate,
          value: myDate,
          columnCount: 2,
          format: {
            year: 'YYYY年',
            month: 'MM月'
          },
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        })
      }
      this.datePicker.show()
    },
    selectHandle(date, selectedVal, selectedText) {
      this.vaule = selectedText.join('')
      // this.$emit('refresh', parseInt(new Date(selectedVal.join('/')).getTime() / 1000))
      this.$emit('refresh', `${selectedVal[0]}-${addZero(selectedVal[1])}-01 00:00:00`, selectedVal)
    },
    cancelHandle() {
      this.close = !this.close
    }
  }
}
</script>

<style lang="scss" scoped>
.sovell-select-component {
  @include wh(5rem, 1.2rem);
  border-radius: 1rem;
  @include flex(center, space-between, row);
  padding: 0 0.3rem;
  border: solid 0.05rem $blc;
  span {
    @include sc(0.6rem, $fc);
  }
  .svg-icon {
    @include wh(0.7rem, 0.7rem);
  }
}
</style>
