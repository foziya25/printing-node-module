const { enKeys } = require('../config/en');
const { idKeys } = require('../config/id');
const {
  SlipType,
  FontSize,
  FontType,
  FontAlign,
  CountryMapping,
  KeyName,
  AddonVariantReceiptEnum,
  AddonVariantNameEnum,
  AddonVariantBitEnum,
} = require('../config/enums');

const { getLocalizedData, getPrintLanguage, getSettingVal } = require('./utils');

// To format old next in new format
const formatv2 = (
  key = '',
  value,
  fs = FontSize.SMALL,
  ft = FontType.NORMAL,
  fa = FontAlign.LEFT,
) => {
  return {
    key: key,
    value: value,
    fs: fs,
    ft: ft,
    fa: fa,
  };
};
// Use to insert line break
function line_break(value = '-') {
  return { key: '_line_', value: value };
}

/* Function to insert order sequence in all receipts  */
const insertOrderSequence = (order_seq, settings, language) => {
  if (settings) {
    return formatv2(
      '',
      [{ name: `${localize(KeyName.ORDER_SEQ, language).toUpperCase()}: #${order_seq}` }],
      settings['fs'],
      settings['ft'],
      FontAlign.CENTER,
    );
  }
  return formatv2(
    '',
    [{ name: `${localize(KeyName.ORDER_SEQ, language).toUpperCase()}: #${order_seq}` }],
    undefined,
    FontType.BOLD,
    FontAlign.CENTER,
  );
};

const powered_by = () => {
  return {
    key: '',
    value: 'POWERED BY - EASYEAT.AI',
    fs: FontSize.SMALL,
    ft: FontType.BOLD,
    fa: FontAlign.CENTER,
  };
};

/* Set font size for entire slip */
function changeFontSize(obj, options) {
  const slip_font = options && options.slip_font ? options.slip_font : null;
  if (slip_font === FontSize.MEDIUM) {
    for (const item of obj['data']) {
      if (item.fs) {
        item.fs =
          item.fs === FontSize.SMALL
            ? FontSize.MEDIUM
            : item.fs === FontSize.MEDIUM
            ? FontSize.LARGE
            : item.fs;
      }
    }
  } else if (slip_font === FontSize.LARGE) {
    for (const item of obj['data']) {
      if (item.fs) {
        item.fs = item.fs ? FontSize.LARGE : item.fs;
      }
    }
  }
  return obj;
}

/* Common function to insert headers on all receipts */
function insertHeaders(obj, keys = [], language = CountryMapping.MALAYSIA.language) {
  const toInsert = [];
  keys.forEach((key) => {
    if (
      Object.keys(obj['body']).includes(key) &&
      obj['body'][key] &&
      obj['body'][key].toString().trim()
    ) {
      toInsert.push(
        formatv2('', [
          {
            name: `${localize(key, language).toUpperCase()}: ${obj['body'][key]
              .toString()
              .toUpperCase()}`,
          },
        ]),
      );
    }
  });
  return toInsert;
}

