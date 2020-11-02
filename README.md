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

目前实现了每分钟刷新

```
import BtgCalendar from "btg-calendar"

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


>DEMO
```
<template>
    // 包裹一层div，自定义宽高，默认是100%
  <div class="calendar-wrapper">
    <btg-calendar :options="calendarOptions"
                  :refresh-func="fetchTickets"
                  v-on:clickDate="clickDate"
                  v-on:clickEvent="clickEvent"></btg-calendar>
  </div>
</template>

<script>

import BtgCalendar from "btg-calendar"

export default {
  components: {
    BtgCalendar
  },
  data() {
    return {
      calendarOptions: {
        type: 'large', // 视图类型[large, mini]
        ticketsData: {}, // api返回的数据
        ticketCode: 'xxxxxx', // 需要展示的票类型
        updateTitle: '最后更新时间：', // 需要自己定义更新文字
        // 如果需要设置日历高度跟随窗口高度，则需要设置，如要实现window.innerHeight - 90px，就设置90,
        // 如果不需要就不设置或设置0
        // 但是如果屏幕高度过低，则有优先保证可以显示完全日历
        // insetHeight: 0,
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
  methods: {
    // 方法名自定,实现一个 fetch data func
    fetchTickets() {
      yourRequest.then(response => {
        console.log(response.data)
        // 只要赋值就可以
        this.calendarOptions.ticketsData = response.data
      })
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
    }
  }
}
</script>

<style scoped>
// 包裹一层div，自定义宽高
.calendar-wrapper {
  width: 1000px;
  height: 800px;
}
</style>

```
