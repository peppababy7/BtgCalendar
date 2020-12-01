<template>
  <div class="calendar-wrapper">
    <btg-calendar ref="calendar"
                  :options="calendarOptions"
                  :refresh-func="fetchTickets"
                  v-on:clickDate="clickDate"></btg-calendar>
  </div>
</template>

<script>
import BtgCalendar from '../src/btg-calendar';
import {mockData0} from './mockData'

export default {
  name: 'app',
  components: {BtgCalendar},
  data() {
    return {
      calendarOptions: {
        type: 'large', // [large, mini]
        ticketsData: {},
        ticketCode: 'CODE0', // 需要匹配的code，可以随时设置，日历会试试刷新
        updateTitle: '最后更新时间：', // 右上角刷新文案自定义，目前60s自动刷新
        // 如果需要设置日历高度跟随窗口高度，则需要设置，如要实现window.innerHeight - 90px，就设置90,
        // 如果不需要就不设置或设置0
        // 但是如果屏幕高度过低，则有优先保证可以显示完全日历
        // insetHeight: 90,
        priceColor: [
          {
            value: -1,  // -1 会解析成无穷大，或者设置一个合适的阈值，实际数量小于value就显示value的color
            type: 'price' // 可以设置type， 预设 price，如果不满足则自定义颜色
          }
        ],
        //
        availableColor: [
          {
            value: 100, // 颜色阈值
            type: 'low' // 颜色type，预设三种颜色 low mid high
          },
          {
            value: 1000,
            backgroundColor: '#FDF6EC', // 如果不满足则自定义颜色
            borderColor: '#F5DAB1',
            textColor: '#E7A75E',
          },
          {
            value: -1, // -1 会解析成无穷大，或者设置一个合适的阈值
            backgroundColor: '#ECF8F2',
            borderColor: '#97D2B4',
            textColor: '#42B983',
          },
        ],
        enableSelect: true, // 是否需要条件选择器
        isHoverEvent: true // 鼠标移动到日期上，如果有事件，是否需要显示，default true
      }
    }
  },
  created() {
  },
  mounted() {
    // 设置选定日期
    this.$refs.calendar.selectedDate('2020-12-15 10:30')
    setTimeout(()=>{
      this.$refs.calendar.selectedDate('2020-12-19')
    }, 700)
  },
  methods: {
    fetchTickets() {
      console.log('fetchTickets')
      setTimeout(()=>{
        const mock = mockData0.data
        this.calendarOptions.ticketsData = mock
      }, 500)
    },
    clickDate(event) {
      // 点击日期，返回数据格式
      // {
      //   datetime: "2020-10-24",
      //   event: ...baseProduct.stocks 里的字段 ,如果当天没有信息，就无数据
      // }
      console.log(event)
    }
  }
}
</script>

<style lang="scss">

.calendar-wrapper {
  width: 1200px;
  height: 600px;
}

</style>
