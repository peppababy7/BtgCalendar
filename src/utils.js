import './lunar'

export function getFullDateString(date) {
  let day = date.getDate()
  day = ('0' + day).slice(-2)
  let month = date.getMonth() + 1
  month = ('0' + month).slice(-2)
  const year = date.getFullYear()
  const tempDateString = `${year}-${month}-${day}`
  return tempDateString
}

export function appendDays(date, days) {
  const appendDate = date.setDate(date.getDate() + days)
  return new Date(appendDate)
}

export function appendDaysString(dateString, days) {
  const date = new Date(dateString)
  const appendDate = date.setDate(date.getDate() + days)
  return getFullDateString(new Date(appendDate))
}

// range is whole month
export function isRangedDate(from, to, compare) {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  const compareDate = new Date(compare)
  const isMoreThanMin = fromDate < compareDate
  const isLessThanMax = compareDate.getFullYear() <= toDate.getFullYear() && compareDate.getMonth() < toDate.getMonth()
  return isMoreThanMin && isLessThanMax
}

export function isBeforeDate(from, compare) {
  const fromDate = new Date(from)
  const compareDate = new Date(compare)
  return fromDate < compareDate
}

export function isAfterDate(from, compare) {
  const fromDate = new Date(from)
  const compareDate = new Date(compare)
  return compareDate.getFullYear() <= fromDate.getFullYear() && compareDate.getMonth() <= fromDate.getMonth()
}

