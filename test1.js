const { generateBillReceipt, generateCounterReceipt } = require("./printing.js");

const rest_details = {
    "id": "482a7a5888614fa69d3672c6a681c7a0",
    "name": "Caravan Dev",
    "phone": "123456789",
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
    "logo": "https:d1xkxcid7icwfl.cloudfront.net/restaurant_image/482a7a5888614fa69d3672c6a681c7a0_1609998128.png",
    "address": "Jalan SS2/22, SS 2, Petaling Jaya, Selangor, Malaysia",
    "city": "Petaling Jaya",
    "pin_code": "47300",
    "state": "Selangor",
    "country": "Malaysia",
    "location": {
        "lat": 3.112947,
        "lon": 101.619176
    },
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
            101.619176,
            3.112947
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
            "id": "a2c88471bcc94015a0acacd81ee2817e",
            "name": "hq-addon-1",
            "price": 10,
            "status": 1,
            "itemids": [
                "5fe3b819e5a24b469ec1b2746d370dec",
                "3ee7555db3728f5006da96f08d7df27c1cf81b3c4f895cd530d125a32f13270f"
            ]
        },
        {
            "id": "25dcd6557347448fb3475ca9bbf57879",
            "name": "hq-addon-2",
            "price": 15,
            "status": 1,
            "itemids": [
                "60846e2300294d8c85621cd50f619fe9",
                "3ee7555db3728f5006da96f08d7df27c1cf81b3c4f895cd530d125a32f13270f"
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
                "09fb2168ee794516b45aff782de2bcad"
            ]
        },
        {
            "id": "c49db88e107d4b4a852aa46732ea03bf",
            "name": "hq-addon-2",
            "price": 15,
            "status": 1,
            "itemids": [
                "5fe3b819e5a24b469ec1b2746d370dec",
                "3ee7555db3728f5006da96f08d7df27c1cf81b3c4f895cd530d125a32f13270f",
                "1333a00b393b48b99e66a89e86f056e8"
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
            "name": "Chicken soup",
            "price": 5,
            "id": "e3b15031398347bca1dbaa2a0deef91d",
            "status": 1,
            "itemids": [
                "905d5b85bf8542f59ce4abe3db467ef0",
                "1333a00b393b48b99e66a89e86f056e8"
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
            "name": "test_manish",
            "price": 1,
            "id": "b647271010e04d6c9ff289baeb203b72",
            "status": 1,
            "itemids": []
        },
        {
            "name": "test_abcd",
            "price": 1,
            "id": "ea8c8dccfeac44f2b0402fc83339c4f6",
            "status": 1,
            "itemids": []
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
                "59359b7b38764580a70b1f4032a63d84"
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
            "name": "test",
            "price": 1,
            "id": "997600da8bec4622adf2e4e6345cce50",
            "status": 1,
            "printer": "window",
            "itemids": [
                "a68bd84eee50044a54a0ece12921aa070e272f2c937cb7d2d86240dc9a048c1e",
                "51aa2a5dbd6e40ceb8274aaaafdd2115",
                "09fb2168ee794516b45aff782de2bcad"
            ]
        },
        {
            "id": "2e55ccfec0054830ac2709a049e87614",
            "name": "hq-addon-2",
            "price": 15,
            "status": 1,
            "itemids": [
                "5fe3b819e5a24b469ec1b2746d370dec",
                "59359b7b38764580a70b1f4032a63d84"
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
            "name": "Hot Sauce",
            "price": 1,
            "id": "debf9d386b8244639d46f01b49ab046d",
            "status": 1,
            "itemids": [
                "a1edeed9fdb74f2bad11af7c377026f2",
                "e941b41cbe4f4745bfb374651b70be72"
            ],
            "max_qty": 1
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
                "a1edeed9fdb74f2bad11af7c377026f2"
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
            "name": "Mustard",
            "price": 1,
            "id": "3255208ba07241ff94c53a4410cfdf4e",
            "status": 1,
            "itemids": [
                "a1edeed9fdb74f2bad11af7c377026f2",
                "39489550251748cba95c2c650a087fe5"
            ]
        },
        {
            "name": "taj mahal",
            "price": 2,
            "id": "8014c44ef2df45c4a5addfab3d0b8e76",
            "status": 0,
            "itemids": [
                "73edc24d70644ef9a59aa5d31b29ea80",
                "bbed5450fa5e4b03836eb22dad887180",
                "4b1fb90810a540e8aa4f9ee5c1fefdff"
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
            "name": "create new add-on testing",
            "price": 100,
            "status": 1,
            "id": "e660b200607746d5afcee5394aa8fc29",
            "itemids": [
                "abba2f6033dd499e8c337ecd5173b811",
                "c59f2e688b3d4cf58c1a5d5515d77325",
                "c5bb2a68fa864f2f8e4b5f7921a42aaf",
                "a18b179388cb481ea1c1bacb29d0bab3",
                "e41c4f920c594175b4445726c39d0faf",
                "fea24f76c2e244d8b54486d0e55c6928",
                "d80936744c5c4a67805bf0a823cfabf4",
                "2de1f2109cfc41a389de6f8fd20693b7",
                "809ca7380af647ad8e82dec0a0f2537a",
                "3630f4b6c3af4440b7392346d6d2e838"
            ],
            "max_qty": 2
        },
        {
            "name": "create new add-on testing",
            "price": 100,
            "status": 1,
            "id": "e660b200607746d5afcee5394aa8fc29",
            "itemids": [
                "abba2f6033dd499e8c337ecd5173b811",
                "c59f2e688b3d4cf58c1a5d5515d77325",
                "c5bb2a68fa864f2f8e4b5f7921a42aaf",
                "a18b179388cb481ea1c1bacb29d0bab3",
                "e41c4f920c594175b4445726c39d0faf",
                "fea24f76c2e244d8b54486d0e55c6928",
                "d80936744c5c4a67805bf0a823cfabf4",
                "2de1f2109cfc41a389de6f8fd20693b7",
                "809ca7380af647ad8e82dec0a0f2537a",
                "3630f4b6c3af4440b7392346d6d2e838"
            ],
            "max_qty": 2
        },
        {
            "name": "create new add-on testing",
            "price": 100,
            "status": 1,
            "id": "e660b200607746d5afcee5394aa8fc29",
            "itemids": [
                "abba2f6033dd499e8c337ecd5173b811",
                "c59f2e688b3d4cf58c1a5d5515d77325",
                "c5bb2a68fa864f2f8e4b5f7921a42aaf",
                "a18b179388cb481ea1c1bacb29d0bab3",
                "e41c4f920c594175b4445726c39d0faf",
                "fea24f76c2e244d8b54486d0e55c6928",
                "d80936744c5c4a67805bf0a823cfabf4",
                "2de1f2109cfc41a389de6f8fd20693b7",
                "809ca7380af647ad8e82dec0a0f2537a",
                "3630f4b6c3af4440b7392346d6d2e838"
            ],
            "max_qty": 2
        },
        {
            "name": "fff",
            "price": 10,
            "status": 1,
            "id": "56157ef0ad2c44fba47550fb95a2edc4",
            "itemids": [
                "c3be1d6fb8e049a09947cc1332009afa",
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
            "master_docket": 1,
            "on_decline": 15,
            "on_void_unaccepted": 15,
            "on_void_accepted": 15,
            "on_void_new_itr": 15,
            "on_accept_new_order": 15,
            "on_accept_new_itr": 15,
            "on_settle": 15,
            "on_table_change": 15,
            "show_logo": 0,
            "format_code": null,
            "separate_docket": 0,
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
            "post_settle": 15,
            "void_enabled": 1,
            "show_op_order_id": 15,
            "inst_font": "s",
            "sname": 0,
            "table_no_position": "t",
            "uname": 0,
            "char_page_code": 0,
            "feed_point": 45,
            "language_code": 0,
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
                        "fs": "m",
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
                        "show": 0,
                        "section": "h",
                        "fs": "s",
                        "o_type": 7,
                        "ft": "b",
                        "priority": 1
                    },
                    "pax": {
                        "name": "PAX",
                        "show": 0,
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
                        "show": 0,
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
                        "show": 0,
                        "section": "h",
                        "fs": "s",
                        "o_type": 7,
                        "ft": "n",
                        "priority": 1
                    },
                    "customer_name": {
                        "name": "CUSTOMER NAME",
                        "show": 0,
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
                        "ft": "n",
                        "priority": 1
                    },
                    "item_name": {
                        "fs": "m",
                        "ft": "n"
                    },
                    "variant": {
                        "fs": "s",
                        "ft": "b"
                    },
                    "addon": {
                        "fs": "s",
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
            "eod_printer": "192.168.1.100:9100",
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
            "auto_accept": 0,
            "auto_accept_sch": 0,
            "loyalty_v2_visible_on_pos": 1,
            "multiple_addon": 1,
            "takeaway_cash_enable": 1,
            "service_bell_enable": 1,
            "cust_info_popup": 1,
            "veg_option_enable": 1,
            "enable_schedule_order": 1,
            "enable_pre_paid_order": 0,
            "pre_paid_order": 7,
            "item_level_discount": 1,
            "store_credit_hq_lvl": 0,
            "use_es_service": 1,
            "whatsapp_notifier_order_status": 1,
            "skip_service_chrg": 0,
            "offline_sync": 1,
            "custom_order_dashboard": 0
        },
        "menu": {
            "item_code": 31,
            "pax": 0,
            "item_code_max_len": 3,
            "new_variation": 1
        },
        "sounds": {
            "selected": "sound3.wav",
            "repeat": 1,
            "timeout": 25000
        },
        "discount": {
            "preset": 0
        },
        "delivery": {
            "enabled": 1,
            "car_min_items": 6,
            "rest_reach_min_time": "3"
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
                "fixed_amount": 20
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
            "visible_to_user": 1
        },
        {
            "id": "w0mMN",
            "note": "extreme spicy",
            "visible_to_user": 0
        }
    ],
    "printer": "192.168.1.213:9100",
    "created_at": 1610646834,
    "address_1": "Jalan SS2/22, SS 2, Petaling Jaya, Selangor, Malaysia",
    "address_2": "",
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
            "id": "3eSij9Wd1ucl",
            "name": "reporting hour 1",
            "timings": [
                540,
                1260
            ],
            "is_default": 0,
            "status": 1
        },
        {
            "id": "6kcHxbTis729",
            "name": "dummy timing",
            "timings": [
                600,
                1080
            ],
            "is_default": 1,
            "status": 1
        },
        {
            "id": "MhCoU6RVaHGm",
            "name": "sdff",
            "timings": [
                540,
                1325
            ],
            "is_default": 0,
            "status": 1
        },
        {
            "id": "de3zErpUSQ72",
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
        "cashback": 100,
        "order_types": [
            "DINEIN",
            "TAKEAYPICKUP",
            "DLEV"
        ],
        "visibility": true,
        "is_loyalty_active": true,
        "min_item_value": 30,
        "sub_text": "Get 50% cashback",
        "heading": "GET LOYALTY",
        "expiry_days": 45,
        "order_type_names": {
            "DINEIN": "Dine in",
            "TAKEAYPICKUP": "Pick Up",
            "DLEV": "Delivery"
        }
    },
    "avg_rating": 4.55555555555556,
    "total_rating": 9,
    "hq_id": "5a28e2885772410ba5ef29a0f07d9603",
    "curr_code": "MYR",
    "curr_sym": "RM",
    "language": "en_US",
    "restaurant_food_logo": "https:d1xkxcid7icwfl.cloudfront.net/restaurant_image/482a7a5888614fa69d3672c6a681c7a0_1609998128.png",
    "serviceable": {
        "next_serviceable_day": 3,
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
    "order_id": "OFF-hew1d72agkot45mcz3rz4jh4hf9j1k9j",
    "order_no": "21247091",
    "user_id": "280576f206d3e9c751779668bdff069c6a52ca45d438e068a4f943fc35bef5ef",
    "restaurant_id": "482a7a5888614fa69d3672c6a681c7a0",
    "restaurant_name": "Caravan Dev",
    "order_status": 2,
    "created_at": 1648030613,
    "created_mongodate": "2022-03-23T18:17:56.967Z",
    "date": "2022-03-23",
    "confirmed_at": 1648030613,
    "canceled_at": 0,
    "mark_prepared_at": 0,
    "schedule_confirmed_at": 0,
    "estimated_time": 0,
    "completed_at": 0,
    "finished_at": 0,
    "table_id": "a4",
    "table_no": "4",
    "floor_id": "a",
    "floor_name": "Ground Section",
    "items": [
        {
            "itr": 1,
            "item_id": "08be88a279fcf191dfc96de5696c62ee7ab6bebe923e3c0fc38e82bfd9e469f0",
            "item_name": "Pisang Bakar Cheese Chocolate",
            "item_quantity": 1,
            "original_price": 10,
            "item_price": 10,
            "discount_per": 0,
            "reward_id": "",
            "kitchen_counter_id": "default",
            "kitchen_picked_at": null,
            "kitchen_picked_by": "",
            "kitchen_time_to_complete": null,
            "order_item_id": "6f9s6yw90ejhqcmplspfwyxcq45zwijof18or",
            "item_status": 1,
            "is_combo_item": 0,
            "prepared_at": 0,
            "canceled_at": 0,
            "void_at": 0,
            "declined_at": 0,
            "decline_reason": [],
            "base_qty": 1,
            "gvariations": null,
            "variation_ids": null,
            "addon_ids": null,
            "gvariation_name": null,
            "variation_name": "",
            "addons_name": "",
            "category_id": "c112ec45e9caec0abcf8434566cc58489fd88703b0c5f72787706e4cd360b104",
            "subcategory_id": "29571a0aa70d81d769f54b92ea2733085121ef72b2cfb60b0d76c22927a7917c",
            "open_item": 0,
            "item_code": null,
            "image_path": "https:d1xkxcid7icwfl.cloudfront.net/menu_items/diet.png"
        }
    ],
    "special_notes": "",
    "allergic_items": {},
    "address": "",
    "distance": 0,
    "order_type": 0,
    "delivery_partner": "",
    "delivery_assign_type": "",
    "address_obj": "",
    "platform": "easyeat",
    "pax": 0,
    "order_seq": "L-341",
    "op_no": "",
    "coupon_id": "",
    "coupon_name": "",
    "reason": "",
    "base_roundoff": "0.05",
    "discovery_page": 2,
    "order_by": "MM",
    "name": "easyeat user",
    "phone": "433343621130474",
    "dial_code": "+60",
    "time_epoch": 0,
    "scheduled": 0,
    "rest_reach_min_time": 0,
    "dtype": "",
    "dvalue": 0,
    "void_items": [],
    "balance": "11.50",
    "total_amount": 11.5,
    "total_tax": 0,
    "bill_amount": 11.5,
    "savings": 0,
    "earnings": 0,
    "amount_paid": 0,
    "bill": {
        "bill_id": "uDtBMjYWHsLGf0r1",
        "order_id": "OFF-hew1d72agkot45mcz3rz4jh4hf9j1k9j",
        "payments": [
            {
                "payment_id": "a02e64876b364c609b4c2669893b54e3",
                "amount": "0.00",
                "status": 1,
                "payment_method": "OFFLINE-CASH",
                "config_id": 1,
                "epoch": 1648030613845,
                "payment_channel": "offline-cash",
                "transaction_id": "",
                "collected_amt": 0,
                "returned_amt": 0,
                "offline_sync_payment": 1,
                "payment_type": "unknown"
            }
        ],
        "user_id": "280576f206d3e9c751779668bdff069c6a52ca45d438e068a4f943fc35bef5ef",
        "restaurant_id": "482a7a5888614fa69d3672c6a681c7a0",
        "fees": [
            {
                "fee": 10,
                "fee_name": "Item Total",
                "id": "item_total",
                "tax": 0
            },
            {
                "fee": 0.5,
                "fee_name": "SST @5%",
                "id": "sst_tax",
                "tax": 0
            },
            {
                "fee": 1,
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
        "item_total": 11.5,
        "tax": 0,
        "bill_total": 11.5,
        "savings": 0,
        "earnings": 0,
        "balance": "11.50",
        "paid": 0,
        "date": "2022-03-23",
        "timestamp": 1648030676
    },
    "payment_status": 1,
    "fees": [
        {
            "name": "Item Total",
            "fee": 10
        },
        {
            "name": "SST @5%",
            "fee": 0.5
        },
        {
            "name": "Service Charge @10%",
            "fee": 1
        },
        {
            "name": "Round Off",
            "fee": 0
        }
    ],
    "restaurant_logo": "https:d1xkxcid7icwfl.cloudfront.net/restaurant_image/482a7a5888614fa69d3672c6a681c7a0_1609998128.png"
}

const itr = 1

const kitchen_details={
    "kitchen_counter_id": "TG7VN1jLsC60a27f3d67de3",
    "counter_name": "kitchen",
    "printer_name": "192.168.1.100:9100"
}

console.log(JSON.stringify(generateCounterReceipt(kitchen_details, rest_details, order_details,1)));
