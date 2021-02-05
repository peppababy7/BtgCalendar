[![NPM version](https://img.shields.io/npm/v/btgcalendar.svg)](https://www.npmjs.com/package/btgcalendar)


# btg-calendar

> btg calendar components

## Build Setup

``` bash
# install dependencies

By NPM

npm i --save btgcalendar

By Yarn

yarn add btgcalendar

npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## How to use

支持 `large` `mini` 两种样式，每分钟刷新、选中高亮、鼠标hover等

```
import BtgCalendar from "btgcalendar"

>api

// 设置选定日期
calendar.selectedDate('2020-11-19')

>required 

options(必要) 设置一个配置源，具体参数参考下面demo
color 可以自定义，或者设置type(包括 price low mid high): 
{
  value: 100,
  type: 'low' // 可以设置type
},
{
  value: 1000,
  backgroundColor: '#FEF0F0', // 或者自定义颜色
  borderColor: '#FBC4C4',
  textColor: '#FF6F5B',
},

refresh-func(必要) 设置一个刷新数据的func

> optional


clickDate(可选) 点击日期会调
// 点击日期，
如果没有事件，返回数据格式 2020-10-24
如果有事件，返回数据格式同直接点击门票事件

clickEvent(可选) 点击门票事件
// 点击门票事件，返回数据格式
// datetime: "2020-10-24"
// isAvailable: true
// ...baseProduct.stocks 里的字段
// value: 99999999  value 不用理会，是calendarOptions里设置的值

```
Tips:

>为了方便使用，目前 clickDate clickEvent 均会返回相同的事件。但如果点击日期没有事件，则只会回调 clickDate

>type: 'large'
正常模式，全尺寸日历

>type: 'mini'
mini模式，缩小显示，鼠标hover实现显示日期信息，支持选中模式。

> 如果需要更新size调用
> this.$refs.calendar.render()

>DEMO
```
<template>
    // 包裹一层div，自定义宽高，默认是100%
  <div class="calendar-wrapper">
    <btg-calendar :options="calendarOptions"
                  :refresh-func="fetchTickets"
                  v-on:clickDate="clickDate"
                  :clickDate="clickDate"
                  :changeTicketCode="changeTicketCode"></btg-calendar>
  </div>
</template>

<script>

import BtgCalendar from "btg-calendar"

export default {
  name: 'app',
  components: {BtgCalendar},
  data() {
    return {
      calendarOptions: {
        type: 'mini', // [large, mini]
        ticketsData: {},
        // 需要匹配的code，可以随时设置，日历会实时刷新，若匹配不到或传空，则会尝试匹配第一个
        ticketCode: 'CODE0', 
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
            backgroundColor: '#FEF0F0', // 如果不满足则自定义颜色
            borderColor: '#FBC4C4',
            textColor: '#FF6F5B',
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
        isFloatSelector: false // 筛选浮动
      }
    }
  },
  created() {
  },
  mounted() {
    // 设置选定日期
    this.$refs.calendar.selectedDate('2021-01-19')
    setTimeout(()=>{
      this.$refs.calendar.selectedDate('2021-01-15')
    }, 500)

    setTimeout(()=>{
      this.calendarOptions.ticketCode = 'CODE2'
    }, 2000)

    // 如果需要更新size调用
    // this.$refs.calendar.render()
  },
  methods: {
    fetchTickets() {
      setTimeout(()=>{
        this.calendarOptions.ticketsData = mockData0.data
        this.calendarOptions.typeMap = mockTypeMap
      }, 500)
    },
    clickDate(event) {
      // 点击日期，返回数据格式
      // {
      //   datetime: "2020-10-24",
      //   event: ...baseProduct.stocks 里的字段 ,如果当天没有票务信息，就无数据
      // }
      console.log(event)
    },
    changeTicketCode(value) {
      /**
       * 返回当前切换的类型
       **/
      console.log(value)
    }
  }
}

<style scoped>
// 包裹一层div，自定义宽高
.calendar-wrapper {
  width: 1000px;
  height: 800px;
}
</style>

```
