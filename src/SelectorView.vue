<template>
  <div class="selector-view-wrapper">
    <div v-for="(item, index) in Object.keys(options)" :key="index">
      <div class="selector-grid">
        <span>{{valueForType(item)}}</span>
      </div>
    </div>
    <div v-for="(item, index) in Object.keys(options[selectPrimaryKey])" :key="index">
      <div class="selector-grid">
        <span>{{valueForType(item)}}</span>
      </div>
    </div>
    <div v-for="(item, index) in options[this.selectPrimaryKey][this.selectSecondKey]" :key="index">
      <div class="selector-grid">
        <span>{{item.name}}</span>
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
    refreshFunc: Function
  },
  data () {
    return {
      selectPrimaryKey: '',
      selectSecondKey: '',
      selectThirdKey: ''
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
      console.log(this.selectThirdKey)
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
