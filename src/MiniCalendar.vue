<template>
  <div class="mini-calendar-wrapper">
    <FullCalendar ref="fullCalendar" :options="calendarOptions"></FullCalendar>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import tippy from "tippy.js";
import 'tippy.js/dist/tippy.css';

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
        buttonText: {
          today: '今日',
          update: ''
        },
        events: [],
        headerToolbar: {
          left:   'today',
          center: 'prev title next',
          right:  'todayDot selectedDot'
        },
        dayCellContent: this.handleDayCellContent,
        eventMouseEnter: this.handleMouseEnter,
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
    handleMouseEnter(arg) {
      console.log(arg)
      tippy(arg.el, {
        content: arg.event._def.title
      });
    },
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
  }
}
</script>

<style lang="scss">
@import "miniStyle";
</style>
