<template>
  <div class="_calendar-wrapper">
    <div class="calendar-box" :class="{miniCalendarBox: options.type === 'mini'}">
      <LargeCalendar class="observer-large-calendar" v-if="options.type === 'large'"
                     :options="calendarOptions"></LargeCalendar>
      <MiniCalendar v-if="options.type === 'mini'"
                    :options="calendarOptions"></MiniCalendar>
    </div>
    <SelectorView
      class="observer-large-selector-view"
      v-if="options.type === 'large'"
      :options="options.ticketsData.options"
      :typeMap="typeMap"
      :updateDate="updateDate"
      :custom-selector-section-names="options.customSelectorSectionNames"
      :refresh-func="clickRefreshData"
      :today-func="handleClickToday"
      :changed-select-func="handleChangedSelect" />
    <el-dialog
        title="更换门票"
        class="dialog"
        :visible.sync="isShowSelector"
        :fullscreen="true"
        :close-on-click-modal="false">
      <SelectorView
          ref="selectorView"
          :ticketCode="options.ticketsData.ticketCode"
          :options="options.ticketsData.options"
          :typeMap="typeMap"
          :isFloatStyle="true"
          :updateDate="null"
          :custom-selector-section-names="options.customSelectorSectionNames"
          :refresh-func="null"
          :today-func="null"
          :changed-select-func="null"></SelectorView>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-footer">
          <div class="button-cancel" @click="isShowSelector = false">
            <span>取消</span>
          </div>
          <div class="button-confirm" @click="handleConfirmSelector">
            <span>确定</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LargeCalendar from './LargeCalendar';
import MiniCalendar from './MiniCalendar';
import SelectorView from './SelectorView'
import {makeEvents} from './utils'
import tippy from 'tippy.js';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';
import {getFullDateString, appendDaysString, isRangedDate, isBeforeDate, isAfterDate} from './utils'

