<template>
  <div class="calendar-wrapper">
    <btg-calendar :options="calendarOptions"
                  :refresh-func="fetchTickets"
                  v-on:clickDate="clickDate"
                  v-on:clickEvent="clickEvent"></btg-calendar>
  </div>
</template>

<script>
// import BtgCalendar from '../dist/btg-calendar.min';
import BtgCalendar from '../src/btg-calendar';
import mockData from './mockData'

export default {
  name: 'app',
  components: {BtgCalendar},
  data() {
    return {
      calendarOptions: {
        type: 'mini', // [large, mini]
        ticketsData: {},
        ticketCode: 'xxxxx',
        updateTitle: '最后更新时间：',
        // 如果需要设置日历高度跟随窗口高度，则需要设置，如要实现window.innerHeight - 90px，就设置90,
        // 如果不需要就不设置或设置0
        // 但是如果屏幕高度过低，则有优先保证可以显示完全日历
        // insetHeight: 90,
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
      // 点击事件，返回数据格式
      // datetime: "2020-10-24"
      // ...baseProduct.stocks 里的字段
      // value: 99999999  value 不用理会，是calendarOptions里设置的值
      console.log(event)
    },
    clickDate(event) {
      // 如果没有事件，返回数据格式 2020-10-24
      // 如果有事件，返回数据格式同直接点击门票事件
      console.log(event)
    }
  }
}
</script>

<style lang="scss">

.calendar-wrapper {
  width: 460px;
  height: 300px;
}

</style>
