<template>
  <div class="large-calendar-wrapper">
    <FullCalendar class="large-calendar" ref="fullCalendar" :options="calendarOptions"></FullCalendar>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export default {
  name: 'LargeCalendar',
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
        enableRefresh: false, // 是否需要刷新按钮， default true
        enableSelect: false, // 是否需要条件选择器， default true
        isHoverEvent: false, // 鼠标移动到日期上，如果有事件，是否需要显示，default true
      }
    },
    refreshFunc: Function
  },
  components: {
    FullCalendar
  },
  data () {
    return {
      timer: null,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        // buttonText: {
        //   // today: '今日',
        //   // update: ''
        // },
        events: [],
        headerToolbar: {
          left:   '',
          center: 'prev title next',
          right:  ''
        },
        // customButtons: {
        //   refresh: {
        //     text: '刷新',
        //     click: ()=>{this.refreshFunc()}
        //   }
        // },
        dayCellContent: this.handleDayCellContent,
      }
    }
  },
  created() {
    this.calendarOptions = {
      ...this.calendarOptions,
      ...this.options
    }
    // this.updateRefreshButton()
  },
  mounted() {
    // $(".fc-refresh-button").append('<div class="select-box">dadsa</div>')
  },
  beforeDestroy() {
  },
  methods: {
    // updateRefreshButton() {
    //   if (this.options.enableRefresh && this.calendarOptions.headerToolbar.left.indexOf('refresh') == -1) {
    //     this.calendarOptions.headerToolbar.left = this.calendarOptions.headerToolbar.left + ' refresh'
    //     return
    //   }
    //   if (!this.options.enableRefresh && this.calendarOptions.headerToolbar.left.indexOf('refresh') != -1) {
    //     this.calendarOptions.headerToolbar.left = this.calendarOptions.headerToolbar.left.replace(' refresh', '')
    //     return
    //   }
    // },
    handleDayCellContent(arg) {
      let date = arg.dayNumberText.replace(/[^0-9]/ig,"")
      date = ('0' + date).slice(-2)
      if (Number(date) !== 1) {
        arg.dayNumberText = `${date}日`
        return
      }
      const day = ('0' + date).slice(-2)
      const month = arg.date.getMonth() + 1
      arg.dayNumberText = `${month}月${day}日`
    }
  },
  watch: {
    'options.events': function (value) {
      this.calendarOptions = {
        ...this.calendarOptions,
        ...this.options
      }
    },
    'options.height': function (value) {
      if (value > 0) {
        this.calendarOptions.height = value
      }
    },
    // 'options.enableRefresh': function (value) {
    //   console.log('123123', value)
    //   this.updateRefreshButton()
    // },
  }
}
</script>

<style lang="scss">
@import "largeStyle";
</style>