const emptyDayClass = 'empty-day'
const userSelectedDayClass = 'user-selected-day'
export default {
  name: 'BtgCalendar',
  props: {
    options: {
      type: Object,
      default: {
        ticketsData: {},
        ticketCode: '',
        updateTitle: '',
        insetHeight: 0,
        priceColor: [
          {
            value: 99999999,
            type: 'price'
          }
        ],
        availableColor: [
          {
            value: 100,
            type: 'low'
          },
          {
            value: 1000,
            type: 'mid'
          },
          {
            value: 99999999,
            type: 'high'
          },
        ],
        type: '',
        enableRefresh: true, // 是否需要刷新按钮， default true
        enableSelect: true, // 是否需要条件选择器， default true
        isHoverEvent: true, // 鼠标移动到日期上，如果有事件，是否需要显示，default true
        typeMap: {},
        virtualStockData: [],
        isFloatSelector: false, // 筛选浮动,
        isReloadIfChangedOptions: false,
        isReloadStockIfRefresh: false
      }
    },
    refreshFunc: Function,
    virtualStockFunc: Function
  },
  components: {
    LargeCalendar,
    MiniCalendar,
    SelectorView
  },
  data () {
    return {
      timer: null,
      userSelectedDateStr: '',
      userPreSelectedDateStr: '',
      lastSelectedDayEl: null,
      calendar: null,
      isHoverEvent: true,
      selectedProductPrimaryType: '',
      selectedProductSecondType: '',
      selectedProductThirdType: {},
      enableSelect: null,
      typeMap: {},
      isShowSelector: false,
      virtualParams: {},
      virtualStockData: [],
      observer: null, // observer large calendar height
      recordOldValue: {
        width: '0',
        height: '0'
      },
      calendarOptions: {
        initialView: 'dayGridMonth',
        locale: 'zh',
        buttonText: {
          today: '今日',
          update: ''
        },
        events: [],
        datesSet: this.datesSet,
        eventClick: this.handleEventClick,
        dateClick: this.handleDateClick,
        customButtons: {
          updateTime: {
            text: '--',
          },
          switch: {
            text: '切换显示',
            click: function() {

            }
          },
          refresh: {
            text: '刷新',
            click: null
          },
          todayDot: {
            text: '今天',
            click: null
          },
          selectedDot: {
            text: '已选',
            click: null
          },
          selector: {
            text: '更换门票',
            click: ()=>{this.handleShowSelector()}
          }
        },
        eventDates: [],
        emptyDate: [],
        unselectAuto: false,
        selectable: true,
        enableRefresh: true,
        enableSelect: true,
        isHoverEvent: true,
        select: this.handleSelect,
        unselect: this.handleUnselect,
        windowResize: this.handleWindowResize,
        eventMouseEnter: this.handleMouseEnter,
        extenalPaddingLeft: 0,
        dayCellClassNames: this.handleDayCellClassNames,
        dayCellDidMount: this.handleDayCellDidMount,
      }
    }
  },
  created() {
    this.calendarOptions.customButtons.refresh.click = () => this.refreshData()
    this.calendarOptions.enableRefresh = this.options.enableRefresh != undefined ? this.options.enableRefresh : true
    this.calendarOptions.enableSelect = this.options.enableSelect != undefined ? this.options.enableSelect : true
    this.calendarOptions.isHoverEvent = this.options.isHoverEvent != undefined ? this.options.isHoverEvent : true
    this.updateCalendarSize()
  },
  mounted() {
    this.timer = setInterval(this.refreshData, 60000)
    this.refreshData()
    this.addObserver()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.removeObserver()
  },
  computed: {
    selectLeft() {
      if (this.options.type === 'mini') {
        return '0'
      }
      return this.calendarOptions.enableRefresh ? '420px' : '330px'
    },
    updateDate() {
      const updateTime = this.options.ticketsData.time || this.options.ticketsData.dataGetDateTime
      return `${this.options.updateTitle} ${updateTime}`
    }
  },
  methods: {
    handleDayCellDidMount(arg) {
      if (this.calendarOptions.emptyDate.indexOf(getFullDateString(arg.date)) != -1) {
        if (arg.el.classList.contains(emptyDayClass)) {
          arg.el.classList.remove(emptyDayClass)
        }
      } else {
        if (!arg.el.classList.contains(emptyDayClass)) {
          arg.el.classList.add(emptyDayClass)
        }
      }
    },
    handleDayCellClassNames(arg) {
      if (this.calendarOptions.emptyDate.indexOf(getFullDateString(arg.date)) != -1) {
        arg.isOther = true
        arg.isEmpty = true
      }
    },
    handleMouseEnter(arg) {
      // console.log('handleMouseEnter')
      if (!this.isHoverEvent) {
        return
      }
      const extendedProps = arg.event._def.extendedProps
      if (extendedProps.isEmpty) {
        return
      }

      if (this.calendarOptions.type == 'mini') {

        for (let item of this.virtualStockData) {
          if (item.date != extendedProps.datetime) {
            continue
          }
          if (parseInt(item.privateStock) <= 0 && parseInt(item.commonStock) <= 0) {
            return
          }
          tippy(arg.el, {
            content: `余票：${parseInt(item.privateStock) <= 0 ? item.commonStock : item.privateStock}`
          });
          return
        }
        return
      }

      // if (extendedProps.stockOwnedAvailable == undefined || extendedProps.stockSharedAvailable == undefined) {
      //   return
      // }
      //
      // const tipContent = `<div class="tips-content">
      //                       <span>共享库存：${extendedProps.stockSharedAvailable}</span>
      //                       <span>独立库存：${extendedProps.stockOwnedAvailable}</span>
      //                      </div>`
      //
      // tippy(arg.el, {
      //   animation: 'scale',
      //   allowHTML: true,
      //   content: tipContent
      // });
    },
    selectedDate(date) {
      if (typeof date !== 'string') {
        return
      }
      const selectedDate = date.replace(/ [\s\S]*$/, '')
      this.userPreSelectedDateStr = !this.calendarOptions.events.length ? selectedDate : ''
      if (selectedDate == this.userSelectedDateStr) {
        return
      }
      if (!this.canSelectDate(selectedDate)) {
        return
      }
      this.userSelectedDateStr = selectedDate
      this.calendar.unselect()
      this.calendar.gotoDate(this.userSelectedDateStr)
      this.calendar.select(this.userSelectedDateStr)
    },
    canSelectDate(date) {
      const shouldSelectDate = date.replace(/T[\s\S]*$/, '')
      // if (new Date(shouldSelectDate).setHours(23, 59, 59, 0) < new Date().setHours(0, 0, 0, 0)) {
      //   // console.log('---canSelectDate false',date)
      //   return false
      // }
      // console.log('---canSelectDate ',shouldSelectDate,this.calendarOptions.eventDates)
      return this.calendarOptions.eventDates.indexOf(shouldSelectDate) != -1
    },
    handleWindowResize(arg) {
      // console.log('handleWindowResize')
      this.updateCalendarSize()
    },
    updateCalendarSize() {
      if (this.options.insetHeight > 0 && this.options.type == 'large') {
        this.calendarOptions.height = window.innerHeight - parseInt(this.options.insetHeight)
        this.render()
      }
      // console.log(this.options.insetHeight, this.calendarOptions.height)
    },
    handleUnselect(arg) {
      if (this.lastSelectedDayEl && this.lastSelectedDayEl.contains(userSelectedDayClass)) {
        this.lastSelectedDayEl.remove(userSelectedDayClass)
        this.lastSelectedDayEl = null
      }
    },
    handleSelect(arg) {
      // console.log('---handleSelect')
      const days = (arg.end - arg.start) / 86400 / 1000
      if (days > 1) {
        arg.view.calendar.unselect()
        return
      }
      if (!this.canSelectDate(arg.startStr)) {
        arg.view.calendar.unselect()
        return
      }
      const tags = document.getElementsByTagName('td')
      for (let item of tags) {
        if (item.dataset.date == arg.startStr) {
          let clsList = item.classList
          if (clsList.contains(userSelectedDayClass)) {
            return
          }
          clsList.add(userSelectedDayClass)
          this.lastSelectedDayEl = clsList
        }
      }
    },
    handleConfirmSelector() {
      const list = this.$refs.selectorView.callbackResult()
      this.isShowSelector = false
      this.handleChangedSelect(list[0], list[1], list[2])
    },
    handleChangedSelect(primaryKey, secondKey, thirdKey) {
      this.selectedProductPrimaryType = primaryKey
      this.selectedProductSecondType = secondKey
      this.selectedProductThirdType = thirdKey
      this.$emit('changeTicketCode', primaryKey, secondKey, thirdKey);
      this.updateEvents()
      if (this.options.isReloadIfChangedOptions) {
        this.$nextTick(()=>{
          this.reloadVirtualStock()
        })
      }
    },
    handleShowSelector() {
      // console.log('handleShowSelector')
      this.isShowSelector = true
    },
    handleClickToday() {
      this.calendar.today()
    },
    refreshData() {
      this.refreshFunc()
      if (this.options.isReloadStockIfRefresh) {
        this.reloadVirtualStock()
      }
    },
    clickRefreshData() {
      this.refreshData()
      this.reloadVirtualStock()
    },
    reloadVirtualStock() {
      // console.log('reloadVirtualStock')
      this.virtualParams = {}
      this.virtualStockData = []
      this.refreshVirtualStock(null)
    },
    refreshVirtualStock(info) {
      // console.log('refreshVirtualStock')
      if (!this.selectedProductPrimaryType) {
        return
      }
      const currentDate = getFullDateString(this.calendar.getDate())
      let endDate = ''

      const isStartRanged = isRangedDate(this.virtualParams.startAt, this.virtualParams.endAt, currentDate)
      let isEndRanged = true
      if (info) {
        endDate = getFullDateString(info.end)
        isEndRanged = isRangedDate(this.virtualParams.startAt, this.virtualParams.endAt, endDate)
        // console.log('--- isEndRanged', getFullDateString(info.end), info.end)
      }
      // console.log('---isRanged 0', isStartRanged, isEndRanged, this.virtualParams.startAt, this.virtualParams.endAt, this.virtualParams)
      if (isStartRanged && isEndRanged) {
        return
      }
      let startAt = ''
      let endAt = ''
      const startString = currentDate.replace(/[\d][\d]$/, '01')
      const endString = info ? endDate : startString
      if (!this.virtualParams.startAt) {
        startAt = appendDaysString(startString, -7)
        endAt = appendDaysString(currentDate, 83)
        // console.log('currentDate', currentDate, startAt,endAt)
        this.virtualParams.startAt = startAt
        this.virtualParams.endAt = endAt
      } else {
        if (isBeforeDate(startString, this.virtualParams.startAt)) {
          startAt = appendDaysString(startString, -7)
          endAt = appendDaysString(this.virtualParams.startAt, -1)
          this.virtualParams.startAt = startAt
        } else if (isAfterDate(endString, this.virtualParams.endAt)) {
          startAt = appendDaysString(this.virtualParams.endAt, 1)
          endAt = appendDaysString(this.virtualParams.endAt, 90)
          this.virtualParams.endAt = endAt
        } else {
          return
        }
      }
      // console.log('---isRanged 1',startAt, endAt, this.virtualParams.startAt, this.virtualParams.endAt, this.virtualParams)
      const params = {
        'startAt': startAt,
        'endAt': endAt,
        'category': this.selectedProductPrimaryType
      }
      this.virtualStockFunc(params)
    },
    datesSet (info) {
      this.calendar = info.view.calendar
      this.calendar.select(this.userSelectedDateStr)
      this.updateCalendarSize()
      this.$nextTick(()=> {
        this.refreshVirtualStock(info)
        // console.log('datesSet', info, this.calendar)
      })
    },
    handleClickDateFunc (dateString, data) {
      // console.log('handleClickDateFunc', dateString, data)
      const dateTime = dateString.replace(/ [\s\S]*$/, '')
      let originDateTime = data.originDateTime ? data.originDateTime : `${dateTime}T08:00:00`
      const params = {
        dateTime: dateTime,
        originDateTime: originDateTime,
        event: {...data, datetime: dateTime}
      }
      this.$emit('clickDate', params);
    },
    handleDateClick (arg) {
      // console.log('---handleDateClick')
      if (!this.canSelectDate(arg.dateStr)) {
        // console.log('!this.canSelectDate(arg.dateStr), return')
        return
      }

      this.userSelectedDateStr = arg.dateStr
      let c = arg.view.calendar.getEvents()
      for (let item of c) {
        if (item.startStr !== arg.dateStr) {
          continue
        }
        if (item.extendedProps.isAvailable) {
          this.handleClickDateFunc(this.userSelectedDateStr, item.extendedProps);
          return
        }
      }
      this.calendar.select(this.userSelectedDateStr)
      this.handleClickDateFunc(this.userSelectedDateStr, null);
    },
    handleEventClick (info) {
      // console.log('handleEventClick', info)
      this.userSelectedDateStr = info.event.startStr
      if (this.options.type === 'mini') {
        info.view.calendar.unselect()
        info.view.calendar.select(info.event.start)
      }
      let extendedProps = info.event.extendedProps
      if (!extendedProps.isAvailable) {
        return
      }
      this.calendar.select(this.userSelectedDateStr)
      this.handleClickDateFunc(this.userSelectedDateStr, extendedProps);
    },
    updateDataSource() {
      if (this.options.enableSelect != undefined) {
        this.enableSelect = this.enableSelect == null && this.options.type === 'large'
      } else {
        this.enableSelect = this.options.enableSelect
      }
      if (!this.options || !this.options.ticketsData || !this.options.ticketsData.options) {
        return
      }
      this.calendarOptions.type = this.options.type
      const updateTime = this.options.ticketsData.time || this.options.ticketsData.dataGetDateTime
      // this.calendarOptions.customButtons.updateTime.text = `${this.options.updateTitle} ${updateTime}`
      if (this.userPreSelectedDateStr && this.canSelectDate(this.userPreSelectedDateStr)) {
        this.selectedDate(this.userPreSelectedDateStr)
      }
      this.updateSelectType()
      this.updateEvents()
    },
    updateEvents() {
      const options = this.options.ticketsData.options
      if (!this.options.ticketsData.options[this.selectedProductPrimaryType]) {
        return
      }

      this.calendarOptions.events = [];
      const products = this.options.ticketsData.products[this.selectedProductThirdType.code]
      if (!products) {
        return
      }
      const [events, eventDates, emptyDate] = makeEvents(products, this.options, this.virtualStockData)
      this.calendarOptions.events = events
      this.calendarOptions.eventDates = eventDates
      this.calendarOptions.emptyDate = emptyDate

      // if (emptyDate.length > 0) {
      //   console.log('----updateEvents')
      //   // this.calendar.next()
      //   // this.calendar.prev()
      // }
    },
    makeTypeMap() {
      let map = {}
      Object.keys(this.options.typeMap).forEach((item)=>{
        map = {...map, ...this.options.typeMap[item]}
      })
      this.typeMap = map
      // console.log('makeTypeMap',map)
    },
    valueForType(type) {
      const value = this.typeMap[type]
      return value ? value : type
    },
    updateSelectCode(code) {
      const options = this.options.ticketsData.options
      for (const section of Object.keys(options)) {
        const sectionData = options[section]
        for (const subSection of Object.keys(sectionData)) {
          const subSectionData = sectionData[subSection]
          for (const item of subSectionData) {
            if (!code || code == item['code']) {
              this.selectedProductPrimaryType = section
              this.selectedProductSecondType = subSection
              this.selectedProductThirdType = item
              this.options.ticketCode = item.code
            }
          }
        }
      }
    },
    updateSelectType() {
      if (!this.options.ticketCode) {
        this.updateSelectCode('')
        return
      }
      if (this.options.ticketCode && this.selectedProductThirdType.code !=this.options.ticketCode) {
        this.updateSelectCode(this.options.ticketCode)
        return
      }
    },
    render() {
      if (!this.calendar) {
        return
      }
      this.calendar.render()
    },
    updateSelectorView(height) {
      // // const fixedHeight = `${parseInt(height) - 48}px`
      // const fixedHeight = `${parseInt(height) - 0}px`
      // let changeElement = document.querySelector('.observer-large-selector-view')
      // changeElement.style.height = fixedHeight
    },
    addObserver() {
      // let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      // let element = document.querySelector('.observer-large-calendar')
      // let height = getComputedStyle(element).getPropertyValue('height')
      // this.updateSelectorView(height)
      // this.observer = new MutationObserver((mutationList) => {
      //   let height = getComputedStyle(element).getPropertyValue('height')
      //   if (height === this.recordOldValue.height) return
      //   this.recordOldValue.height = height
      //   this.updateSelectorView(height)
      // })
      // this.observer.observe(element, { attributes: true, attributeFilter: ['style'], attributeOldValue: true })
    },
    removeObserver() {
      if (!this.observer) {
        return
      }
      this.observer.disconnect()
      this.observer.takeRecords()
      this.observer = null
    }
  },
  watch: {
    'options': function () {
      this.updateDataSource()
    },
    'options.ticketCode': function (value) {
      // console.log('this.options.ticketCode', this.options.ticketCode)
      if (typeof value !== 'string') {
        return
      }
      this.updateDataSource()
    },
    'options.ticketsData': function () {
      this.updateDataSource()
    },
    'options.virtualStockData': function () {
      this.$nextTick(()=> {
        this.virtualStockData = this.virtualStockData.concat(this.options.virtualStockData)
        // console.log('---this.virtualStockData', this.virtualStockData)
        this.updateEvents()
      })
    },
    'options.enableRefresh': function (value) {
      this.calendarOptions.enableRefresh = value
    },
    'options.enableSelect': function (value) {
      this.calendarOptions.enableSelect = value
    },
    'options.isHoverEvent': function (value) {
      this.calendarOptions.isHoverEvent = value
    },
    'options.typeMap': function () {
      // console.log('this.options.typeMap', this.options.typeMap)
      this.makeTypeMap()
      this.updateDataSource()
    },
    'calendarOptions.enableSelect': function (value) {

    },
    isShowSelector(val) {
      if (val) {
        this.$nextTick(()=>{
          this.$refs.selectorView.setupPresetCode(this.options.ticketCode)
        })
      }
    },
    selectedProductPrimaryType(newValue, oldValue) {
      // console.log('selectedProductPrimaryType',newValue, oldValue)
      if (newValue == oldValue) {
        return
      }
      // reload in func handleChangedSelect
      if (this.reloadVirtualStock) {
        return
      }
      this.$nextTick(()=>{
        this.reloadVirtualStock()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@media screen and (max-height: 768px), screen and (max-width: 1440px) {
  ._calendar-wrapper {
    .calendar-box {
      width: calc(100% - 320px) !important;
    }
    .miniCalendarBox {
      width: 100% !important;
    }
  }
}
._calendar-wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  .observer-large-selector-view {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    top: 0;
    right: -24px;
    bottom: 0;
    position: absolute;
  }
  .calendar-box {
    position: relative;
    z-index: 1;
    width: calc(100% - 450px);
  }
  .miniCalendarBox {
    width: 100% !important;
  }
  .select-box {
    position: absolute;
    display: flex;
    height: 40px;

    &.mini {
      width: 100%;
      justify-content: space-between;
      .product-type-box {
        margin-left: 0;
        .select-title {
          margin-right: 10px;
          font-size: 15px;
        }
      }
    }

    .product-type-box {
      margin-left: 20px;
      display: flex;
      .select-title {
        line-height: 40px;
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        margin-right: 30px;
      }
      .select-item {
        width: 160px;
        height: 40px;
      }
    }
  }
}
.dialog {
  position: fixed;
  left: auto;
}
.tips-content {
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: space-around;
}
.dialog-footer {
  margin: auto 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .button-cancel {
    width: 68px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #979797;
    display: flex;
    span {
      margin: auto;
      font-size: 14px;
      font-weight: 400;
      color: #7C7C7C;
      line-height: 20px;
    }
  }
  .button-confirm {
    width: 68px;
    height: 40px;
    background: #0486FE;
    border-radius: 4px;
    display: flex;
    margin: 0 0 0 16px;
    span {
      margin: auto;
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 20px;
      text-stroke: 1px #979797;
    }
  }
}
</style>
