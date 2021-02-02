<template>
  <div class="selector-view-wrapper" v-if="Object.keys(options).length">
    <span v-if="!isFloatStyle" class="update-date">{{updateDate}}</span>
    <div class="selector-section">
      <h4 class="selector-section-header">门票类型</h4>
      <div class="selector-grid-row">
        <div v-for="(item, index) in primaryList"
             :key="index"
             class="selector-grid"
             @click="selectPrimaryKey = item"
             :class="{active: item == selectPrimaryKey}">
          <div class="grid-dot"></div>
          <span>{{valueForType(item)}}</span>
        </div>
      </div>
    </div>
    <div class="selector-section">
      <h4 class="selector-section-header">旅客类型</h4>
      <div class="selector-grid-row">
        <div v-for="(item, index) in secondList"
             :key="index"
             class="selector-grid"
             @click="selectSecondKey = item"
             :class="{active: item == selectSecondKey}">
          <div class="grid-dot"></div>
          <span>{{valueForType(item)}}</span>
        </div>
      </div>
    </div>
    <div class="selector-section">
      <h4 class="selector-section-header">门票</h4>
      <div class="selector-grid-row">
        <div v-for="(item, index) in thirdList"
             :key="index"
             class="selector-grid"
             @click="selectThirdKey = item"
             :class="{active: item == selectThirdKey}">
          <div class="grid-dot"></div>
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
    <div v-if="!isFloatStyle" class="button-section">
      <div class="button-box" @click="todayFunc">
        <span>今日</span>
      </div>
      <div class="button-box" @click="refreshFunc">
        <span>刷新</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "selectorView",
  props: {
    options: {
      type: Object,
      default: {}
    },
    typeMap: {
      type: Object,
      default: {}
    },
    updateDate: {
      type: String,
      default: ''
    },
    isFloatStyle: {
      type: Boolean,
      default: false
    },
    refreshFunc: Function,
    todayFunc: Function,
    changedSelectFunc: Function
  },
  data () {
    return {
      selectPrimaryKey: '',
      selectSecondKey: '',
      selectThirdKey: ''
    }
  },
  computed: {
    primaryList() {
      return Object.keys(this.options)
    },
    secondList() {
      if (!this.options[this.selectPrimaryKey]) {
        return []
      }
      return Object.keys(this.options[this.selectPrimaryKey])
    },
    thirdList() {
      if (!this.options[this.selectPrimaryKey]) {
        return []
      }
      return this.options[this.selectPrimaryKey][this.selectSecondKey]
    }
  },
  methods: {
    valueForType(type) {
      const value = this.typeMap[type]
      return value ? value : type
    },
    handleSelectPrimaryKey() {
      const keys = Object.keys(this.options[this.selectPrimaryKey])
      if (keys.indexOf(this.selectSecondKey) == -1) {
        this.selectSecondKey = keys[0]
      }
    },
    handleSelectSecondKey() {
      const list = this.options[this.selectPrimaryKey][this.selectSecondKey]
      if (list.indexOf(this.selectThirdKey) == -1) {
        this.selectThirdKey = list[0]
      }
    },
    handleSelectThirdKey() {
      if (this.isFloatStyle) {
        return
      }
      this.changedSelectFunc(this.selectPrimaryKey, this.selectSecondKey, this.selectThirdKey)
    },
    callbackResult() {
      return [this.selectPrimaryKey, this.selectSecondKey, this.selectThirdKey]
    }
  },
  watch: {
    'options': function () {
      console.log(this.options)
      if (!this.selectPrimaryKey && this.options) {
        this.selectPrimaryKey = Object.keys(this.options)[0]
      }
    },
    selectPrimaryKey(val) {
      this.handleSelectPrimaryKey()
    },
    selectSecondKey(val) {
      this.handleSelectSecondKey()
    },
    selectThirdKey(val) {
      this.handleSelectThirdKey()
    }
  }
}
</script>

<style lang="scss">
@import "selectorStyle";
</style>
