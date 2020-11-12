<template>
  <div class="calendar-wrapper">
    <LargeCalendar v-if="options.type === 'large'" :options="calendarOptions"></LargeCalendar>
    <MiniCalendar v-if="options.type === 'mini'" :options="calendarOptions"></MiniCalendar>
  </div>
</template>

<script>
import LargeCalendar from './LargeCalendar';
import MiniCalendar from './MiniCalendar';
import {makeEvents} from './utils'
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
        type: ''
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
      lastSelectedDayEl: null,
      calendar: null,
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
        selectable: true,
        select: this.handleSelect,
        unselect: this.handleUnselect,
        windowResize: this.handleWindowResize,
      }
    }
  },
  created() {
    const that = this
    this.calendarOptions.customButtons.refresh.click = function() {
      that.refreshData();
    }
    this.updateCalendarSize()
  },
  mounted() {
    this.timer = setInterval(this.refreshData, 60000)
    this.refreshData();
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    selectedDate(date) {
      if (date == this.userSelectedDateStr) {
        return
      }
      this.userSelectedDateStr = date
      this.calendar.unselect()
      this.calendar.select(this.userSelectedDateStr)
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
      console.log(arg)
      const days = (arg.end - arg.start) / 86400 / 1000
      if (days > 1) {
        arg.view.calendar.unselect()
      }
    },
    refreshData() {
      this.refreshFunc()
    },
    datesSet (info) {
      console.log(info)
      this.calendar = info.view.calendar
    },
    handleDateClick (arg) {
      arg.view.calendar.unselect()
      this.userSelectedDateStr = arg.dateStr
      let c = arg.view.calendar.getEvents()
      for (let item of c) {
        if (item.startStr !== arg.dateStr) {
          continue
        }
        if (item.extendedProps.isAvailable) {
          this.$emit('clickDate', item.extendedProps);
          return
        }
      }
      this.$emit('clickDate', this.userSelectedDateStr);
      let clsList = arg.dayEl.classList
      if (clsList.contains(userSelectedDayClass)) {
        return
      }
      clsList.add(userSelectedDayClass)
      this.lastSelectedDayEl = clsList
    },
    handleEventClick (info) {
      arg.view.calendar.unselect()
      this.userSelectedDateStr = info.event.startStr
      if (this.options.type === 'mini') {
        info.view.calendar.unselect()
        info.view.calendar.select(info.event.start)
      }
      let extendedProps = info.event.extendedProps
      if (!extendedProps.isAvailable) {
        return
      }
      this.$emit('clickEvent', extendedProps);
    },
    updateDataSource() {
      if (!this.options || !this.options.ticketsData || !this.options.ticketCode) {
        return
      }
      this.calendarOptions.type = this.options.type
      const updateTime = this.options.ticketsData.time || this.options.ticketsData.dataGetDateTime
      this.calendarOptions.customButtons.updateTime.text = `${this.options.updateTitle} ${updateTime}`
      this.calendarOptions.events = [];
      const production = this.options.ticketsData.production.filter((item)=>{
        return item.baseProduct.code === this.options.ticketCode
      })[0]
      if (!production) {
        return
      }
      this.calendarOptions.events = makeEvents(production, this.options)
    },
  },
  watch: {
    'options': function () {
      this.updateDataSource()
    },
    'options.ticketCode': function () {
      this.updateDataSource()
    },
    'options.ticketsData': function () {
      this.updateDataSource()
    }
  }
}
</script>

<style lang="scss">
.calendar-wrapper {
  position: relative;
}
</style>
