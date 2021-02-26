export const mockData0 = {
  "code": 200, "msg": "请求成功", "data": {
    "products": {
      "CODE0": {
        "baseProduct": {
          "code": "CODE0",
          "description": "name0 desc name0 desc",
          "name": "name0 name0 name0 name0",
          "prices": [
            {"datetime": "2021-02-01 00:00:00", "value": 99},
            {"datetime": "2021-02-02 00:00:00", "value": 99},
            {"datetime": "2021-02-26 00:00:00", "value": 99},
            {"datetime": "2021-02-27 00:00:00", "value": 99},
            {"datetime": "2021-02-16 00:00:00", "value": 99},
            {"datetime": "2021-04-13 00:00:00", "value": 99},
            {"datetime": "2021-04-14 00:00:00", "value": 99},
            {"value": 59}],
          "purchasable": true,
          "stocks": [
            {"datetime": "2021-02-01 01:40:40", "status": "normal", "stock": 1},
            {"datetime": "2021-02-02 01:40:40", "status": "normal", "stock": 101},
            {"datetime": "2021-02-26 01:40:40", "status": "soldout", "stock": 1},
            {"datetime": "2021-02-27 01:40:40", "status": "soldout", "stock": 101},
            {
              "datetime": "2021-02-16 01:40:40",
              "status": "normal",
              "stockOwnedAvailable": 19998,
              "stockSharedAvailable": 19998
            },
            {"value": 59}],
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
            {"datetime": "2021-02-27 00:00:00", "value": 999},
            {"datetime": "2021-02-16 00:00:00", "value": 999},
            {"datetime": "2021-04-13 00:00:00", "value": 999},
            {"datetime": "2021-04-14 00:00:00", "value": 999}],
          "stocks": [
            {"datetime": "2021-02-27 01:40:40", "status": "normal", "stock": 19949},
            {"datetime": "2021-02-16 01:40:40", "status": "soldout", "stock": 19998}]
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
            {"value": 59},
            {"value": 59},
            {"value": 59},
            {"value": 59},
            {"value": 59}],
          "stocks": [
            {"status": "normal", "stock": 19949},
            {"status": "normal", "stock": 19949},
            {"status": "normal", "stock": 19949},
            {"stock": 59}],
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
            {"datetime": "2021-02-27 00:00:00", "value": 9},
            {"datetime": "2021-02-16 00:00:00", "value": 9},
            {"datetime": "2021-04-13 00:00:00", "value": 9},
            {"datetiExpressme": "2021-04-14 00:00:00", "value": 9}],
          "stocks": [
            {"datetime": "2021-02-27 01:40:40", "status": "normal", "stock": 19949},
            {"datetime": "2021-02-16 01:40:40", "status": "soldout", "stock": 19998}]
        },
        "personType": "Type3",
        "ticketCategory": "Park",
      }
    },
    "dataGetDateTime": "2020-11-25 23:36:00",
    "options": {
      "section0": {
          "subSection0": [
            {"code": "CODE0", "name": "name0"}
            ]
        },
      "section1": {
        "subSection1": [
          {"code": "CODE1", "name": "name1"}
          ],
        "subSection2": [
          {"code": "CODE2", "name": "name2"},
          {"code": "CODE3", "name": "name3"},
          {"code": "CODE4", "name": "name4"},
          {"code": "CODE5", "name": "name5"},
          {"code": "CODE6", "name": "name6"}
        ]
      }
    }
  }
}

export const mockTypeMap = {
  "class0": {"section0": "section0Name", "section1": "section1Name"},
  "class1": {"subSection0": "subSection0Name", "subSection1": "subSection1Name", "subSection2": "subSection2Name"}
}

export const mockEvents = [
  {"date": "2021-02-01", "privateStock": "100", "commonStock": "0"},
  {"date": "2021-02-02", "privateStock": "0", "commonStock": "100"},
  {"date": "2021-02-27", "privateStock": "100", "commonStock": "0"},
]
