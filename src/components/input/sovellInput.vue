<template>
  <div class="sovell-input-div">
    <!-- ios input输入框type=search，软键盘搜索按钮, 必须在input外层加上form，必须有action -->
    <form @submit.prevent="formSubmit" action="#">
      <input :type="type" :placeholder="placeholder" v-model="input" ref="sovellInput" />
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    type: {
      default: 'text'
    },
    placeholder: {
      required: true
    }
  },
  computed: {
    ...mapState({
      searchKey: 'searchKey'
    }),
    input: {
      get() {
        return this.searchKey
      },
      set(val) {
        this.UPDATE_SEARCH_KEY(val)
      }
    }
  },
  methods: {
    // eslint-disable-next-line
    ...mapMutations([
      'UPDATE_SEARCH_KEY'
    ]),

    // 移动端软键盘搜索事件
    formSubmit() {
      this.$emit('searchEvent')
    },

    // 隐藏软键盘
    hiddenKeyborad() {
      this.$refs.sovellInput.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
.sovell-input-div {
  @include wh(100%, 100%);
  input {
    @include wh(100%, 100%);
    @include sc(0.7rem, $theme);
    caret-color: $theme;
    background-color: $bc;
    &::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      @include sc(0.7rem, $phc);
    }
    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      @include sc(0.7em, $phc);
    }
    &::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      @include sc(0.7rem, $phc);
    }
    &:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      @include sc(0.7rem, $phc);
    }
    &::-webkit-search-cancel-button {
      // 去除 chrome 浏览器 search 时的 clearBtn
      display: none;
    }
  }
}
</style>
