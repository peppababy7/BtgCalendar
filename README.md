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

Support `large` `mini` two styles, refresh every minute, select highlight, mouse hover, etc.

```
import BtgCalendar from "btgcalendar"

>api

// set selected date
calendar.selectedDate('2020-11-19')

>required

options (necessary) set a configuration source, the specific parameters refer to the following demo
Color can be customized, or set type (including price low mid high):
{
  value: 100, // color threshold
  type: 'low' // Color type, preset three colors low mid high
},
{
  value: 1000,
  backgroundColor: '#FEF0F0', // Customize color if not satisfied
  borderColor: '#FBC4C4',
  textColor: '#FF6F5B',
},

refresh-func (required) set a func to refresh data

> optional


clickDate (optional) click on the date will be adjusted
// click date,
If there is no event, return data format 2020-10-24
If there is an event, the returned data format is the same as the direct click ticket event

clickEvent (optional) Click on the ticket event
// Click on the ticket event and return the data format
// datetime: "2020-10-24",
// isAvailable: true,
// ...baseProduct.stocks, fields in
// value: 99999999,  value is ignored, it is the value set in calendarOptions

```
Tips:

>For convenience, clickDate and clickEvent will return the same event at present. But if there is no event on click date, only clickDate will be called back

>type: 'large'
Normal mode, full size calendar

>type: 'mini'
Mini mode, zoom out display, mouse hover to display date information, support selection mode.

> If need update size call
> this.$refs.calendar.render()

>DEMO
```
<template>
<!--  Wrap a layer of div, custom width and height, the default is 100%-->
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
        // The code that needs to be matched can be set at any time, and the calendar will be refreshed in real time. If it cannot be matched or passed empty, it will try to match the first one
        ticketCode: '',
        updateTitle: 'Last updated:', // Refresh copywriting customization in the upper right corner, currently 60s automatically refresh
        // If you need to set the calendar height to follow the window height, you need to set it. If you want to achieve window.innerHeight - 90px, set 90,
        // Do not set or set 0 if not required
        // But if the screen height is too low, there is a priority guarantee that the full calendar can be displayed
        insetHeight: 100,
        priceColor: [
          {
            value: -1,  // -1 It will be parsed into infinity, or set an appropriate threshold, and the color of value will be displayed if the actual number is less than value
            type: 'price' // You can set the type, preset price, and customize the color if it is not satisfied
          }
        ],
        //
        availableColor: [
          {
            value: 100, // color threshold
            type: 'low' // Color type, preset three colors low mid high
          },
          {
            value: 1000,
            backgroundColor: '#FDF6EC', // Customize color if not satisfied
            borderColor: '#F5DAB1',
            textColor: '#E7A75E',
          },
          {
            value: -1, // -1 will resolve to infinity, or set a suitable threshold
            backgroundColor: '#ECF8F2',
            borderColor: '#97D2B4',
            textColor: '#42B983',
          },
        ],
        enableRefresh: true, // Do you need a refresh button， default true
        enableSelect: true, // Whether conditional selector is required， default true
        isHoverEvent: true, // When the mouse moves to the date, if there is an event, whether it needs to be displayed，default true
        typeMap: {}, // Type map for key mapping, can not be passed,
        virtualStockData: [],
        isFloatSelector: false, // filter float,
        customSelectorSectionNames: ['section000', 'section111', 'section222']
      }
    }
  },
  created() {
  },
  mounted() {
    // set selected date
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

    // If need update size call
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
      // Click on the date to return to the data format
      // {
      //   dateTime: "2020-10-24",
      //   event: ...baseProduct.stocks, In the field, if there is no information on the day, there will be no data
      // }
      console.log(event, '/n', event.event.originDateTime,)
    },
    changeTicketCode(primaryKey, secondKey, thirdData) {
      /**
       * Returns the type of the current toggle
       **/
      console.log(primaryKey, secondKey, thirdData)
      this.calendarOptions.ticketCode = thirdData.code
    }
  }
}
</script>

<style lang="scss">

.calendar-wrapper {
  margin: 16px;
  //width: 1200px;
  //height: 600px;
  //padding: 24px;

  // mini
  //width: 490px;
  //height: 370px;

  // large
  height: calc(100% - 500px);
  min-height: 370px;
}

</style>

```

## LICENSE
BtgCalendar is released under the MIT [License](https://github.com/peppababy7/BtgCalendar/blob/main/LICENSE).


