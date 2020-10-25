const mockData = {
  code: 200, msg: '请求成功', data: {
    production: [{
      baseProduct: {
        code: 'xxxxx',
        prices: [{ datetime: '2020-10-23 00:00:00', value: 999 }, {
          datetime: '2020-10-24 00:00:00',
          value: 999
        }, { datetime: '2020-10-25 00:00:00', value: 999 }, {
          datetime: '2020-10-26 00:00:00',
          value: 999
        }],
        stocks: [{
          datetime: '2020-10-22',
          status: 'normal',
          stockOwnedAvailable: '0',
          stockOwnedTotal: '0',
          stockSharedAvailable: '349742',
          stockSharedTotal: '350000'
        }, {
          datetime: '2020-10-23',
          status: 'normal',
          stockOwnedAvailable: '0',
          stockOwnedTotal: '0',
          stockSharedAvailable: '349742',
          stockSharedTotal: '350000'
        }, {
          datetime: '2020-10-24',
          status: 'normal',
          stockOwnedAvailable: '0',
          stockOwnedTotal: '0',
          stockSharedAvailable: '349742',
          stockSharedTotal: '350000'
        }]
      },
    }], time: '2020-10-22 02:43:09'
  }
}

export default mockData
