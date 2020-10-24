<template>
  <div class="calendar-wrapper">
    <btg-calendar :options="calendarOptions"
                  :refresh-func="fetchTickets"
                  v-on:clickDate="clickEvent"
                  v-on:clickEvent="clickEvent"></btg-calendar>
  </div>
</template>

<script>
import BtgCalendar from '../src/btg-calendar';
import mockData from './mockData'

export default {
  name: 'app',
  components: {BtgCalendar},
  data() {
    return {
      calendarOptions: {
        ticketsData: {},
        ticketCode: 'xxxxx',
        updateTitle: '最后更新时间',
        priceColor: [
          {
            value: 99999999,  // 实际数量小于value就显示value的color
            type: 'price' // 可以设置type
          }
        ],
        availableColor: [
          {
            value: 100,
            type: 'low'
          },
          {
            value: 1000,
            backgroundColor: '#FEF0F0', // 或者自定义颜色
            borderColor: '#FBC4C4',
            textColor: '#FF6F5B',
          },
          {
            value: 99999999,
            backgroundColor: '#ECF8F2',
            borderColor: '#97D2B4',
            textColor: '#42B983',
          },
        ]
      }
    }
  },
  created() {
  },
  methods: {
    fetchTickets() {
      setTimeout(()=>{
        const mock = mockData.data
        this.calendarOptions.ticketsData = mock
      }, 500)
    },
    clickEvent(event) {

    },
    clickDate(date) {

    }
  }
}
</script>

<style lang="scss">

.calendar-wrapper {
  width: 1200px;
  height: 800px;
}

</style>
