const { generateBillReceipt, generateCounterReceipt } = require("./printing.js");

const  rest_details= {
  "_id": {
      "$oid": "616d14d6e4276f3d6223b7a1"
  },
  "id": "482a7a5888614fa69d3672c6a681c7a0",
  "name": "Caravan Dev",
  "phone": "01111402823",
  "dial_code": "+60",
  "email": "caravandev@gmail.com",
  "emails": {
      "cm": [
          "caravandev@gmail.com"
      ],
      "pm": [
          "caravandev@gmail.com"
      ],
      "am": [
          "caravandev@gmail.com"
      ]
  },
  "logo": "https://d1xkxcid7icwfl.cloudfront.net/restaurant_image/482a7a5888614fa69d3672c6a681c7a0_1650605514.jpg",
  "address": "LG24, LG Floor Da Men Mall USj11, Persiaran Masjid, Shah Alam, Selangor, Malaysia",
  "city": "Shah Alam",
  "pin_code": "40000",
  "state": "Selangor",
  "country": "Malaysia",
  "location": {
      "lat": 3.0766184,
      "lon": 101.5153446
  },
  "priority": 10,
  "rest_timings": {
      "DELIVERY": [
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          }
      ],
      "DINING": [
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          }
      ],
      "TAKEAWAY": [
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          },
          {
              "is_enabled": true,
              "slot": [
                  {
                      "start": 1,
                      "end": 1439
                  }
              ]
          }
      ]
  },
  "filters": [
      {
          "id": "veg",
          "name": "Veg",
          "filter-type": "preference",
          "status": 1
      },
      {
          "id": "non-veg",
          "name": "Non Veg",
          "filter-type": "preference",
          "status": 1
      },
      {
          "id": "available",
          "name": "available",
          "filter-type": "preference",
          "status": 1,
          "selected": true
      },
      {
          "id": "price-10",
          "name": "10",
          "currency": "MYR",
          "filter-type": "price",
          "status": 1
      },
      {
          "id": "price-20",
          "name": "20",
          "currency": "MYR",
          "filter-type": "price",
          "status": 1
      },
      {
          "id": "price-30",
          "name": "30",
          "currency": "MYR",
          "filter-type": "price",
          "status": 1
      }
  ],
  "services": [
      {
          "category_id": "cutlery",
          "category_name": "Cutlery",
          "icon": "cutlery-1.png",
          "subcategories": [
              {
                  "subcategory_id": "cutlery-plate",
                  "subcategory_name": "Plate",
                  "icon": "dish_plate.png",
                  "price_flag": 0,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 1
              },
              {
                  "subcategory_id": "cutlery-bowl",
                  "subcategory_name": "Bowl",
                  "icon": "bowl-1.png",
                  "price_flag": 0,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 1
              },
              {
                  "subcategory_id": "cutlery-glass",
                  "subcategory_name": "Glass",
                  "icon": "glass.png",
                  "price_flag": 0,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 1
              },
              {
                  "subcategory_id": "cutlery-spoon",
                  "subcategory_name": "Spoon",
                  "icon": "spoon.png",
                  "price_flag": 0,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 1
              },
              {
                  "subcategory_id": "cutlery-fork",
                  "subcategory_name": "Fork",
                  "icon": "fork.png",
                  "price_flag": 0,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 1
              },
              {
                  "subcategory_id": "cutlery-chopstick",
                  "subcategory_name": "Chopstick",
                  "icon": "chopsticks.svg",
                  "price_flag": 0,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "cutlery-knife",
                  "subcategory_name": "Knife",
                  "icon": "knife.png",
                  "price_flag": 0,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "cutlery-straw",
                  "subcategory_name": "Straw",
                  "icon": "drinking-straw.svg",
                  "price_flag": 0,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              }
          ],
          "status": 1
      },
      {
          "category_id": "water",
          "category_name": "Water",
          "icon": "glass.png",
          "subcategories": [
              {
                  "subcategory_id": "water-regular",
                  "subcategory_name": "Regular Water",
                  "icon": "glass.png",
                  "price_flag": 1,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "water-mineral",
                  "subcategory_name": "Mineral Water",
                  "icon": "water.png",
                  "price_flag": 1,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "water-hot",
                  "subcategory_name": "Hot Water",
                  "icon": "water-1.png",
                  "price_flag": 1,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "water-lemon",
                  "subcategory_name": "Lemon Water",
                  "icon": "glass.png",
                  "price_flag": 1,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "water-filtered",
                  "subcategory_name": "Filtered Water",
                  "icon": "glass.png",
                  "price_flag": 1,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "water-ice",
                  "subcategory_name": "Ice Water",
                  "icon": "glass.png",
                  "price_flag": 1,
                  "quantity_flag": 1,
                  "price": 0,
                  "status": 0
              }
          ],
          "status": 0
      },
      {
          "category_id": "sauces",
          "category_name": "Sauces",
          "icon": "sauces.png",
          "subcategories": [
              {
                  "subcategory_id": "sauces-tomato",
                  "subcategory_name": "Tomato Sauce",
                  "icon": "tomato-ketchup.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-alfredo",
                  "subcategory_name": "Alfredo",
                  "icon": "",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-pesto",
                  "subcategory_name": "Pesto Sauce",
                  "icon": "pesto-sauce.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-marinara",
                  "subcategory_name": "Marinara",
                  "icon": "",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-bbq",
                  "subcategory_name": "Barbeque Sauce",
                  "icon": "bbq-sauce.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-chilli",
                  "subcategory_name": "Chilli Sauce",
                  "icon": "chilli-sauce.svg",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-salsa",
                  "subcategory_name": "Salsa",
                  "icon": "",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-garlic",
                  "subcategory_name": "Garlic Sauce",
                  "icon": "garlic-sauce.svg",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-mustard",
                  "subcategory_name": "Mustard Sauce",
                  "icon": "mustard-1.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-mayo",
                  "subcategory_name": "Mayonnaise",
                  "icon": "mayonnaise-sauce.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-tamarind",
                  "subcategory_name": "Tamarind",
                  "icon": "imli-chatni.svg",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-mint",
                  "subcategory_name": "Mint Sauce",
                  "icon": "mint-chatni.svg",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-tobasco",
                  "subcategory_name": "Tobasco",
                  "icon": "tobasco.svg",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-coconut-chutney",
                  "subcategory_name": "Coconut chutney",
                  "icon": "coconut-chatni.svg",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-coriander-chutney",
                  "subcategory_name": "Coriander chutney",
                  "icon": "coriander-chatni.svg",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-samber",
                  "subcategory_name": "Samber",
                  "icon": "Samber.svg",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-sriranha-mayo",
                  "subcategory_name": "Sriracha Mayo",
                  "icon": "sriracha-mayo.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-duck",
                  "subcategory_name": "Duck Sauce",
                  "icon": "duck-sauce.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "sauces-teriyaki",
                  "subcategory_name": "Teriyaki Sauce",
                  "icon": "teriyaki-sauce.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              }
          ],
          "status": 0
      },
      {
          "category_id": "condiments",
          "category_name": "Condiments",
          "icon": "",
          "subcategories": [
              {
                  "subcategory_id": "condiments-salt",
                  "subcategory_name": "Salt",
                  "icon": "salt.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "condiments-pepper",
                  "subcategory_name": "Pepper",
                  "icon": "pepper-1.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "condiments-oregano",
                  "subcategory_name": "Oregano",
                  "icon": "",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "condiments-chilli-flakes",
                  "subcategory_name": "Chilli Flakes",
                  "icon": "salt.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "condiments-parmesan-cheese",
                  "subcategory_name": "Parmesan Cheese",
                  "icon": "parmesan-cheese.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "condiments-parmesan-cheese",
                  "subcategory_name": "Parmesan Cheese",
                  "icon": "parmesan-cheese.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              }
          ],
          "status": 0
      },
      {
          "category_id": "napkin",
          "category_name": "Napkin",
          "icon": "napkin.png",
          "subcategories": [],
          "status": 0
      },
      {
          "category_id": "call-server",
          "category_name": "Call the Server",
          "icon": "waiter.png",
          "subcategories": [],
          "status": 1
      },
      {
          "category_id": "wifi-password",
          "category_name": "Wifi Password",
          "icon": "wifi-signal.png",
          "ssid": "",
          "password": "",
          "subcategories": [],
          "status": 0
      },
      {
          "category_id": "smoking-accessories",
          "category_name": "Smoking",
          "icon": "smoking-cat.png",
          "subcategories": [
              {
                  "subcategory_id": "smoking-ashtray",
                  "subcategory_name": "Ashtray",
                  "icon": "ashtray.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              },
              {
                  "subcategory_id": "smoking-lighter",
                  "subcategory_name": "Lighter",
                  "icon": "lighter.png",
                  "price_flag": 0,
                  "quantity_flag": 0,
                  "price": 0,
                  "status": 0
              }
          ],
          "status": 0
      }
  ],
  "discount": [
      0,
      0,
      0
  ],
  "restaurant_certificates": [],
  "account_details": [],
  "tax_details": [],
  "preparation_time": [],
  "type": 3,
  "delivery_time": 20,
  "fee": [],
  "status": 1,
  "nameid": "caravan-dev",
  "deliverylimit": 40,
  "on_whatsapp": 1,
  "geo_location": {
      "type": "Point",
      "coordinates": [
          101.5153446,
          3.0766184
      ]
  },
  "restaurant_open_days": [
      [
          "1639329894782Break_fast"
      ],
      [],
      [
          "1639329894782Break_fast"
      ],
      [
          "1639329894782Break_fast"
      ],
      [
          "1639329894782Break_fast"
      ],
      [
          "1639329894782Break_fast"
      ],
      [
          "1639329894782Break_fast"
      ]
  ],
  "config_timings": [
      {
          "name": "Dinner",
          "id": "1640001825607Dinner",
          "timing": [
              0,
              1439
          ]
      }
  ],
  "time_zone": "Asia/Kuala_Lumpur",
  "next_open_epoch": 1642484067,
  "mall": "empress",
  "foodcourt": "empress",
  "delivery_partner": [
      {
          "partner_id": "1",
          "partner_name": "mrspeedy",
          "priority": 1,
          "status": 1
      },
      {
          "partner_id": "2",
          "partner_name": "lalamove",
          "priority": 2,
          "status": 0
      },
      {
          "partner_id": "3",
          "partner_name": "grab",
          "priority": 0,
          "status": 0
      }
  ],
  "base_roundoff": 0.05,
  "addons": [
      {
          "id": "c49db88e107d4b4a852aa46732ea03bf",
          "name": "hq-addon-2",
          "price": 15,
          "status": 1,
          "itemids": [
              "5fe3b819e5a24b469ec1b2746d370dec",
              "1333a00b393b48b99e66a89e86f056e8",
              "25a5c6555d153243dd820dad12e1073a554574b02cfa39fb8ffb59c943c7d125",
              "f15080c86cfb494fa6e294048275e215"
          ]
      },
      {
          "name": "Chicken soup",
          "price": 5,
          "id": "e3b15031398347bca1dbaa2a0deef91d",
          "status": 1,
          "itemids": [
              "905d5b85bf8542f59ce4abe3db467ef0",
              "1333a00b393b48b99e66a89e86f056e8",
              "25a5c6555d153243dd820dad12e1073a554574b02cfa39fb8ffb59c943c7d125",
              "13ff0ca80bb74d5cb04d31bb4d48b8ae",
              "f15080c86cfb494fa6e294048275e215"
          ]
      },
      {
          "id": "8ac7ca19a5694e3abbadd742c9405acd",
          "name": "hq-addon-1",
          "price": 10,
          "status": 1,
          "itemids": [
              "60846e2300294d8c85621cd50f619fe9"
          ]
      },
      {
          "id": "c33dcca3bb7940049659834a7d3a38e3",
          "name": "hq-addon-2",
          "price": 15,
          "status": 1,
          "itemids": [
              "60846e2300294d8c85621cd50f619fe9",
              "59359b7b38764580a70b1f4032a63d84",
              "f15080c86cfb494fa6e294048275e215"
          ]
      },
      {
          "id": "2e55ccfec0054830ac2709a049e87614",
          "name": "hq-addon-2",
          "price": 15,
          "status": 1,
          "itemids": [
              "5fe3b819e5a24b469ec1b2746d370dec",
              "59359b7b38764580a70b1f4032a63d84",
              "f15080c86cfb494fa6e294048275e215"
          ]
      },
      {
          "id": "25dcd6557347448fb3475ca9bbf57879",
          "name": "hq-addon-2",
          "price": 15,
          "status": 1,
          "itemids": [
              "60846e2300294d8c85621cd50f619fe9",
              "f15080c86cfb494fa6e294048275e215"
          ]
      },
      {
          "name": "test",
          "price": 1,
          "id": "c021489f3d29457f93ddad9dabb0ffaf",
          "status": 1,
          "itemids": [
              "a68bd84eee50044a54a0ece12921aa070e272f2c937cb7d2d86240dc9a048c1e",
              "59359b7b38764580a70b1f4032a63d84",
              "51aa2a5dbd6e40ceb8274aaaafdd2115",
              "25a5c6555d153243dd820dad12e1073a554574b02cfa39fb8ffb59c943c7d125",
              "f15080c86cfb494fa6e294048275e215"
          ]
      },
      {
          "name": "test_manish",
          "price": 1,
          "id": "ac15159cea464afa905b641cd63cea47",
          "status": 1,
          "itemids": [
              "1333a00b393b48b99e66a89e86f056e8"
          ]
      },
      {
          "id": "7510f7c38ad549008db0bfd873f801ee",
          "name": "hq-addon-1",
          "price": 10,
          "status": 1,
          "itemids": [
              "5fe3b819e5a24b469ec1b2746d370dec"
          ]
      },
      {
          "id": "a2c88471bcc94015a0acacd81ee2817e",
          "name": "hq-addon-1",
          "price": 10,
          "status": 1,
          "itemids": [
              "5fe3b819e5a24b469ec1b2746d370dec",
              "25a5c6555d153243dd820dad12e1073a554574b02cfa39fb8ffb59c943c7d125"
          ]
      },
      {
          "id": "a23b97325a42400bbb225a16beb279a0",
          "name": "hq-addon-1",
          "price": 10,
          "status": 1,
          "itemids": [
              "60846e2300294d8c85621cd50f619fe9"
          ]
      },
      {
          "name": "test_manish",
          "price": 1,
          "id": "b647271010e04d6c9ff289baeb203b72",
          "status": 1,
          "itemids": [
              "25a5c6555d153243dd820dad12e1073a554574b02cfa39fb8ffb59c943c7d125"
          ]
      },
      {
          "name": "test_abcd",
          "price": 1,
          "id": "ea8c8dccfeac44f2b0402fc83339c4f6",
          "status": 1,
          "itemids": [
              "25a5c6555d153243dd820dad12e1073a554574b02cfa39fb8ffb59c943c7d125"
          ]
      },
      {
          "name": "test",
          "price": 1,
          "id": "997600da8bec4622adf2e4e6345cce50",
          "status": 1,
          "printer": "window",
          "itemids": [
              "a68bd84eee50044a54a0ece12921aa070e272f2c937cb7d2d86240dc9a048c1e",
              "51aa2a5dbd6e40ceb8274aaaafdd2115"
          ]
      },
      {
          "id": "4a8a03f2507f430391686c41ea613d7f",
          "name": "hq-addon-1",
          "price": 10,
          "status": 1,
          "itemids": [
              "60846e2300294d8c85621cd50f619fe9"
          ]
      },
      {
          "id": "63c6fd9033e2400592b8cef3eb502f6e",
          "name": "hq-addon-2",
          "price": 15,
          "status": 1,
          "itemids": [
              "60846e2300294d8c85621cd50f619fe9"
          ]
      },
      {
          "id": "7fee14efe405465699be174dca225d3e",
          "name": "hq-addon-2",
          "price": 15,
          "status": 1,
          "itemids": [
              "5fe3b819e5a24b469ec1b2746d370dec"
          ]
      },
      {
          "name": "test",
          "price": 1,
          "id": "af1bc39d33d3439ba56014794b061ac8",
          "status": 1,
          "printer": 2,
          "itemids": [
              "a68bd84eee50044a54a0ece12921aa070e272f2c937cb7d2d86240dc9a048c1e",
              "51aa2a5dbd6e40ceb8274aaaafdd2115"
          ]
      },
      {
          "id": "d53c46e521574b15a141c7991083cb50",
          "name": "hq-addon-1",
          "price": 10,
          "status": 1,
          "itemids": [
              "5fe3b819e5a24b469ec1b2746d370dec"
          ]
      },
      {
          "name": "Cheese Slices",
          "price": 2,
          "id": "7afd667a78f848b2950ea65845f1e5c9",
          "status": 1,
          "itemids": [
              "a1edeed9fdb74f2bad11af7c377026f2"
          ],
          "max_qty": 2
      },
      {
          "name": "Onion Rings",
          "price": 2,
          "id": "ae09e7d8f07f4639b3117757156898ca",
          "status": 1,
          "itemids": [
              "03a9427914774f1c91cf892eb9d64436",
              "a1edeed9fdb74f2bad11af7c377026f2",
              "1802ac0bacc64e4994ddf78af6cc4265"
          ],
          "max_qty": 5
      },
      {
          "name": "Barbecue Sauce",
          "price": 1,
          "id": "733c24b23d7245aeb84596d9eeef6322",
          "status": 1,
          "itemids": [
              "a1edeed9fdb74f2bad11af7c377026f2"
          ],
          "max_qty": 1
      },
      {
          "name": "Hot Sauce",
          "price": 1,
          "id": "debf9d386b8244639d46f01b49ab046d",
          "status": 1,
          "itemids": [
              "a1edeed9fdb74f2bad11af7c377026f2",
              "e941b41cbe4f4745bfb374651b70be72",
              "13ff0ca80bb74d5cb04d31bb4d48b8ae"
          ],
          "max_qty": 1
      },
      {
          "name": "Mustard",
          "price": 1,
          "id": "3255208ba07241ff94c53a4410cfdf4e",
          "status": 1,
          "itemids": [
              "a1edeed9fdb74f2bad11af7c377026f2",
              "39489550251748cba95c2c650a087fe5",
              "13ff0ca80bb74d5cb04d31bb4d48b8ae"
          ]
      },
      {
          "name": "taj mahal",
          "price": 2,
          "id": "8014c44ef2df45c4a5addfab3d0b8e76",
          "status": 0,
          "itemids": [
              "73edc24d70644ef9a59aa5d31b29ea80",
              "4b1fb90810a540e8aa4f9ee5c1fefdff",
              "bbed5450fa5e4b03836eb22dad887180"
          ]
      },
      {
          "name": "Carrots",
          "price": 234,
          "status": 1,
          "id": "6be6115e4bfb457bb0938451087e6501",
          "itemids": [
              "3565a70305654828b31ecaab0d364fc3"
          ],
          "max_qty": 12
      },
      {
          "name": "Kurkure",
          "price": 342,
          "status": 1,
          "id": "2cb7598dc0d24624a1439d70a20acf20",
          "itemids": [
              "45103eeec77446e9bc50678d6923e43d"
          ],
          "max_qty": 321
      },
      {
          "name": "Coke",
          "price": 231,
          "status": 1,
          "id": "1c15f907fb154c0b8540b1a3e135def6",
          "itemids": [
              "45103eeec77446e9bc50678d6923e43d"
          ],
          "max_qty": 234
      },
      {
          "name": "dsf",
          "price": 234,
          "status": 1,
          "id": "b24c7c8f02ab40d19f161b476acae401",
          "itemids": [
              "45103eeec77446e9bc50678d6923e43d"
          ],
          "max_qty": 2342
      },
      {
          "name": "cheese",
          "price": 90,
          "status": 1,
          "id": "0b085061d8c146919b8be73a07c10c6c",
          "itemids": [
              "2be22c55464c4b309ea50a2ff6378431",
              "7791de81bfff4deaae5a93d55121719a"
          ],
          "max_qty": 1
      },
      {
          "name": "Lemon",
          "price": 34,
          "status": 1,
          "id": "ff417be482ef4dfaa3efc1f0e77719fe",
          "itemids": [
              "773606cc77464ee080d49141b20e6c88",
              "7791de81bfff4deaae5a93d55121719a"
          ],
          "max_qty": 43
      },
      {
          "name": "Paneer",
          "price": 90,
          "status": 1,
          "id": "d47aa35ed3c04e76b9b2b29a11f87ce2",
          "itemids": [
              "773606cc77464ee080d49141b20e6c88",
              "7791de81bfff4deaae5a93d55121719a"
          ],
          "max_qty": 1
      },
      {
          "name": "Punugulu",
          "price": 30,
          "status": 1,
          "id": "ab7f944ed1a544769068849be9c13645",
          "itemids": [
              "773606cc77464ee080d49141b20e6c88",
              "7791de81bfff4deaae5a93d55121719a"
          ],
          "max_qty": 1
      },
      {
          "name": "Butter Masala",
          "price": 0,
          "status": 1,
          "id": "e660b200607746d5afcee5394aa8fc29",
          "itemids": [
              "d1a4493854174ad4b7ce57e8ca1a733f",
              "21b5eaa89dce4a958af8ffcd8f49e788",
              "a54577c0df5d48e08de7c63989c152f9",
              "abba2f6033dd499e8c337ecd5173b811",
              "c59f2e688b3d4cf58c1a5d5515d77325",
              "80cc8fb9621240d8b8dc27ff6944a7f8",
              "1802ac0bacc64e4994ddf78af6cc4265"
          ],
          "max_qty": 1
      },
      {
          "name": "Butter Masala",
          "price": 0,
          "status": 1,
          "id": "e660b200607746d5afcee5394aa8fc29",
          "itemids": [
              "d1a4493854174ad4b7ce57e8ca1a733f",
              "21b5eaa89dce4a958af8ffcd8f49e788",
              "a54577c0df5d48e08de7c63989c152f9",
              "abba2f6033dd499e8c337ecd5173b811",
              "c59f2e688b3d4cf58c1a5d5515d77325",
              "80cc8fb9621240d8b8dc27ff6944a7f8",
              "1802ac0bacc64e4994ddf78af6cc4265"
          ],
          "max_qty": 1
      },
      {
          "name": "Butter Masala",
          "price": 0,
          "status": 1,
          "id": "e660b200607746d5afcee5394aa8fc29",
          "itemids": [
              "d1a4493854174ad4b7ce57e8ca1a733f",
              "21b5eaa89dce4a958af8ffcd8f49e788",
              "a54577c0df5d48e08de7c63989c152f9",
              "abba2f6033dd499e8c337ecd5173b811",
              "c59f2e688b3d4cf58c1a5d5515d77325",
              "80cc8fb9621240d8b8dc27ff6944a7f8",
              "1802ac0bacc64e4994ddf78af6cc4265"
          ],
          "max_qty": 1
      },
      {
          "name": "fff",
          "price": 0,
          "status": 1,
          "id": "56157ef0ad2c44fba47550fb95a2edc4",
          "itemids": [
              "68703a47a58b430ab47b4fb7e9b49f3d"
          ],
          "max_qty": 2
      },
      {
          "name": "crunchy beer",
          "price": 2,
          "id": "fdb6cacd66c940efaa9b5fb59bd5ca73",
          "status": 0,
          "itemids": [
              "905d5b85bf8542f59ce4abe3db467ef0"
          ]
      },
      {
          "name": "Hari Chatni",
          "price": 0,
          "status": 1,
          "id": "59fa10a1151a43b7906b256f83ee1f9e",
          "itemids": [
              "511a9d3536664f7195549d2917a5d5be",
              "4b5d9212fd6246c795f39f60a2a2a79b",
              "1802ac0bacc64e4994ddf78af6cc4265"
          ],
          "max_qty": 5
      },
      {
          "name": "qwerty",
          "price": 12,
          "id": "3e651696f0fc406a9e6f2c8c8dcfbb0f",
          "status": 0,
          "itemids": [
              "1802ac0bacc64e4994ddf78af6cc4265"
          ]
      }
  ],
  "country_code": "MY",
  "company_name": "New Restaurant Ipoh Chicken Rice",
  "cuisine": [
      "Chinese"
  ],
  "pref_filter": [
      "Non Halal"
  ],
  "bnk_nm": "TBA",
  "bnk_accn": 1234,
  "acc_holder_nm": "TBA",
  "offline_platforms": [
      {
          "id": "deliver_eat",
          "order_type": 1,
          "name": "DeliverEat",
          "img": "delivereat.png",
          "comm_amt": 20,
          "comm_typ": "percentage",
          "pkg_applicable": 0
      },
      {
          "id": "grab",
          "name": "Grab",
          "img": "grab.png",
          "order_type": 3,
          "status": 1,
          "code": "",
          "comm_amt": 4,
          "comm_typ": "percentage",
          "pkg_applicable": 1
      },
      {
          "id": "foodpanda",
          "name": "Foodpanda",
          "img": "panda.png",
          "order_type": 3,
          "status": 1,
          "code": "",
          "comm_amt": 10,
          "comm_typ": "percentage",
          "pkg_applicable": 1,
          "email": "mchee86@gmail.com",
          "password": "74347a030dc5953c3b69da6b33a8385f",
          "rest_id": "x1xm",
          "sync": 1
      },
      {
          "id": "go_eat",
          "order_type": 3,
          "name": "Go Eat",
          "img": "go_eat.png",
          "status": 1,
          "code": "",
          "comm_amt": 12,
          "comm_typ": "percentage",
          "pkg_applicable": 1
      }
  ],
  "settings": {
      "print": {
          "cash_drawer": 31,
          "master_counter_list": 1,
          "master_docket": 1,
          "on_decline": 3,
          "on_void_unaccepted": 3,
          "on_void_accepted": 3,
          "on_void_new_itr": 3,
          "on_accept_new_order": 3,
          "on_accept_new_itr": 3,
          "on_settle": 3,
          "on_table_change": 3,
          "show_logo": 1,
          "format_code": "002",
          "separate_docket": 1,
          "void_format_code": "001",
          "void_separate_docket": 1,
          "header": {
              "prepend": [
                  "Caravan Cafe Sdn Bhd",
                  "Co. No. 123456789"
              ],
              "append": [
                  "",
                  "SST No.: B16-2011-32100018",
                  "",
                  "Dine-In, Home Delivery & Takeaway",
                  "www.caravandev.com",
                  "019 291 4801",
                  "",
                  "Follow us on Instagram",
                  "@caravandev"
              ]
          },
          "pmt_mode_in_body": 1,
          "print_delay": 3000,
          "item_align": "l",
          "font_size": "s",
          "enabled": 1,
          "on_accept_enabled": 1,
          "post_settle": 3,
          "void_enabled": 1,
          "show_op_order_id": 11,
          "inst_font": "s",
          "sname": 0,
          "table_no_position": "t",
          "uname": 0,
          "char_page_code": 1053,
          "feed_point": 45,
          "language_code": 96,
          "response_format": 1,
          "cash_mgt_format_override": 0,
          "slip_font": {
              "bill": "s",
              "counter": "s",
              "master_order_list": "s",
              "master_docket": "s",
              "table_change": "s",
              "cash_in_out": "s",
              "cash_mgt_report": "s"
          },
          "configurable_settings": {
              "bill_receipt": [],
              "counter_receipt": {
                  "counter_name": {
                      "fs": "s",
                      "ft": "n"
                  },
                  "order_type": {
                      "show": 1,
                      "section": "h",
                      "fs": "m",
                      "o_type": 7,
                      "ft": "b",
                      "priority": 1
                  },
                  "order_seq": {
                      "name": "ORDER NO",
                      "show": 1,
                      "section": "h",
                      "fs": "m",
                      "o_type": 7,
                      "ft": "b",
                      "priority": 1
                  },
                  "invoice_no": {
                      "name": "INVOICE NO",
                      "show": 1,
                      "section": "h",
                      "fs": "s",
                      "o_type": 7,
                      "ft": "b",
                      "priority": 1
                  },
                  "pax": {
                      "name": "PAX",
                      "show": 1,
                      "section": "h",
                      "fs": "s",
                      "o_type": 7,
                      "ft": "n",
                      "priority": 1
                  },
                  "date": {
                      "name": "DATE",
                      "show": 0,
                      "section": "h",
                      "fs": "s",
                      "o_type": 7,
                      "ft": "n",
                      "priority": 1
                  },
                  "date_time": {
                      "name": "BILL DATE",
                      "show": 1,
                      "section": "h",
                      "fs": "s",
                      "o_type": 7,
                      "ft": "n",
                      "priority": 1
                  },
                  "time": {
                      "name": "TIME",
                      "show": 1,
                      "section": "h",
                      "fs": "s",
                      "o_type": 7,
                      "ft": "n",
                      "priority": 1
                  },
                  "table": {
                      "name": "TABLE NO",
                      "show": 1,
                      "section": "h",
                      "fs": "m",
                      "o_type": 7,
                      "ft": "b",
                      "priority": 1
                  },
                  "staff_name": {
                      "name": "STAFF NAME",
                      "show": 1,
                      "section": "h",
                      "fs": "s",
                      "o_type": 7,
                      "ft": "n",
                      "priority": 1
                  },
                  "customer_name": {
                      "name": "CUSTOMER NAME",
                      "show": 1,
                      "section": "h",
                      "fs": "s",
                      "o_type": 7,
                      "ft": "n",
                      "priority": 1
                  },
                  "customer_phone": {
                      "name": "CUSTOMER PHONE",
                      "show": 0,
                      "section": "h",
                      "fs": "s",
                      "o_type": 7,
                      "ft": "n",
                      "priority": 1
                  },
                  "no_of_items": {
                      "name": "NUMBER OF ITEMS",
                      "show": 0,
                      "section": "h",
                      "fs": "m",
                      "o_type": 7,
                      "ft": "b",
                      "priority": 1,
                      "fa": "r"
                  },
                  "item_name": {
                      "fs": "m",
                      "ft": "n"
                  },
                  "variant": {
                      "fs": "m",
                      "ft": "b"
                  },
                  "addon": {
                      "fs": "m",
                      "ft": "n"
                  },
                  "notes": {
                      "fs": "s",
                      "ft": "n"
                  },
                  "allergies": {
                      "fs": "s",
                      "ft": "n"
                  }
              }
          }
      },
      "settlement": {
          "enable": 0,
          "visible": 0
      },
      "login": {
          "skip_verification": 0
      },
      "reports": {
          "enable_eod": 1,
          "eod_printer": "192.168.1.150:9100",
          "eod_font_size": "6px",
          "eod_page_width": "130px",
          "full_eod": 0
      },
      "global": {
          "visible_on_app": 1,
          "posItemPriceTKasDinein": 1,
          "fp_integration": 1,
          "pos": 1,
          "lock_screen": 0,
          "cash_registry": 1,
          "edit_commision": 1,
          "hide_action_button": 0,
          "lock_screen_idle": 10,
          "lock_screen_timeout": 20,
          "loyalty": 0,
          "pos_view": "l",
          "skip_pkg_chrg": 2,
          "skip_pkg_chrg_order_type": 4,
          "special_menu": 1,
          "split_bill": 1,
          "tossed_specific": 1,
          "void": 1,
          "table_layout": 1,
          "delete_order": 1,
          "gf_integration": 0,
          "void_item_after_completed": 0,
          "mark_prepared_sms": 1,
          "loyalty_v2": true,
          "auto_accept": 7,
          "auto_accept_sch": 7,
          "loyalty_v2_visible_on_pos": 0,
          "multiple_addon": 1,
          "takeaway_cash_enable": 1,
          "service_bell_enable": 1,
          "cust_info_popup": 1,
          "veg_option_enable": 1,
          "enable_schedule_order": 1,
          "enable_pre_paid_order": 1,
          "pre_paid_order": 7,
          "item_level_discount": 1,
          "store_credit_hq_lvl": 0,
          "use_es_service": 1,
          "whatsapp_notifier_order_status": 1,
          "skip_service_chrg": 0,
          "offline_sync": 1,
          "custom_order_dashboard": 0,
          "socket_printing": 1,
          "tp_voucher": 1,
          "enable_rest_food_logo": 0,
          "no_login_workflow": 0,
          "disable_add_more_items": 0,
          "hide_download_popup": 0,
          "hide_order_image": 0
      },
      "menu": {
          "item_code": 31,
          "pax": 1,
          "item_code_max_len": 4,
          "new_variation": 1
      },
      "sounds": {
          "selected": "sound3.wav",
          "repeat": 1,
          "timeout": 10000
      },
      "discount": {
          "preset": 0
      },
      "delivery": {
          "enabled": 1,
          "car_min_items": 6,
          "rest_reach_min_time": "3",
          "rest_reach_min_time_scheduled": 4
      },
      "hubspot": {
          "deal_id": 123870987
      }
  },
  "open_items": {
      "def_cat": "f46738154879d768c15c689d131431b7669061c5da880501d3bc528c1c57e30d",
      "def_subcat": "0e2e40824d5f1f9f35bda1e322e6598ef279d44aa52b6e8720727793496df7d0"
  },
  "fees": [
      {
          "id": "delivery",
          "status": 1,
          "name": "Delivery Fee",
          "tax": 0,
          "data": [
              0
          ]
      },
      {
          "status": 1,
          "type": "percentage",
          "order_type": [
              0,
              1,
              2
          ],
          "data": {
              "percentage_amount": 5
          },
          "tax": 0,
          "applicable_on": [
              "order"
          ],
          "class": "sst_tax",
          "id": "sst_tax",
          "name": "SST",
          "applicable_cat": [],
          "applicable_subcat": []
      },
      {
          "status": 1,
          "type": "percentage",
          "order_type": [
              0,
              1,
              2
          ],
          "data": {
              "percentage_amount": 10
          },
          "tax": 0,
          "applicable_on": [
              "order"
          ],
          "class": "service_tax",
          "id": "service_tax",
          "name": "Service Charge",
          "applicable_cat": [],
          "applicable_subcat": []
      },
      {
          "status": 1,
          "type": "fixed",
          "order_type": [
              2
          ],
          "data": {
              "fixed_amount": 5
          },
          "tax": 0,
          "applicable_on": [
              "order"
          ],
          "applicable_cat": [],
          "applicable_subcat": [],
          "class": "packaging_charge",
          "id": "packaging_charge_7kqy",
          "name": "Packaging Charges",
          "sub_name": "Packaging Charges"
      }
  ],
  "quick_notes": [
      {
          "id": "Z1rK2",
          "note": "hot and spicy",
          "visible_to_user": 1
      },
      {
          "id": "c6DRh",
          "note": "Sweet & Sour",
          "visible_to_user": 1
      },
      {
          "id": "79XzU",
          "note": "Less Chilly",
          "visible_to_user": 0
      },
      {
          "id": "w0mMN",
          "note": "extreme spicy",
          "visible_to_user": 0
      },
      {
          "id": "c64cc517c4fc46ad9d6bb8842670106a",
          "note": "fdfv",
          "visible_to_user": 1
      },
      {
          "id": "ayhVH",
          "note": "dfsgdfhfgjgyhjkghkmfchtsefwafdwadAfDCAsfCSZDFSDHGDFHDFHGFJGHMJHGJGHJGHJFJFHDFHSGSD",
          "visible_to_user": 1
      },
      {
          "id": "dMKvY",
          "note": "Testinnnngg sldjflsjdflesdf lsdkfjlsdjf lsdkjflsjf lsdkjflsdjf ldjdflkjsdflkj lsdflsdjflsfjlsdkjflksdjf sldjfjlsdkjflksdjflksdjflksdflkj",
          "visible_to_user": 1
      },
      {
          "id": "04c5cdee91cd4fc1bb1e69715a0b81b1",
          "note": ".,,LML",
          "visible_to_user": 1
      }
  ],
  "printer": "192.168.1.150:9100",
  "created_at": 1610646834,
  "address_1": "Persiaran Masjid, Shah Alam, Selangor, Malaysia",
  "address_2": "LG24, LG Floor Da Men Mall USj11",
  "delivery_settings": {
      "del_fee_concession": {
          "status": 1,
          "type": null,
          "amount": null,
          "min_cart_value": 100
      },
      "delivery_type": 1,
      "fixed_distance": null,
      "fixed_price": null,
      "self_delivery_limit": {
          "delivery_limit": null,
          "status": 0
      },
      "subsequent_price": null
  },
  "last_order_at": 1636722352,
  "alias": "YGAf",
  "report_timings": [
      {
          "id": "VM0cd8Xfcp4l",
          "name": "reporting hour 1",
          "timings": [
              540,
              1260
          ],
          "is_default": 0,
          "status": 1
      },
      {
          "id": "EXfIA7bWF5fK",
          "name": "dummy timing",
          "timings": [
              600,
              1080
          ],
          "is_default": 1,
          "status": 1
      },
      {
          "id": "PbKZ0eTT9PEk",
          "name": "sdff",
          "timings": [
              540,
              1325
          ],
          "is_default": 0,
          "status": 1
      },
      {
          "id": "JvGaMjTqWsgc",
          "name": "ewrw",
          "timings": [
              660,
              1260
          ],
          "is_default": 0,
          "status": 1
      }
  ],
  "loyalty_settings_v2": {
      "cashback": 50,
      "banner_path": "{\"id\":\"template-1\",\"type\":1,\"img\":\"https://d1xkxcid7icwfl.cloudfront.net/promotion-templates/bg-1.png\",\"img_with_text\":\"https://d1xkxcid7icwfl.cloudfront.net/promotion-templates/bg-1-text.png\",\"bg_color\":\"#f8d77b\",\"bottom\":{\"img1\":\"https://d1xkxcid7icwfl.cloudfront.net/promotion-templates/menu-1.svg\",\"img2\":\"https://d1xkxcid7icwfl.cloudfront.net/promotion-templates/order-1.svg\",\"img3\":\"https://d1xkxcid7icwfl.cloudfront.net/promotion-templates/payment-1.svg\"},\"properties\":{\"text1\":{\"color\":\"#000000\",\"font-size\":\"16px\",\"font-weight\":\"bold\",\"align\":\"center\"},\"text2\":{\"color\":\"#F75841\",\"font-size\":\"36px\",\"font-weight\":\"bold\",\"align\":\"center\"},\"text3\":{\"color\":\"#000000\",\"font-size\":\"16px\",\"font-weight\":\"bold\",\"align\":\"center\"},\"text4\":{\"color\":\"#000000\",\"font-size\":\"14px\",\"font-weight\":\"normal\",\"align\":\"center\"}},\"button\":{\"color\":\"#6cc433\",\"font-size\":\"13px\",\"font-weight\":\"bold\"}}",
      "order_types": [
          "DINEIN",
          "TAKEAYPICKUP",
          "DLEV"
      ],
      "visibility": true,
      "is_loyalty_active": true,
      "min_item_value": 30,
      "sub_category_ids": "7dbc198b5d39982a71b3a611439b4c9187095b27d0bf0e08685c8376d532d0af,166d22616b4256c288b3cb8d8a916de7e20d6a18246a6e4ed8f1bb924594f624,38d2aa7a04b1277fe817d80a2f5549efdece35a695044634c416cb0ac8145e39",
      "sub_text": "abcd",
      "heading": "abcd",
      "expiry_days": 45,
      "order_type_names": {
          "DINEIN": "Dine in",
          "TAKEAYPICKUP": "Pick Up",
          "DLEV": "Delivery"
      }
  },
  "custom_print": [
      {
          "item_id": "7bdb5ff9d82d47a99f3f929f1220e8bc",
          "count": 10
      },
      {
          "item_id": "c2b806b56ca043da93ae05337d82464e",
          "count": 3
      },
      {
          "item_id": "4e1c1568ecb045fd9176b9134356785b",
          "count": 20
      },
      {
          "item_id": "dc27ace1ab024f4383d3ee81b7635467",
          "count": 2
      }
  ],
  "avg_rating": 4.55555555555556,
  "total_rating": 9,
  "hq_id": "5a28e2885772410ba5ef29a0f07d9603",
  "curr_code": "MYR",
  "curr_sym": "RM",
  "language": "en_US",
  "restaurant_food_logo": "https://d1xkxcid7icwfl.cloudfront.net/restaurant_image/482a7a5888614fa69d3672c6a681c7a0_1650605514.jpg",
  "serviceable": {
      "next_serviceable_day": 1,
      "next_serviceable_day_string": "Tomorrow",
      "next_serviceable_time_string": "12:01 AM",
      "next_serviceable_string": "Restaurant is currently closed. Will open Tomorrow at 12:01 AM.",
      "next_serviceable_minute": 1,
      "is_serviceable": 1,
      "is_dl_serviceable": 1,
      "is_ta_serviceable": 1,
      "is_dn_serviceable": 1,
      "is_next_serviceable": 1
  }
}

const order_details= {
  "order_id": "OFF-jpnwqw7wu7xpw573wv3t8zicm3shmuqa",
  "order_no": "56722102",
  "order_seq": "L-1",
  "floor_id": "NzO15b8H",
  "floor_name": "3rd Floor",
  "user_id": "280576f206d3e9c751779668bdff069c6a52ca45d438e068a4f943fc35bef5ef",
  "items": [
      {
          "itr": 1,
          "item_id": "4b5d9212fd6246c795f39f60a2a2a79b",
          "item_name": "Burger with green sauce",
          "item_quantity": 1,
          "original_price": 12,
          "item_price": 12,
          "discount_per": 0,
          "reward_id": "",
          "kitchen_counter_id": null,
          "kitchen_picked_at": null,
          "kitchen_picked_by": "",
          "kitchen_time_to_complete": null,
          "order_item_id": "ei5m0qa985snk5f5uc4dm5okjn2okjba5yscj",
          "item_status": 1,
          "is_combo_item": 0,
          "prepared_at": 0,
          "canceled_at": 0,
          "void_at": 0,
          "declined_at": 0,
          "decline_reason": [],
          "base_qty": 1,
          "unit": "number",
          "gvariations": null,
          "variation_ids": null,
          "is_new_variation": 1,
          "new_variation": [
              {
                  "status": 1,
                  "options": [
                      {
                          "option_id": "WD3f1DHAQr",
                          "option_name": "Coca cola",
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "inventory_usage_details": [],
                          "status": 1,
                          "selected": true
                      },
                      {
                          "option_id": "wZlENQT9RN",
                          "option_name": "Sprite",
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "inventory_usage_details": [],
                          "status": 1,
                          "selected": false
                      },
                      {
                          "option_id": "P8oNMkWhH9",
                          "option_name": "Fanta",
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "status": 1,
                          "selected": false
                      },
                      {
                          "option_id": "zWc1YQrZDE",
                          "option_name": "Pepsi",
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "status": 1,
                          "selected": false
                      }
                  ],
                  "visible": [
                      0,
                      1,
                      2
                  ],
                  "group_id": "fdc7c721b22640f6a92b69a3d35f8384",
                  "next_available": 0,
                  "type": 1,
                  "group_name": "Choices Of Soft Drinks",
                  "choice_type": 1,
                  "min_choice": 1,
                  "max_choice": 1
              },
              {
                  "status": 1,
                  "options": [
                      {
                          "option_id": "25ca8wb0II",
                          "option_name": "1",
                          "status": 1,
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "selected": false
                      },
                      {
                          "option_id": "r99ymPXrop",
                          "option_name": "2",
                          "status": 1,
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "selected": false
                      },
                      {
                          "option_id": "D7KOmJzXxQ",
                          "option_name": "3",
                          "status": 1,
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "selected": false
                      },
                      {
                          "option_id": "kcuHh4Pte2",
                          "option_name": "4",
                          "status": 1,
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "selected": false
                      },
                      {
                          "option_id": "JhF5QJCAOI",
                          "option_name": "5",
                          "status": 1,
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 1,
                          "selected": false
                      },
                      {
                          "option_id": "FDRx3XIhBx",
                          "option_name": "6",
                          "status": 1,
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "selected": false
                      },
                      {
                          "option_id": "Yt6pHY096J",
                          "option_name": "7",
                          "status": 1,
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "selected": false
                      },
                      {
                          "option_id": "OPsxg9H0RK",
                          "option_name": "8",
                          "status": 1,
                          "next_available": 0,
                          "visible": [
                              0,
                              1,
                              2
                          ],
                          "price": 0,
                          "selected": false
                      }
                  ],
                  "visible": [
                      0,
                      1,
                      2
                  ],
                  "group_id": "d54bd728f7de4cfdb59c4af7abd3bf5c",
                  "next_available": 0,
                  "type": 1,
                  "group_name": "test 2",
                  "choice_type": 2,
                  "min_choice": 0,
                  "max_choice": 7
              }
          ],
          "addon": [
              {
                  "id": "59fa10a1151a43b7906b256f83ee1f9e",
                  "qty": 5,
                  "name": "Hari Chatni",
                  "price": "0.00"
              }
          ],
          "addon_ids": "|59fa10a1151a43b7906b256f83ee1f9e",
          "gvariation_name": null,
          "variation_name": "Coca cola",
          "addons_name": "Hari Chatni",
          "category_id": "3b7e026637afb5b88f435ff20741500ec5c57370ddd51341183a8445b8ab8442",
          "subcategory_id": "8f4e2f08577a8e9ea3b0fd1a52d641b5eb811ea489dfd04d4ddfa53e1e3c1ec5",
          "open_item": 0,
          "item_code": "reg",
          "image_path": "https://d1xkxcid7icwfl.cloudfront.net/menu_items/diet.png",
          "item_hash": "4b5d9212fd6246c795f39f60a2a2a79b59fa10a1151a43b7906b256f83ee1f9e5WD3f1DHAQr"
      }
  ],
  "restaurant_name": "Caravan Dev",
  "order_status": 2,
  "created_at": 1650867356,
  "confirmed_at": 1650867356,
  "table_id": "i0Oim8TnYv",
  "table_no": "C1",
  "order_type": 0,
  "platform": "easyeat",
  "pax": 1,
  "base_roundoff": "0.05",
  "op_no": null,
  "coupon_id": "",
  "coupon_name": "",
  "no_enter": "922564999169865",
  "is_paid": 1,
  "reason": null,
  "discovery_page": null,
  "order_by": "MM",
  "name": "easyeat user",
  "phone": "922564999169865",
  "dial_code": "+60",
  "is_duplicate_order": null,
  "payment_status": 1,
  "restaurant_id": "482a7a5888614fa69d3672c6a681c7a0",
  "bill": {
      "bill_total": 13.8,
      "item_total": 12,
      "fees": [
          {
              "fee": 12,
              "fee_name": "Item Total",
              "id": "item_total",
              "tax": 0
          },
          {
              "fee": 0.6,
              "fee_name": "SST @5%",
              "id": "sst_tax",
              "tax": 0
          },
          {
              "fee": 1.2,
              "fee_name": "Service Charge @10%",
              "id": "service_tax",
              "tax": 0
          },
          {
              "fee": 0,
              "fee_name": "Round Off",
              "id": "round_off",
              "tax": 0
          }
      ],
      "payments": [],
      "balance": 13.8,
      "paid": 0
  },
  "created_locally": 1,
  "duplicate_order": false
}

const bill_details = {
  "bill_id": "gLpaEKnUG61639637109",
  "order_id": "TBuK7POEI41639637109",
  "payments": [],
  "user_id": "ff6bc5fba174a1a9a16beceae413ed22f8620cf17428ed184b8fb233145d3243",
  "restaurant_id": "c49dee80aeee27ab5e19689fcec88480",
  "fees": [
    {
      "id": "item_total",
      "fee_name": "Item Total",
      "fee": 30,
      "tax": 0,
    },
    {
      "id": "coupon_discount",
      "fee_name": "Discount",
      "fee": 0,
      "tax": 0,
    },
    {
      "id": "service_tax",
      "fee_name": "Service Charge @10%",
      "fee": 3,
      "tax": 0,
    },
    {
      "id": "sst_tax",
      "fee_name": "SST @6%",
      "fee": 1.8,
      "tax": 0,
    },
    {
      "id": "round_off",
      "fee_name": "Round Off",
      "fee": 0,
      "tax": 0,
    },
  ],
  "item_total": 30,
  "tax": 0,
  "bill_total": 34.8,
  "savings": 0,
  "earnings": 0,
  "balance": 34.8,
  "paid": 0,
  "date": "2021-12-16",
  "timestamp": 1639637109,
  "is_paid": 1,
};

const kitchen_details = {
  "kitchen_counter_id": "default",
  "counter_name": "unmapped items",
  "printer_name": "192.168.1.150:9100"
}
//console.log(getReceiptObject(rest_details, order_details, bill_details));
console.log(generateCounterReceipt(kitchen_details, rest_details, order_details));
// NOTE - Delete _id, ISODate types
//console.log(generateBillReceipt(rest_details, order_details, bill_details));
