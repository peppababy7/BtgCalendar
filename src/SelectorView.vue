<template>
  <div class="selector-view-wrapper">
    <span v-if="!isFloatStyle" class="update-date">{{updateDate}}</span>
    <div class="section-wrap">
      <div class="selector-section">
        <div class="selector-section-header">门票类型</div>
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
        <div class="selector-section-header">旅客类型</div>
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
        <div class="selector-section-header">门票</div>
        <div class="selector-grid-row">
          <div v-for="(item, index) in thirdList"
               :key="index"
               class="selector-grid"
               @click="selectThirdKey = item"
               :class="{active: item.code == selectThirdKey.code}">
            <div class="grid-dot"></div>
            <span>{{item.name}}</span>
          </div>
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
      default: ()=>{}
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
    ticketCode: {
      type: String,
      default: ''
    },
    refreshFunc: Function,
    todayFunc: Function,
    changedSelectFunc: Function
  },
  data () {
    return {
      selectPrimaryKey: '',
      selectSecondKey: '',
      selectThirdKey: '',
      didSetupPresetCode: true,
      defaultSortedSecondKeys: ['Adult' , 'Child', 'Senior' , 'Guest']
    }
  },
  computed: {
    primaryList() {
      if (!this.options) {
        return []
      }
      return Object.keys(this.options)
    },
    secondList() {
      if (!this.options) {
        return []
      }
      if (!this.options[this.selectPrimaryKey]) {
        return []
      }
      let keyList = Object.keys(this.options[this.selectPrimaryKey])
      let sortList = []
      // console.log('keyList', keyList, this.defaultSortedSecondKeys)
      for (const key of this.defaultSortedSecondKeys) {
        // console.log('const key of this.defaultSortedSecondKeys', key)
        const index = keyList.indexOf(key)
        if (index !== -1) {
          sortList.push(key)
          keyList.splice(index, 1);
          // console.log('sortList, keyList', sortList, keyList)
        }
      }
      sortList = sortList.concat(keyList)
      // console.log('sortList', sortList, keyList)
      return sortList
    },
    thirdList() {
      if (!this.options) {
        return []
      }
      // console.log('thirdList', this.options, this.selectPrimaryKey, this.selectSecondKey)
      if (!this.options[this.selectPrimaryKey]) {
        return []
      }
      // console.log(this.options[this.selectPrimaryKey][this.selectSecondKey], )
      return this.options[this.selectPrimaryKey][this.selectSecondKey]
    }
  },
  methods: {
    valueForType(type) {
      // console.log('valueForType', type, this.typeMap )
      const value = this.typeMap[type]
      return value ? value : type
    },
    setupPresetCode(val) {
      // console.log('setupPresetCode', val)
      for (const section0 in this.options) {
        for (const section1 in this.options[section0]) {
          for (const item of this.options[section0][section1]) {
            if (item.code == val) {
              this.selectPrimaryKey = section0
              this.selectSecondKey = section1
              this.selectThirdKey = item
            }
          }
        }
      }
      this.didSetupPresetCode = true
    },
    handleSelectPrimaryKey() {
      const keys = Object.keys(this.options[this.selectPrimaryKey])
      // console.log('handleSelectPrimaryKey', this.selectPrimaryKey, keys, this.selectSecondKey)
      if (keys.indexOf(this.selectSecondKey) !== -1) {
        this.handleSelectSecondKey()
        return
      }
      for (const key of this.defaultSortedSecondKeys) {
        if (keys.indexOf(key) !== -1) {
          this.selectSecondKey = key
          return
        }
      }
      this.selectSecondKey = keys[0]
    },
    handleSelectSecondKey() {
      const list = this.options[this.selectPrimaryKey][this.selectSecondKey]
      // console.log('handleSelectSecondKey', this.selectSecondKey, list, this.selectThirdKey)
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
      // console.log('options: function ()', this.options)
      if (!this.didSetupPresetCode) {
        this.setupPresetCode(this.ticketCode)
        return
      }
      if (!this.selectPrimaryKey && this.options) {
        this.selectPrimaryKey = Object.keys(this.options)[0]
      }
    },
    'ticketCode': function () {
      // console.log(this.ticketCode)
      if (this.ticketCode) {
        this.didSetupPresetCode = false
        this.setupPresetCode(this.ticketCode)
      }
    },
    selectPrimaryKey(val) {
      if (!this.didSetupPresetCode && this.isFloatStyle) {
        return
      }
      this.handleSelectPrimaryKey()
    },
    selectSecondKey(val) {
      if (!this.didSetupPresetCode && this.isFloatStyle) {
        return
      }
      this.handleSelectSecondKey()
    },
    selectThirdKey(val) {
      if (this.didSetupPresetCode && this.isFloatStyle) {
        return
      }
      this.handleSelectThirdKey()
    }
  }
}
</script>

<style lang="scss">
@import "selectorStyle";
</style>