export function makeEvents(products, options, virtualStockData) {
  let events = []
  const baseProduct = products.baseProduct
  let soldouts = []

  let stocksSoldOuts = []
  // fix Virtual Stock not have full datetime
  let originDateTimeMap = {}
  baseProduct.stocks.forEach((item) => {
    if (!item.datetime) {
      return
    }
    if (item.datetime.indexOf(' ') != -1) {
      item.originDateTime = item.datetime.replace(' ', 'T')
    }
    const datetime = item.datetime.split(' ')[0]
    originDateTimeMap[datetime] = item.originDateTime
    if (item.status == 'soldout') {
      // filter repeat date
      if (stocksSoldOuts.indexOf(datetime) === -1) {
        stocksSoldOuts.push(datetime)
      }
    }
  })
  // console.log('baseProduct.stocks', baseProduct.stocks, stocksSoldOuts)
  let virtualStockSoldOuts = []
  const isVirtualStockData = virtualStockData && virtualStockData.length > 0
  if (isVirtualStockData) {
    virtualStockData.forEach((item) => {
      const datetime = item.date
      let isStockSoldOut = false
      let isVirtualStockSoldOut = false
      if (item.havePrivate === 0 && parseInt(item.commonStock) <= 0) {
        isVirtualStockSoldOut = true
      }
      if (item.havePrivate === 1 && parseInt(item.privateStock) <= 0) {
        isVirtualStockSoldOut = true
      }
      if (isVirtualStockSoldOut) {
        virtualStockSoldOuts.push(datetime)
      }
      if (stocksSoldOuts.indexOf(datetime) !== -1) {
        isStockSoldOut = true
      }

      item.isVirtualStockSoldOut = isVirtualStockSoldOut
      item.isStockSoldOut = isStockSoldOut
      item.originDateTime = originDateTimeMap[datetime]
      if (isVirtualStockSoldOut || isStockSoldOut) {
        let classNames = ['day-grid-item', 'stock-item-sold-out']
        let title = '已售罄'
        let event = {
          title: title,
          date: datetime,
          extendedProps: item,
          className: classNames,
          isAvailable: true,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: '#EC473E',
        }
        events.push(event)
        soldouts.push(datetime)
      } else {
        let classNames = ['day-grid-item', 'stock-item']
        let title = parseInt(item.privateStock) <= 0 ? item.commonStock : item.privateStock
        let event = {
          title: title,
          date: datetime,
          extendedProps: item,
          className: classNames,
          ...getQuantityColor(title, options),
          isAvailable: true,
        }
        events.push(event)
      }
    })
  } else {
    // If do not have virtual stock
    // console.log('stocksSoldOuts', stocksSoldOuts)
    stocksSoldOuts.forEach((item) => {
      const datetime = item
      let classNames = ['day-grid-item', 'stock-item-sold-out']
      let title = '已售罄'
      let event = {
        title: title,
        date: datetime,
        extendedProps: item,
        className: classNames,
        isAvailable: true,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: '#EC473E',
      }
      events.push(event)
      soldouts.push(datetime)
    })
    // console.log('events soldouts', events, soldouts)
  }

  baseProduct.prices.forEach((item) => {
    if (!item.datetime) {
      return
    }
    if (item.datetime.indexOf(' ') != -1) {
      item.originDateTime = item.datetime.replace(' ', 'T')
    }
    const datetime = item.datetime.split(' ')[0]
    item.datetime = datetime
    item.isVirtualStockSoldOut = virtualStockSoldOuts.indexOf(datetime) !== -1
    item.isStockSoldOut = stocksSoldOuts.indexOf(datetime) !== -1
    let classNames = ['day-grid-item', 'price-item']
    let event = {
      title: `${options.type === 'mini' ? '¥ ' : '¥ '}${item.value || '--'}`,
      date: datetime,
      extendedProps: item,
      className: classNames,
      ...getPriceColor(item.value, options),
      isAvailable: true,
    }
    if (soldouts.indexOf(datetime) != -1) {
      classNames.push('sold-out-item')
      event.backgroundColor = '#F1F1F1'
      event.borderColor = 'transparent'
      event.textColor = '#CCCCCC'
      event.isEmpty = true
    }
    events.push(event)
  })

  const eventDates = events.map((item)=>{
    return item.date
  })
  if (eventDates.length == 0) {
    return [events, eventDates, []]
  }
  const startEventDate = eventDates[0]
  const endEventDate = eventDates[eventDates.length - 1]

  let startDate = new Date(startEventDate)
  startDate = new Date(startDate.getTime() - 2*30*24*60*60*1000)

  let endDate = new Date(endEventDate)
  endDate = new Date(endDate.getTime() + 2*30*24*60*60*1000)

  let emptyDate = []

  let tempDate = startDate
  const nowDate = new Date(new Date(new Date().toLocaleDateString()).getTime())
  while (true) {

    if (tempDate > endDate) {
      break
    }
    tempDate = new Date(tempDate.getTime() + 24*60*60*1000)
    const tempDateString = getFullDateString(tempDate)
    let lunarString = ''
    let lunarDate = lunar(tempDate)
    let cTerm = lunarDate.term;
    if(cTerm){
      lunarString = cTerm
    }
    let fes = lunarDate.festival();
    // if(fes&&fes.length>0){
    //   lunarString = fes[0].desc
    // }
    if(!cTerm){
      lunarString = lunarDate.lDate
    }
    lunarString = '  ' + lunarString
    let containTempDateString = eventDates.indexOf(tempDateString) != -1
    let lunarClasses = [containTempDateString ? 'lunar-date-normal' : 'lunar-date-soldout']
    const isToday = nowDate.toDateString() === tempDate.toDateString()
    events.push({
      title: isToday ? '' : lunarString,
      date: tempDateString,
      extendedProps: {},
      className: lunarClasses,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#9B9B9B',
    })
    // console.log(lunarString)

    if (containTempDateString) {
      continue
    }
    if (tempDate < nowDate) {
      continue
    }

    events.push({
      title: '暂未开放',
      date: tempDateString,
      extendedProps: {},
      className: ['empty-data-item'],
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#BBBBBB',
      isEmpty: true
    })
    emptyDate.push(tempDateString)
  }

  return [events, eventDates, emptyDate]
}

function largeColorParams(type) {
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
      backgroundColor: '#FDF6EC',
      borderColor: '#F5DAB1',
      textColor: '#E7A75E',
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

function getQuantityColor(value, options) {
  if (options.type === 'mini') {
    return {}
  }
  for (let item of options.availableColor) {
    if (Number(item.value) <= Number(value) && Number(item.value) != -1) {
      continue
    }
    if (item.type) {
      return largeColorParams(item.type)
    } else  {
      return item
    }
  }
  return largeColorParams('mid')
}

function getPriceColor(value, options) {
  if (options.type === 'mini') {
    return {
      textColor: '#FF4949',
    }
  }
  for (let item of options.priceColor) {
    if (Number(item.value) <= Number(value)) {
      continue
    }
    if (item.type) {
      return largeColorParams(item.type)
    } else  {
      return item
    }
  }
  return largeColorParams('price')
}
