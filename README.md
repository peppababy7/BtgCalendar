# btg-calendar

> btg calendar components

## Build Setup

``` bash
# install dependencies

By NPM

npm i --save git+https://github.com/peppababy7/BtgCalendar.git#development

By Yarn

yarn add git+https://git@github.com/peppababy7/BtgCalendar.git#development

npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## How to use

目前实现了每分钟刷新

```
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
// 点击日期，返回数据格式 2020-10-24

clickEvent(可选) 点击门票事件
// 点击门票事件，返回数据格式
// datetime: "2020-10-24"
// isAvailable: true
// ...baseProduct.stocks 里的字段
// value: 99999999  value 不用理会，是calendarOptions里设置的值

```

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

import BtgCalendar from '@btg-calendar/src/btg-calendar'

export default {
  components: {
    BtgCalendar
  },
  data() {
    return {
      calendarOptions: {
        ticketsData: {}, // api返回的数据
        ticketCode: 'xxxxxx', // 需要展示的票类型
        updateTitle: '最后更新时间', // 需要自己定义更新文字
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
    clickDate(date) {
      // 点击日期，返回数据格式 2020-10-24
      console.log(date)
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
