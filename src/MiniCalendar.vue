<template>
  <div class="mini-calendar-wrapper">
    <FullCalendar ref="fullCalendar"
                  :options="calendarOptions"
                  class="mini-calendar"
                  :class="{enableSelect: options.enableSelect}"></FullCalendar>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export default {
  name: 'MiniCalendar',
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
        enableSelect: null,
      }
    },
    refreshFunc: Function,
    // showSelectorFunc: Function
  },
  components: {
    FullCalendar
  },
  data () {
    return {
      timer: null,
      isHoverEvent: true,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        buttonText: {
          today: 'Today',
        },
        events: [],
        headerToolbar: {
          left:   'prev title next',
          center: 'todayDot selectedDot',
          right:  'today selector'
        },
        // customButtons: {
        //   selector: {
        //     text: '更换门票',
        //     click: ()=>{this.showSelectorFunc()}
        //   }
        // },
        dayCellContent: this.handleDayCellContent,
      },
    }
  },
  created() {
    this.calendarOptions = {
      ...this.calendarOptions,
      ...this.options
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    handleDayCellContent(arg) {
      let date = arg.dayNumberText.replace(/[^0-9]/ig,"")
      date = ('0' + date).slice(-2)
      if (Number(date) !== 1) {
        arg.dayNumberText = date
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
      // console.log('options.height', value)
      if (value > 0) {
        this.calendarOptions.height = value
      }
    },
    'calendarOptions.height': function (value) {
      // console.log('calendarOptions.height', value)
    },
    'options.enableSelect': function (value) {
      this.calendarOptions.enableSelect = value
    },
    'calendarOptions.enableSelect': function (value) {
      this.calendarOptions.headerToolbar.right = value ? 'today selector' : 'today'
    },
  }
}
</script>

<style lang="scss">
@import "miniStyle";
</style>
