export const mockData0 = {
  "code": 200, "msg": "请求成功", "data": {
    "products": {
      "CODE0": {
        "baseProduct": {
          "code": "CODE0",
          "description": "name0 desc name0 desc",
          "name": "name0 name0 name0 name0",
          "prices": [
            {"datetime": "2020-12-14 00:00:00", "value": 99},
            {"datetime": "2020-12-15 00:00:00", "value": 99},
            {"datetime": "2020-12-16 00:00:00", "value": 99},
            {"datetime": "2021-04-13 00:00:00", "value": 99},
            {"datetime": "2021-04-14 00:00:00", "value": 99}],
          "purchasable": true,
          "stocks": [
            {"datetime": "2020-12-14 01:40:40", "status": "normal", "stock": 1},
            {"datetime": "2020-12-15 01:40:40", "status": "normal", "stock": 101},
            {"datetime": "2020-12-16 01:40:40", "status": "normal", "stockOwnedAvailable": 19998, "stockSharedAvailable": 19998}]
        },
        "personType": "Type0",
        "ticketCategory": "Express",
      },
      "CODE1": {
        "baseProduct": {
          "code": "CODE1",
          "description": "name1 desc name1 desc",
          "name": "name1 name1 name1 name1",
          "prices": [
            {"datetime": "2020-12-15 00:00:00", "value": 999},
            {"datetime": "2020-12-16 00:00:00", "value": 999},
            {"datetime": "2021-04-13 00:00:00", "value": 999},
            {"datetime": "2021-04-14 00:00:00", "value": 999}],
          "stocks": [
            { "datetime": "2020-12-15 01:40:40", "status": "normal", "stock": 19949},
            {"datetime": "2020-12-16 01:40:40", "status": "normal", "stock": 19998}]
        },
        "personType": "Type1",
        "ticketCategory": "Park",
      },
      "CODE2": {
        "baseProduct": {
          "code": "CODE2",
          "description": "name2 desc name2 desc",
          "name": "name2 name2 name2 name2",
          "prices": [
            {"datetime": "2020-12-15 00:00:00", "value": 59},
            {"datetime": "2020-12-16 00:00:00", "value": 59},
            {"datetime": "2021-04-13 00:00:00", "value": 59},
            {"datetime": "2021-04-14 00:00:00", "value": 59}],
          "stocks": [
            {"datetime": "2020-12-15 01:40:40", "status": "normal", "stock": 19949},
            {"datetime": "2020-12-16 01:40:40", "status": "normal", "stockOwnedAvailable": 19998, "stockSharedAvailable": 19998}]
        },
        "personType": "Type2",
        "ticketCategory": "Park",
      },
      "CODE3": {
        "admissionReEntry": "USB Unlimited Reentry",
        "baseProduct": {
          "code": "CODE3",
          "description": "name3 desc name3 desc",
          "name": "name3 name3 name3 name3",
          "prices": [
            {"datetime": "2020-12-15 00:00:00", "value": 9},
            {"datetime": "2020-12-16 00:00:00", "value": 9},
            {"datetime": "2021-04-13 00:00:00", "value": 9},
            {"datetime": "2021-04-14 00:00:00", "value": 9}],
          "stocks": [
            {"datetime": "2020-12-15 01:40:40", "status": "normal", "stock": 19949},
            {"datetime": "2020-12-16 01:40:40", "status": "normal", "stock": 19998}]
        },
        "personType": "Type3",
        "ticketCategory": "Park",
      }
    },
    "dataGetDateTime": "2020-11-25 23:36:00",
    "options": {
      "Express": [{"type": "Type0", "code": "CODE0"}],
      "Park": [
        {"type": "Type1", "code": "CODE1"},
        {"type": "Type2", "code": "CODE2"},
        {"type": "Type3", "code": "CODE3"}]
    }
  }
}
