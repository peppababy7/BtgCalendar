export const mockData0 = {
  "code": 200, "msg": "请求成功", "data": {
    "products": {
      "CODE0": {
        "baseProduct": {
          "code": "CODE0",
          "description": "name0 desc name0 desc",
          "name": "name0 name0 name0 name0",
          "prices": [
            {"datetime": "2021-03-01 07:00:00", "value": 99},
            {"datetime": "2021-03-02 07:00:00", "value": 99},
            {"datetime": "2021-03-26 07:00:00", "value": 99},
            {"datetime": "2021-03-27 07:00:00", "value": 99},
            {"datetime": "2021-03-16 07:00:00", "value": 99},
            {"datetime": "2021-04-13 07:00:00", "value": 99},
            {"datetime": "2021-04-14 07:00:00", "value": 99},
            {"value": 59}],
          "purchasable": true,
          "stocks": [
            {"datetime": "2021-03-01 01:40:40", "status": "normal", "stock": 1},
            {"datetime": "2021-03-02 01:40:40", "status": "normal", "stock": 101},
            {"datetime": "2021-03-26 01:40:40", "status": "soldout", "stock": 1},
            {"datetime": "2021-03-27 01:40:40", "status": "soldout", "stock": 101},
            {
              "datetime": "2021-03-16 01:40:40",
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
            {"datetime": "2021-03-27 07:00:00", "value": 999},
            {"datetime": "2021-03-16 07:00:00", "value": 999},
            {"datetime": "2021-04-13 07:00:00", "value": 999},
            {"datetime": "2021-04-14 07:00:00", "value": 999}],
          "stocks": [
            {"datetime": "2021-03-27 01:40:40", "status": "normal", "stock": 19949},
            {"datetime": "2021-03-16 01:40:40", "status": "soldout", "stock": 19998}]
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
            {"datetime": "2021-03-27 07:00:00", "value": 9},
            {"datetime": "2021-03-16 07:00:00", "value": 9},
            {"datetime": "2021-04-13 07:00:00", "value": 9},
            {"datetiExpressme": "2021-04-14 07:00:00", "value": 9}],
          "stocks": [
            {"datetime": "2021-03-27 01:40:40", "status": "normal", "stock": 19949},
            {"datetime": "2021-03-16 01:40:40", "status": "soldout", "stock": 19998}]
        },
        "personType": "Type3",
        "ticketCategory": "Park",
      }
    },
    "dataGetDateTime": "2020-11-25 23:36:00",
    "options": {
      "section0": {
          "subSection0": [
            {"code": "CODE00", "name": "long long name00"},
            {"code": "CODE01", "name": "long long name01"},
            {"code": "CODE02", "name": "long long name02"},
            {"code": "CODE03", "name": "long long name03"},
            {"code": "CODE04", "name": "long long name04"},
            {"code": "CODE05", "name": "name05"},
            {"code": "CODE06", "name": "name06"},
            {"code": "CODE07", "name": "name07"},
            {"code": "CODE08", "name": "long long name08"},
            {"code": "CODE09", "name": "long long name09"},
            {"code": "CODE00", "name": "long long name10"},
            {"code": "CODE10", "name": "name11"},
            {"code": "CODE11", "name": "long long name12"},
            {"code": "CODE12", "name": "name13"},
            {"code": "CODE13", "name": "name14"},
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
  {"date": "2021-03-01", "privateStock": "100", "commonStock": 0},
  {"date": "2021-03-02", "privateStock": "0", "commonStock": 100},
  {"date": "2021-03-25", "privateStock": "0", "commonStock": 100},
  {"date": "2021-03-26", "privateStock": "0", "commonStock": 100},
  {"date": "2021-03-27", "privateStock": "0", "commonStock": 0},
]