// Function to add items in printing config v2
function addItems(items, rest_details, configurable_settings, language) {
  const split_addon_variant = getSettingVal(rest_details, 'split_addon_variant');
  language = language || getPrintLanguage(rest_details);

  const temp_arr = [];
  temp_arr.push(
    formatv2(
      '',
      [
        { name: `${localize(KeyName.ITEM_NAME, language).toUpperCase()}` },
        { name: 'QTY', fw: 6, fa: FontAlign.RIGHT },
      ],
      configurable_settings ? configurable_settings['item_name']['fs'] : undefined,
      configurable_settings ? configurable_settings['item_name']['ft'] : undefined,
    ),
  );
  temp_arr.push(line_break());
  for (const item of items) {
    const strike = item['strike'] && item['strike'] === 1 ? 1 : 0;
    if (item['name'] && item['name'].trim()) {
      temp_arr.push(
        formatv2(
          '',
          [
            { name: item['name'].toUpperCase(), strike: strike },
            { name: item['qty'].toString(), fw: 6, fa: FontAlign.RIGHT, strike: strike },
          ],
          configurable_settings ? configurable_settings['item_name']['fs'] : undefined,
          configurable_settings ? configurable_settings['item_name']['ft'] : undefined,
        ),
      );
    }
    if (item['combo_name'] && item['combo_name'].trim()) {
      temp_arr.push(
        formatv2(
          '',
          [
            { name: `${item['combo_name'].toUpperCase()}`, strike: strike },
            { name: '', fw: 6 },
          ],
          configurable_settings ? configurable_settings['item_name']['fs'] : undefined,
          configurable_settings ? configurable_settings['item_name']['ft'] : undefined,
        ),
      );
    }
    if (item['addon'] && item['addon'].trim()) {
      splitAddonVariantByLine(
        item['addon'],
        AddonVariantNameEnum.ADDON,
        strike,
        AddonVariantReceiptEnum.OTHER,
        split_addon_variant,
        configurable_settings,
        language,
      ).forEach((elem) => {
        temp_arr.push(elem);
      });
    }
    if (item['variant'] && item['variant'].trim()) {
      const show_variant_qty_obj = {
        show: false,
      };
      if (!item['name'] || !item['name'].trim()) {
        show_variant_qty_obj.show = true;
        show_variant_qty_obj['qty'] = item['qty'].toString();
      }
      splitAddonVariantByLine(
        item['variant'],
        AddonVariantNameEnum.VARIANT,
        strike,
        AddonVariantReceiptEnum.OTHER,
        split_addon_variant,
        configurable_settings,
        language,
        show_variant_qty_obj,
      ).forEach((elem) => {
        temp_arr.push(elem);
      });
    }
    if (item['note'] && item['note'].trim()) {
      temp_arr.push(
        formatv2(
          '',
          [{ name: `NOTE: ${item['note'].toUpperCase()}` }, { name: '', fw: 6 }],
          configurable_settings ? configurable_settings['notes']['fs'] : undefined,
          configurable_settings ? configurable_settings['notes']['ft'] : undefined,
        ),
      );
    }
  }
  return temp_arr;
}

/* localization function */
function localize(key, language = CountryMapping.MALAYSIA.language) {
  // return key;
  if (!enKeys[key]) {
    return key;
  }
  language = language || CountryMapping.MALAYSIA.language;
  if (language === CountryMapping.INDONESIA.language) {
    return idKeys[key] ? idKeys[key] : enKeys[key];
  }
  return enKeys[key];
}

function insertFpAndThaiLanguageSupport(data, rest_details) {
  /*Feed point decides spacing between two lines*/
  const feed_point = rest_details['settings']['print']['feed_point'];
  /*Char page code is used to language support in printing*/
  const char_page_code = rest_details['settings']['print']['char_page_code'];
  const language_code = rest_details['settings']['print']['language_code'];
  if (feed_point) {
    data['fp'] = feed_point;
  }
  if (char_page_code) {
    data['char_page_code'] = char_page_code;
  }
  if (language_code) {
    data['language_code'] = language_code;
  }
}

function getCountryDetails(sub_key, value) {
  let country_details = {};
  for (const key of Object.keys(CountryMapping)) {
    if (CountryMapping[key][sub_key] === value) {
      country_details = CountryMapping[key];
      break;
    }
  }
  return country_details;
}

function getInternationalizedNumber(number, country) {
  if (isNaN(number)) {
    return number;
  }
  number = Number(number);
  const locale = getLocaleForCountry(country);
  const numberFormatter = getNumberFormatter(locale);
  return numberFormatter.format(number);
}

const getLocaleForCountry = (countryKey) => {
  let locale = 'ms-MY';
  try {
    if (typeof countryKey === 'string' && countryKey.trim() != '') {
      if (countryKey.length === 2) {
        // Handling for country_code being passed in country
        if (countryKey === CountryMapping.INDONESIA.country_code) {
          return CountryMapping.INDONESIA.locale;
        }
      } else {
        // Handling for country being passed
        if (countryKey === CountryMapping.INDONESIA.country) {
          return CountryMapping.INDONESIA.locale;
        }
      }
    }
  } catch (e) {}
  return locale;
};

