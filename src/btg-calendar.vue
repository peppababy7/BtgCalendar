<template>
  <div class="calendar-wrapper">
    <div class="calendar-box">
      <div class="select-box" v-if="calendarOptions.enableSelect" ref="aaa" :class="{mini: options.type == 'mini'}" :style="{left: selectLeft}">
        <div class="product-type-box">
          <span class="select-title">商品类型</span>
          <el-select v-model="selectedProductType" placeholder="请选择" class="select-item">
            <el-option
                v-for="item in productTypes"
                :key="item.value"
                :label="valueForType(item.label)"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="product-type-box">
          <span class="select-title">旅客类型</span>
          <el-select v-model="selectedPersonalType" placeholder="请选择" class="select-item">
            <el-option
                v-for="item in personalTypes"
                :key="item.value"
                :label="valueForType(item.label)"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <LargeCalendar v-if="options.type === 'large'" :options="calendarOptions"></LargeCalendar>
      <MiniCalendar v-if="options.type === 'mini'" :options="calendarOptions"></MiniCalendar>
    </div>
  </div>
</template>

<script>
import LargeCalendar from './LargeCalendar';
import MiniCalendar from './MiniCalendar';
import {makeEvents} from './utils'
import tippy from 'tippy.js';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';
import {getFullDateString} from './utils'

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
        typeMap: {}
      }
    },
    refreshFunc: Function
  },
  components: {
    LargeCalendar,
    MiniCalendar
  },
  data () {
    return {
      timer: null,
      userSelectedDateStr: '',
      userPreSelectedDateStr: '',
      lastSelectedDayEl: null,
      calendar: null,
      isHoverEvent: true,
      productTypes: [],
      personalTypes: [],
      selectedProductType: '',
      selectedPersonalType: '',
      enableSelect: null,
      typeMap: {},
      calendarOptions: {
        // plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
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
    const that = this
    this.calendarOptions.customButtons.refresh.click = function() {
      that.refreshData();
    }
    this.calendarOptions.enableRefresh = this.options.enableRefresh != undefined ? this.options.enableRefresh : true
    this.calendarOptions.enableSelect = this.options.enableSelect != undefined ? this.options.enableSelect : true
    this.calendarOptions.isHoverEvent = this.options.isHoverEvent != undefined ? this.options.isHoverEvent : true
    this.updateCalendarSize()
  },
  mounted() {
    this.timer = setInterval(this.refreshData, 60000)
    this.refreshData();
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  computed: {
    selectLeft() {
      if (this.options.type === 'mini') {
        return '0'
      }
      return this.calendarOptions.enableRefresh ? '420px' : '330px'
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
      if (!this.isHoverEvent) {
        return
      }
      const extendedProps = arg.event._def.extendedProps
      if (extendedProps.isEmpty) {
        return
      }

      if (this.calendarOptions.type == 'mini') {
        tippy(arg.el, {
          content: arg.event._def.title
        });
        return
      }

      if (extendedProps.stockOwnedAvailable == undefined || extendedProps.stockSharedAvailable == undefined) {
        return
      }

      const tipContent = `<div class="tips-content">
                            <span>共享库存：${extendedProps.stockSharedAvailable}</span>
                            <span>独立库存：${extendedProps.stockOwnedAvailable}</span>
                           </div>`

      tippy(arg.el, {
        animation: 'scale',
        allowHTML: true,
        content: tipContent
      });
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
      if (new Date(shouldSelectDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        return false
      }
      return this.calendarOptions.eventDates.indexOf(shouldSelectDate) != -1
    },
    handleWindowResize(arg) {
      this.updateCalendarSize()
    },
    updateCalendarSize() {
      if (this.options.insetHeight > 0) {
        this.calendarOptions.height = window.innerHeight - parseInt(this.options.insetHeight)
      }
    },
    handleUnselect(arg) {
      if (this.lastSelectedDayEl && this.lastSelectedDayEl.contains(userSelectedDayClass)) {
        this.lastSelectedDayEl.remove(userSelectedDayClass)
        this.lastSelectedDayEl = null
      }
    },
    handleSelect(arg) {
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
    refreshData() {
      this.refreshFunc()
    },
    datesSet (info) {
      this.calendar = info.view.calendar
      this.calendar.select(this.userSelectedDateStr)
    },
    handleClickDateFunc (dateString, data) {
      const params = {
        dateTime: dateString.replace(/ [\s\S]*$/, ''),
        event: data
      }
      this.$emit('clickDate', params);
    },
    handleDateClick (arg) {
      if (!this.canSelectDate(arg.dateStr)) {
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

      if (!this.options || !this.options.ticketsData) {
        return
      }
      this.calendarOptions.type = this.options.type
      const updateTime = this.options.ticketsData.time || this.options.ticketsData.dataGetDateTime
      this.calendarOptions.customButtons.updateTime.text = `${this.options.updateTitle} ${updateTime}`
      if (this.userPreSelectedDateStr && this.canSelectDate(this.userPreSelectedDateStr)) {
        this.selectedDate(this.userPreSelectedDateStr)
      }
      this.updateSelectType()
      this.updateEvents()
    },
    updateEvents() {
      const options = this.options.ticketsData.options
      if (!this.options.ticketsData.options[this.selectedProductType]) {
        return
      }
      const personalTypes = options[this.selectedProductType].map((item)=>{
        return item['code']
      })
      if (personalTypes.indexOf(this.selectedPersonalType) == -1) {
        return
      }

      this.calendarOptions.events = [];
      const products = this.options.ticketsData.products[this.selectedPersonalType]
      if (!products) {
        return
      }
      const [events, eventDates, emptyDate] = makeEvents(products, this.options)
      this.calendarOptions.events = events
      this.calendarOptions.eventDates = eventDates
      this.calendarOptions.emptyDate = emptyDate

      if (emptyDate.length > 0) {
        this.calendar.next()
        this.calendar.prev()
      }
    },
    makeTypeMap() {
      let map = {}
      Object.keys(this.options.typeMap).forEach((item)=>{
        map = {...map, ...this.options.typeMap[item]}
      })
      this.typeMap = map
    },
    valueForType(type) {
      const value = this.typeMap[type]
      return value ? value : type
    },
    updateSelectType() {
      const options = this.options.ticketsData.options
      const productTypes = Object.keys(options).map((item)=>{
        return {
          value: item,
          label: item,
        }
      })
      this.productTypes = productTypes

      if (this.options.ticketCode && this.selectedPersonalType !=this.options.ticketCode) {
        for (const item of productTypes) {
          for (const subItem of options[item.value]) {
            if (subItem.code === this.options.ticketCode) {
              this.selectedProductType = item.value
              this.selectedPersonalType = subItem.code
            }
          }
        }
      }

      let isMatchProduct = false
      for (const item of productTypes) {
        if (item.value === this.selectedProductType) {
          isMatchProduct = true
          break
        }
      }

      if (!isMatchProduct) {
        this.selectedProductType = productTypes[0].value
      }

      this.updatePersonalType()
    },
    updatePersonalType() {
      const options = this.options.ticketsData.options
      let isSamePersonalTypes = false
      const personalTypes = options[this.selectedProductType].map((item)=>{
        if (item['code'] == this.selectedPersonalType) {
          isSamePersonalTypes = true
        }
        return {
          value: item['code'],
          label: item['type']
        }
      })
      this.personalTypes = personalTypes
      if (!isSamePersonalTypes) {
        this.selectedPersonalType = personalTypes[0].value
        this.options.ticketCode = this.selectedPersonalType
      }
    },
    render() {
      this.calendar.render()
    }
  },
  watch: {
    'options': function () {
      this.updateDataSource()
    },
    'options.ticketCode': function (value) {
      if (typeof value !== 'string') {
        return
      }
      this.updateDataSource()
    },
    'options.ticketsData': function () {
      this.updateDataSource()
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
      this.makeTypeMap()
      this.updateDataSource()
    },
    'calendarOptions.enableSelect': function (value) {

    },
    selectedPersonalType(value) {
      let personal = ''
      this.personalTypes.forEach((item)=>{
        if (item.value == value) {
          personal = item.label
        }
      })
      if (value) {
        this.$emit('changeTicketCode', this.selectedPersonalType, this.selectedProductType, personal);
      }
      this.updateEvents()
    },
    selectedProductType(value) {
      this.updatePersonalType()
    }
  }
}
</script>

<style lang="scss">
.calendar-wrapper {
  position: relative;

  .calendar-box {
    position: relative;
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
</style>

<style>
.tips-content {
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: space-around;
}
</style>
