<template>
  <div class="calendar-wrapper">
    <btg-calendar ref="calendar"
                  :options="calendarOptions"
                  :refresh-func="fetchTickets"
                  :virtual-stock-func="fetchVirtualStock"
                  v-on:clickDate="clickDate"
                  v-on:changeTicketCode="changeTicketCode"></btg-calendar>
  </div>
</template>

<script>
import BtgCalendar from '../src/btg-calendar';
import {mockData0, mockTypeMap, mockEvents} from './mockData'

export default {
  name: 'app',
  components: {BtgCalendar},
  data() {
    return {
      calendarOptions: {
        type: 'large', // [large, mini]
        ticketsData: {},
        // 需要匹配的code，可以随时设置，日历会实时刷新，若匹配不到或传空，则会尝试匹配第一个
        ticketCode: '',
        updateTitle: '最后更新时间：', // 右上角刷新文案自定义，目前60s自动刷新
        // 如果需要设置日历高度跟随窗口高度，则需要设置，如要实现window.innerHeight - 90px，就设置90,
        // 如果不需要就不设置或设置0
        // 但是如果屏幕高度过低，则有优先保证可以显示完全日历
        insetHeight: 100,
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
        enableRefresh: true, // 是否需要刷新按钮， default true
        enableSelect: true, // 是否需要条件选择器， default true
        isHoverEvent: true, // 鼠标移动到日期上，如果有事件，是否需要显示，default true
        typeMap: {}, // 类型map做key映射，可不传,
        virtualStockData: [],
        isFloatSelector: false // 筛选浮动
      }
    }
  },
  created() {
  },
  mounted() {
    // 设置选定日期
    // this.$refs.calendar.selectedDate('2021-01-15 10:30')
    // setTimeout(()=>{
    //   this.$refs.calendar.selectedDate('2021-02-19')
    // }, 700)
    //
    this.calendarOptions.ticketCode = 'CODE2'
    this.calendarOptions.typeMap = mockTypeMap

    // setTimeout(()=>{
    //   this.calendarOptions.ticketCode = 'CODE2'
    //   this.calendarOptions.typeMap = mockTypeMap
    // }, 100)

    // 如果需要更新size调用
    // this.$refs.calendar.render()
  },
  methods: {
    fetchVirtualStock(params) {
      console.log('fetchVirtualStock', params)
      setTimeout(()=>{
        this.calendarOptions.virtualStockData = JSON.parse(JSON.stringify(mockEvents))
      }, 500)
    },
    fetchTickets() {
      console.log('fetchTickets')
      setTimeout(()=>{
        this.calendarOptions.ticketsData = mockData0.data
        // this.calendarOptions.ticketCode = 'CODE2'
      }, 500)
    },
    clickDate(event) {
      // 点击日期，返回数据格式
      // {
      //   datetime: "2020-10-24",
      //   event: ...baseProduct.stocks 里的字段 ,如果当天没有信息，就无数据
      // }
      console.log(event)
    },
    changeTicketCode(primaryKey, secondKey, thirdData) {
      /**
       * 返回当前切换的类型
       **/
      console.log(primaryKey, secondKey, thirdData)
      this.calendarOptions.ticketCode = thirdData.code
    }
  }
}
</script>

<style lang="scss">

.calendar-wrapper {
  //width: 1200px;
  //height: 600px;
  //padding: 24px;

  // mini
  //width: 490px;
  //height: 410px;

  // large
  height: calc(100% - 500px);
  min-height: 370px;
}

</style>
