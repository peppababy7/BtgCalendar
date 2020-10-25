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

export default {
  name: 'BtgCalendar',
  props: {
    options: {
      type: Object,
      default: {
        ticketsData: {},
        ticketCode: '',
        updateTitle: '',
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
        selectedDate: '',
        selectable: true,
        select: this.handleSelect,
        unselect: this.handleUnselect,
      }
    }
  },
  created() {
    const that = this
    this.calendarOptions.customButtons.refresh.click = function() {
      that.refreshData();
    }
  },
  mounted() {
    this.timer = setInterval(this.refreshData, 60000)
    this.refreshData();
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleUnselect(arg) {
      console.log(arg)
    },
    handleSelect(arg) {
      console.log(arg)
    },
    refreshData() {
      this.refreshFunc()
    },
    datesSet (info) {

    },
    handleDateClick (arg) {
      this.selectedDate = arg.dateStr
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
      let dateString = arg.dateStr
      this.$emit('clickDate', dateString);
    },
    handleEventClick (info) {
      this.selectedDate = info.event.startStr
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
      this.calendarOptions.customButtons.updateTime.text = `${this.options.updateTitle}：${this.options.ticketsData.time}`
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
