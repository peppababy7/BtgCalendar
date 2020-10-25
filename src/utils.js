export function makeEvents(production, options) {
  let events = []
  const baseProduct = production.baseProduct
  baseProduct.stocks.forEach((item) => {
    const available = Number(item.stockOwnedAvailable) + Number(item.stockSharedAvailable)
    events.push({
      title: `余票：${available || '0'}`,
      date: item.datetime,
      extendedProps: item,
      className: ['day-grid-item', 'available-quantity-item'],
      ...getQuantityColor(available, options),
      isAvailable: true
    })
  })
  baseProduct.prices.forEach((item) => {
    const datetime = item.datetime.split(' ')[0]
    events.push({
      title: `${options.type === 'mini' ? '¥ ' : '票价：¥ '}${item.value || '--'}`,
      date: datetime,
      extendedProps: item,
      className: ['day-grid-item', 'price-item'],
      ...getPriceColor(item.value, options),
      isAvailable: false
    })
  })
  return events
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

function getQuantityColor(value, options) {
  if (options.type === 'mini') {
    return {}
  }
  for (let item of options.availableColor) {
    if (Number(item.value) <= Number(value)) {
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
