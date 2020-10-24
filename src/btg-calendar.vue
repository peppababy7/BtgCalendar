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

function colorParams(type) {
  if (type === 'price') {
    return {
      backgroundColor: '#ECF5FF',
      borderColor: '#B3D8FF',
      textColor: '#409EFF',
    }
  }
  if (type === 'high') {
    return {
      backgroundColor: '#ECF8F2',
      borderColor: '#97D2B4',
      textColor: '#42B983',
    }
  }
  if (type === 'mid') {
    return {
      backgroundColor: '#FEF0F0',
      borderColor: '#FBC4C4',
      textColor: '#FF6F5B',
    }
  }
  if (type === 'low') {
    return {
      backgroundColor: '#FEF0F0',
      borderColor: '#FBC4C4',
      textColor: '#FF6F5B',
    }
  }
}

export default {
  name: 'BtgCalendar',
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
        initialView: 'dayGridMonth',
        locale: 'zh',
        buttonText: {
          today: '今日',
          update: ''
        },
        events: [],
        datesSet: this.datesSet,
        eventClick: this.handleEventClick,
        dateClick: this.handleDateClick,
        headerToolbar: {
          left:   'prev title next today switch refresh',
          center: '',
          right:  'updateTime'
        },
        customButtons: {
          updateTime: {
            text: '--',
          },
          switch: {
            text: '切换显示',
            click: function() {

            }
          },
          refresh: {
            text: '刷新',
            click: null
          }
        }
      }
    }
  },
  created() {
    const that = this
    this.calendarOptions.customButtons.refresh.click = function() {
      that.refreshData();
    }
  },
  mounted() {
    this.timer = setInterval(this.refreshData, 60000)
    this.refreshData();
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    refreshData() {
      this.refreshFunc()
    },
    datesSet (info) {

    },
    handleDateClick (arg) {
      let date = arg.date
      let dateString = arg.dateStr
      this.$emit('clickDate', dateString);
    },
    handleEventClick (info) {
      let extendedProps = info.event.extendedProps
      if (!extendedProps.isAvailable) {
        return
      }
      this.$emit('clickEvent', extendedProps);
    },
    updateDataSource() {
      if (!this.options || !this.options.ticketsData || !this.options.ticketCode) {
        return
      }
      this.calendarOptions.customButtons.updateTime.text = `${this.options.updateTitle}：${this.options.ticketsData.time}`
      this.calendarOptions.events = [];
      const production = this.options.ticketsData.production.filter((item)=>{
        return item.baseProduct.code === this.options.ticketCode
      })[0]
      if (!production) {
        return
      }
      const baseProduct = production.baseProduct
      baseProduct.stocks.forEach((item) => {
        const available = Number(item.stockOwnedAvailable) + Number(item.stockSharedAvailable)
        const that = this
        this.calendarOptions.events.push({
          title: `余票：${available || '0'}`,
          date: item.datetime,
          extendedProps: item,
          className: ['day-grid-item', 'available-quantity-item'],
          ...that.getQuantityColor(available),
          isAvailable: true
        })
      })
      baseProduct.prices.forEach((item) => {
        const datetime = item.datetime.split(' ')[0]
        const that = this
        this.calendarOptions.events.push({
          title: `票价：${item.value || '--'}`,
          date: datetime,
          extendedProps: item,
          className: ['day-grid-item', 'price-item'],
          ...that.getPriceColor(item.value),
          isAvailable: false
        })
      })
    },
    getQuantityColor(value) {
      for (let item of this.options.availableColor) {
        if (Number(item.value) <= Number(value)) {
          continue
        }
        if (item.type) {
          return colorParams(item.type)
        } else  {
          return item
        }
      }
      return colorParams('mid')
    },
    getPriceColor(value) {
      for (let item of this.options.priceColor) {
        if (Number(item.value) <= Number(value)) {
          continue
        }
        if (item.type) {
          return colorParams(item.type)
        } else  {
          return item
        }
      }
      return colorParams('price')
    },
  },
  watch: {
    'options.ticketCode': function (value) {
      this.updateDataSource()
    },
    'options.ticketsData': function (value) {
      this.updateDataSource()
    }
  }
}
</script>

<style lang="scss">
@import '~@fullcalendar/common/main.css';

.fc-toolbar-chunk {
  display: flex;
}

.fc-prev-button {
  background: transparent !important;
  border: transparent !important;
}

.fc-next-button {
  background: transparent !important;
  border: transparent !important;
}

.fc-icon-chevron-left {
  color: rgb(154, 154, 154);
}

.fc-icon-chevron-right {
  color: rgb(154, 154, 154);
}

.fc-next-button {
  background: transparent !important;
  border: transparent !important;
}

.fc-toolbar-title {
  font-size: 24px !important;
  color: #333333 !important;
  line-height: 40px;
}

.fc-today-button {
  width: 80px !important;
  height: 40px !important;
  background: #ECF5FF !important;
  border: 1px solid #B3D8FF !important;
  border-radius: 6px !important;
  font-size: 18px !important;
  font-weight: 400 !important;
  color: #409EFF !important;
}

.fc-refresh-button {
  height: 40px !important;
  background: #ECF5FF !important;
  border: 1px solid #B3D8FF !important;
  border-radius: 6px !important;
  font-size: 18px !important;
  font-weight: 400 !important;
  color: #409EFF !important;
}

.fc-switch-button {
  width: 100px !important;
  height: 40px !important;
  background: #ECF5FF !important;
  border: 1px solid #B3D8FF !important;
  border-radius: 6px !important;
  font-size: 18px !important;
  font-weight: 400 !important;
  color: #409EFF !important;
}

.fc-daygrid-day {
  height: 124px;
  min-width: 150px;
}

.fc-day-today {
  background: transparent !important;
  .fc-daygrid-day-frame {
    .fc-daygrid-day-top {
      .fc-daygrid-day-number {
        color: white !important;
        background: #FF3232 !important;
      }
    }
  }
}

.fc-daygrid-day-events {
  margin-top: 0 !important;
}

.fc-event-title {
  padding-top: 0 !important;
}

.fc-updateTime-button {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #999999 !important;
  background: transparent !important;
  border: transparent !important;
}

.day-grid-item {
  height: 30px;
  min-width: 120px;
  padding-left: 10px;
  padding-right: 5px;
  text-align: left;
  line-height: 30px;
  margin-left: 15px !important;
  margin-right: 15px !important;
  font-size: 18px;
  font-weight: 400;
  border-radius: 0 !important;
}

.available-quantity-item {
  margin-top: 0px !important;
}

.price-item {
  margin-top: 4px !important;
}

.fc-daygrid-day-number {
  margin: 9px auto 4px 15px;
  line-height: 33px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #304156;
  padding: 0 !important;
  width: 72px;
  height: 33px;
}

</style>
