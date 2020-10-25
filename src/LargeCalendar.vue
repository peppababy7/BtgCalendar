<template>
  <div>
    <FullCalendar ref="fullCalendar" :options="calendarOptions"></FullCalendar>
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
        ]
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
          left:   'prev title next today switch refresh',
          center: '',
          right:  'updateTime'
        },
      }
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
@import "largeStyle";
</style>