const getNumberFormatter = (locale) => {
  const malaysiaFormatter = new Intl.NumberFormat(CountryMapping.MALAYSIA.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const indonesiaFormatter = new Intl.NumberFormat(CountryMapping.INDONESIA.locale);

  if (typeof locale === 'string' && locale.trim() != '') {
    if (locale === CountryMapping.INDONESIA.locale) {
      return indonesiaFormatter;
    }
  }
  return malaysiaFormatter;
};

function splitAddonVariantByLine(
  addon_variant,
  type,
  strike = 0,
  receipt_type,
  split_addon_variant,
  configurable_settings = null,
  language = PrintLanguage.DEFAULT,
  show_variant_qty_obj = { show: false },
) {
  const type_keyname_map = {
    [AddonVariantNameEnum.VARIANT]: KeyName.VARIANT,
    [AddonVariantNameEnum.ADDON]: KeyName.ADDON,
  };
  const emptyString = ' ';
  const addon_variant_filter = addon_variant.replace(/[()]/g, '');
  const addon_variant_arr = addon_variant_filter.split(',');
  const split_names_arr = [];
  if (receipt_type === AddonVariantReceiptEnum.RECEIPT) {
    if (type === AddonVariantNameEnum.VARIANT) {
      if (!((split_addon_variant & AddonVariantBitEnum.VARIANT) === AddonVariantBitEnum.VARIANT)) {
        return [
          formatv2(
            '',
            [
              { name: '', fw: 6, fa: FontAlign.LEFT },
              { name: `${localize(KeyName.VARIANT, language)}: ${addon_variant.toUpperCase()}` },
              { name: '', fw: 10, fa: FontAlign.RIGHT },
            ],
            configurable_settings ? configurable_settings['variant']['fs'] : undefined,
            configurable_settings ? configurable_settings['variant']['ft'] : undefined,
          ),
        ];
      }
    } else if (type === AddonVariantNameEnum.ADDON) {
      if (!((split_addon_variant & AddonVariantBitEnum.ADDON) === AddonVariantBitEnum.ADDON)) {
        return [
          formatv2(
            '',
            [
              { name: '', fw: 6, fa: FontAlign.LEFT },
              { name: `${localize(KeyName.ADDON, language)}: ${addon_variant.toUpperCase()}` },
              { name: '', fw: 10, fa: FontAlign.RIGHT },
            ],
            configurable_settings ? configurable_settings['addon']['fs'] : undefined,
            configurable_settings ? configurable_settings['addon']['ft'] : undefined,
          ),
        ];
      }
    }

    for (let idx = 0; idx < addon_variant_arr.length; idx++) {
      if (idx === 0) {
        split_names_arr.push(
          formatv2(
            '',
            [
              { name: '', fw: 6, fa: FontAlign.LEFT },
              {
                name: `${localize(
                  type_keyname_map[type],
                  language,
                ).toUpperCase()}: ${addon_variant_arr[idx].toUpperCase()}`,
              },
              { name: '', fw: 10, fa: FontAlign.RIGHT },
            ],
            configurable_settings ? configurable_settings[type.toLowerCase()]['fs'] : undefined,
            configurable_settings ? configurable_settings[type.toLowerCase()]['ft'] : undefined,
          ),
        );
      } else {
        split_names_arr.push(
          formatv2(
            '',
            [
              { name: '', fw: 6, fa: FontAlign.LEFT },
              {
                name: `${emptyString.repeat(type.length)} ${addon_variant_arr[idx].toUpperCase()}`,
              },
              { name: '', fw: 10, fa: FontAlign.RIGHT },
            ],
            configurable_settings ? configurable_settings[type.toLowerCase()]['fs'] : undefined,
            configurable_settings ? configurable_settings[type.toLowerCase()]['ft'] : undefined,
          ),
        );
      }
    }
  } else {
    if (type === AddonVariantNameEnum.VARIANT) {
      if (!((split_addon_variant & AddonVariantBitEnum.VARIANT) === AddonVariantBitEnum.VARIANT)) {
        return [
          formatv2(
            '',
            [
              {
                name: `${localize(KeyName.VARIANT, language)}: ${addon_variant.toUpperCase()}`,
                strike: strike,
              },
              {
                name: show_variant_qty_obj.show ? show_variant_qty_obj.qty : '',
                fw: 6,
                strike: strike,
              },
            ],
            configurable_settings ? configurable_settings[type.toLowerCase()]['fs'] : undefined,
            configurable_settings ? configurable_settings[type.toLowerCase()]['ft'] : undefined,
          ),
        ];
      }
    } else if (type === AddonVariantNameEnum.ADDON) {
      if (!((split_addon_variant & AddonVariantBitEnum.ADDON) === AddonVariantBitEnum.ADDON)) {
        return [
          formatv2(
            '',
            [
              {
                name: `${localize(KeyName.ADDON, language)}: ${addon_variant.toUpperCase()}`,
                strike: strike,
              },
              { name: '', fw: 6, strike: strike },
            ],
            configurable_settings ? configurable_settings[type.toLowerCase()]['fs'] : undefined,
            configurable_settings ? configurable_settings[type.toLowerCase()]['ft'] : undefined,
          ),
        ];
      }
    }
    let str = '';
    if (type === AddonVariantNameEnum.VARIANT) {
      str = show_variant_qty_obj.show ? show_variant_qty_obj.qty : '';
    }
    for (let idx = 0; idx < addon_variant_arr.length; idx++) {
      if (idx === 0) {
        split_names_arr.push(
          formatv2(
            '',
            [
              {
                name: `${localize(
                  type_keyname_map[type],
                  language,
                ).toUpperCase()}: ${addon_variant_arr[idx].toUpperCase()}`,
                strike: strike,
              },
              { name: str, fw: 6, strike: strike },
            ],
            configurable_settings ? configurable_settings[type.toLowerCase()]['fs'] : undefined,
            configurable_settings ? configurable_settings[type.toLowerCase()]['ft'] : undefined,
          ),
        );
      } else {
        split_names_arr.push(
          formatv2(
            '',
            [
              {
                name: `${emptyString.repeat(type.length)} ${addon_variant_arr[idx].toUpperCase()}`,
                strike: strike,
              },
              { name: str, fw: 6, strike: strike },
            ],
            configurable_settings ? configurable_settings[type.toLowerCase()]['fs'] : undefined,
            configurable_settings ? configurable_settings[type.toLowerCase()]['ft'] : undefined,
          ),
        );
      }
    }
  }

  return split_names_arr;
}

function localiseFeeNames(fee_name, language = PrintLanguage.DEFAULT) {
  const key_map = {
    Discount: KeyName.DISCOUNT,
    'Delivery Fee': KeyName.DELIVERY_FEE,
    'Round Off': KeyName.ROUND_OFF,
    total: KeyName.TOTAL,
    [KeyName.PAYMENT_MODE]: KeyName.PAYMENT_MODE,
    'Amount Paid': KeyName.AMOUNT_PAID,
    'Cash Received': KeyName.CASH_RECEIVED,
    'Cash Returned': KeyName.CASH_RETURNED,
    'Transaction ID': KeyName.TRANSACTION_ID,
    balance: KeyName.BALANCE,
    'Payment Mode': KeyName.PAYMENT_MODE,
  };
  for (let [key, value] of Object.entries(key_map)) {
    if (fee_name.toLowerCase().includes(key.toLowerCase())) {
      const local_name = localize(value, language);
      if (local_name !== 'No Key Found') {
        return fee_name.replace(key, local_name);
      }
    }
  }
  return fee_name;
}

function localiseDbNames(name, language = PrintLanguage.DEFAULT) {
  const db_names_map = {
    'ORDER NO': KeyName.ORDER_SEQ,
    'INVOICE NO': KeyName.INVOICE,
    PAX: KeyName.PAX,
    DATE: KeyName.DATE,
    'BILL DATE': KeyName.BILl_DATE,
    TIME: KeyName.TIME,
    'TABLE NO': KeyName.TABLE,
    'STAFF NAME': KeyName.STAFF_NAME,
    'CUSTOMER NAME': KeyName.CUSTOMER_NAME,
    'CUSTOMER PHONE': KeyName.CUSTOMER_PHONE,
    'NUMBER OF ITEMS': KeyName.NO_OF_ITEMS,
  };

  if (db_names_map[name.toUpperCase()]) {
    const str = localize(db_names_map[name], language).toUpperCase();
    if (str === 'No Key Found') {
      return name;
    } else {
      return str;
    }
  } else {
    return name;
  }
}

function insertCustomHeaderAndFooter(
  settings,
  section,
  obj,
  order_type,
  language = PrintLanguage.DEFAULT,
) {
  const toInsert = [];
  for (const [key, val] of Object.entries(settings)) {
    if (obj['body'][key] && obj['body'][key].toString().trim()) {
      if (!val.hasOwnProperty('show') || val['show'] === 1) {
        if (
          !val.hasOwnProperty('o_type') ||
          (val['o_type'] && (order_type & val['o_type']) === order_type)
        ) {
          if (
            (!val.hasOwnProperty('section') && section === PrintSection.HEADER) ||
            val['section'] === section
          ) {
            toInsert.push(
              formatv2(
                '',
                [
                  {
                    name: `${
                      val['name'] ? localiseDbNames(val['name'], language) : key.toUpperCase()
                    }: ${obj['body'][key].toString().toUpperCase()}`,
                  },
                ],
                val['fs'],
                val['ft'],
              ),
            );
          }
        }
      }
    }
  }
  return toInsert;
}

function localiseDrawerNames(key, language = 'en-US') {
  const key_map = {
    'drawer-kick': KeyName.DRAWER_KICK,
    'open-cashier': KeyName.OPEN_CASHIER,
    'close-cashier': KeyName.CLOSE_CASHIER,
    'cash-in': KeyName.CASH_IN,
    'cash-out': KeyName.CASH_OUT,
  };
  if (key_map[key]) {
    return localize(key_map[key], language);
  } else {
    return key;
  }
}

function getCashInfo(
  rest_details,
  cash_report_epoch,
  cash_mgt_data,
  cash_mgt_entries_data,
  country_code,
  language,
) {
  language = language || CountryMapping.MALAYSIA.language;
  country_code = country_code || CountryMapping.MALAYSIA.country_code;
  const country = getCountryDetails('country_code', country_code).country;
  //Check restaurant exists or not.
  if (!rest_details) {
    throw new Error(localize('restaurantNotFoundError', language));
  }

  //check if cash management system exists or not.
  // const pipeline1 = [
  //   { $match: { restaurant_id: restaurant_id } },
  //   { $project: { _id: 0, cash_in_drawer: 1, active_epoch: 1 } },
  // ];
  // const cash_info = await this.cashMgtRepository.cashMgtAggregation(pipeline1, false, true);
  const cash_info = cash_mgt_data;
  if (cash_info.length === 0) {
    throw new BadRequestException(localize('cashManagementNotFoundError', language));
  }
  const response = {};
  let active_epoch;
  if (cash_report_epoch > 0) {
    active_epoch = cash_report_epoch;
  } else {
    active_epoch = cash_info[0]['active_epoch'];
  }
  if (!active_epoch) {
    response['cash-in-drawer'] = 0;
    response['total-cash-in'] = 0;
    response['total-cash-out'] = 0;
    response['active-epoch'] = cash_info[0]['active_epoch'];
    return response;
  } else {
    response['total-open-cashier'] = 0;
    let type_wise_result = {};
    let result = [];
    for (cash_mgt_entry of cash_mgt_entries_data) {
      if (
        cash_mgt_entry['restaurant_id'] === rest_details['id'] &&
        cash_mgt_entry['created_at'] >= active_epoch
      ) {
        if (!type_wise_result[cash_mgt_entry['type']]) {
          type_wise_result[cash_mgt_entry['type']] = {
            total: 0,
          };
        }
        type_wise_result[cash_mgt_entry['type']]['type'] = cash_mgt_entry['type'];
        if (cash_mgt_entry['amount']) {
          type_wise_result[cash_mgt_entry['type']]['total'] += cash_mgt_entry['amount'];
        }
      }
    }
    if (Object.keys(type_wise_result).length > 0) {
      result.push({ txn_entries: Object.values(type_wise_result) });
    }
    // const result = await this.cashMgtRepository.aggregateTxnEntries(pipeline, false, true);
    // const result = cash_mgt_entries_data;
    if (result.length === 0) {
      response['cash-in-drawer'] = cash_info[0]['cash_in_drawer'].toFixed(2);
      response['total-cash-in'] = 0;
      response['total-cash-out'] = 0;
      response['active-epoch'] = cash_info[0]['active_epoch'];
    } else {
      response['cash-in-drawer'] = cash_info[0]['cash_in_drawer'].toFixed(2);
      response['active-epoch'] = cash_info[0]['active_epoch'];
      const cash_in_contains = result[0]['txn_entries'].some((type) => type.type === 'cash-in');
      const cash_out_contains = result[0]['txn_entries'].some((type) => type.type === 'cash-out');
      if (cash_in_contains && cash_out_contains) {
        result[0]['txn_entries'].forEach((type) => {
          response[`total-${type.type}`] = Number(type.total.toFixed(2));
        });
      } else if (cash_in_contains && !cash_out_contains) {
        result[0]['txn_entries'].forEach((type) => {
          response[`total-${type.type}`] = Number(type.total.toFixed(2));
          response[`total-cash-out`] = 0;
        });
      } else if (!cash_in_contains && cash_out_contains) {
        result[0]['txn_entries'].forEach((type) => {
          response[`total-cash-in`] = 0;
          response[`total-${type.type}`] = Number(type.total.toFixed(2));
        });
      } else {
        response['total-cash-in'] = 0;
        response['total-cash-out'] = 0;
        const open_cashier_obj = result[0].txn_entries.find((obj) => {
          return obj.type === 'open-cashier';
        });
        response['total-open-cashier'] = Number(open_cashier_obj.total.toFixed(2));
        // response['total-open-cashier'] = result[0].txn_entries[0].total.toFixed(2);
      }
    }
    response['cash-in-drawer'] = Number(
      (
        Number(response['total-cash-in']) -
        Number(response['total-cash-out']) +
        Number(response['total-open-cashier'])
      ).toFixed(2),
    );

    return getLocalizedData(
      response,
      '',
      country,
      ['cash-in-drawer', 'total-cash-in', 'total-cash-out', 'total-open-cashier'],
      [],
      [],
      '',
    );
  }
}

// function getInternationalizedNumber(number, country) {
//   if (isNaN(number)) {
//     return number;
//   }
//   number = Number(number);
//   const locale = getLocaleForCountry(country);
//   const numberFormatter = getNumberFormatter(locale);
//   return numberFormatter.format(number);
// }

function generateReportV2(obj, rest_details, for_close_enable) {
  const language = getPrintLanguage(rest_details);
  const data = {};
  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['pr_width'] = '72';
  data['data'] = [];
  data['data'].push(line_break());
  data['data'].push(
    formatv2(
      '',
      [
        {
          name: obj['counterName'].toUpperCase(),
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER,
    ),
  );
  data['data'].push(line_break());
  if (for_close_enable === 1) {
    data['data'].push(formatv2('', [{ name: `OPENING SHIFT: ${obj['open_cashier_date_time']}` }]));
    data['data'].push(formatv2('', [{ name: `CLOSING SHIFT: ${obj['close_cashier_date_time']}` }]));
  } else {
    data['data'].push(
      formatv2('', [{ name: `${localize(KeyName.DATE, language)}: ${obj['date']}` }]),
    );
    data['data'].push(
      formatv2('', [{ name: `${localize(KeyName.TIME, language)}: ${obj['time']}` }]),
    );
  }
  if (obj['name']) {
    data['data'].push(
      formatv2('', [
        {
          name: `${localize(KeyName.STAFF_NAME, language)}: ${obj['name'].toUpperCase()}`,
          ft: FontType.BOLD,
        },
      ]),
    );
  }
  data['data'].push(line_break());

  const local_key = [
    KeyName.OPENING_CASH_FLOAT,
    KeyName.TOTAL_CASH_IN,
    KeyName.CASH_IN_SALES,
    KeyName.CASH_IN_OTHERS,
    KeyName.TOTAL_CASH_OUT,
    KeyName.NET_CASH_BALANCE,
    KeyName.EXPECTED_CASH_IN_DRAWER,
    KeyName.ACTUAL_CASH_IN_DRAWER,
    KeyName.EXCESS_SHORT,
    KeyName.CLOSE_CASHIER,
  ];
  const curr_sym = rest_details['curr_sym'];

  for (const key of local_key) {
    if (Object.keys(obj).includes(key)) {
      data['data'].push(
        formatv2('', [
          {
            name: `${localize(key, language)}: ${
              key === KeyName.CLOSE_CASHIER ? obj[key].toString() : `${curr_sym} ${obj[key]}`
            }`,
          },
        ]),
      );
    }
  }
  data['data'].push(line_break());
  data['data'].push(powered_by());

  const slip_font = getSettingVal(rest_details, 'slip_font') || {};
  const options = { slip_font: slip_font[SlipType.CASH_MGT_REPORT] };

  return changeFontSize(data, options);
}

function generateReceiptV2(obj, rest_details) {
  const language = getPrintLanguage(rest_details);
  const country = rest_details['country'];
  const data = {};
  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['pr_width'] = '72';
  data['data'] = [];
  data['data'].push(line_break());
  data['data'].push(
    formatv2(
      '',
      [
        {
          name: localiseDrawerNames(obj['counterName'], language).toUpperCase(),
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER,
    ),
  );
  data['data'].push(line_break());
  data['data'].push(
    formatv2('', [{ name: `${localize(KeyName.DATE, language)}: ${obj['date']}` }]),
  );
  data['data'].push(
    formatv2('', [{ name: `${localize(KeyName.TIME, language)}: ${obj['time']}` }]),
  );
  if (obj['name']) {
    data['data'].push(
      formatv2('', [
        { name: `${localize(KeyName.STAFF_NAME, language)}: ${obj['name'].toUpperCase()}` },
      ]),
    );
  }
  if (obj['counterName'].toUpperCase() != 'DRAWER-KICK') {
    data['data'].push(
      formatv2('', [
        {
          name: `${localize(KeyName.AMOUNT, language)}: ${
            rest_details['curr_sym'] + ' ' + getInternationalizedNumber(obj['amount'], country)
          }`,
          ft: FontType.BOLD,
        },
      ]),
    );
  }
  data['data'].push(
    formatv2('', [
      { name: `${localize(KeyName.REASON, language)}: ${obj['reason'].toUpperCase()}` },
    ]),
  );
  data['data'].push(line_break());
  data['data'].push(
    formatv2(
      '',
      [
        {
          name: `${localize(KeyName.SIGNED_BY, language)}`,
        },
      ],
      undefined,
      FontType.NORMAL,
      FontAlign.CENTER,
    ),
  );
  data['data'].push(line_break());
  data['data'].push(line_break(' '));
  data['data'].push(line_break(' '));
  data['data'].push(line_break(' '));
  data['data'].push(line_break());
  data['data'].push(powered_by(language));

  const slip_font = getSettingVal(rest_details, 'slip_font') || {};
  const options = { slip_font: slip_font[SlipType.CASH_IN_OUT] };

  return changeFontSize(data, options);
}

module.exports = {
  SlipType,
  FontAlign,
  FontSize,
  FontType,
  changeFontSize,
  powered_by,
  formatv2,
  line_break,
  insertOrderSequence,
  insertHeaders,
  addItems,
  localize,
  insertFpAndThaiLanguageSupport,
  getInternationalizedNumber,
  splitAddonVariantByLine,
  localiseFeeNames,
  insertCustomHeaderAndFooter,
  localiseDrawerNames,
  getCountryDetails,
  getCashInfo,
  generateReportV2,
  generateReceiptV2,
};
