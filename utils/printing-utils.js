const SlipType = {
  BILL: 'bill',
  COUNTER: 'counter',
  MASTER_ORDER_LIST: 'master_order_list',
  MASTER_DOCKET: 'master_docket',
  TABLE_CHANGE: 'table_change',
  CASH_IN_OUT: 'cash_in_out',
  CASH_MGT_REPORT: 'cash_mgt_report',
};

const FontSize = {
  SMALL: 's',
  MEDIUM: 'm',
  LARGE: 'l',
};

const FontType = {
  BOLD: 'b',
  NORMAL: 'n',
  ITALIC: 'i',
};

const FontAlign = {
  LEFT: 'l',
  RIGHT: 'r',
  CENTER: 'c',
};

const CountryMapping = {
  MALAYSIA: {
    country: 'Malaysia',
    country_code: 'MY',
    currency_code: 'MYR',
    currency_symbol: 'RM',
    locale: 'ms-MY',
    language: 'en-US',
    // origin: env.app.partner_app_base_url,
    base_roundoff: 0.05,
  },
  INDONESIA: {
    country: 'Indonesia',
    country_code: 'ID',
    currency_code: 'IDR',
    currency_symbol: 'Rp',
    locale: 'id-ID',
    language: 'id-ID',
    // origin: env.app.partner_app_base_url_ind,
    base_roundoff: 100,
  },
};

const KeyName = {
  INVOICE: 'invoice_no',
  DATE: 'date',
  TIME: 'time',
  TABLE: 'table',
  NO_OF_ITEMS: 'no_of_items',
  ORDER_SEQ: 'order_seq',
  ORDERTYPE: 'order_type',
  CASHIER: 'cashier',
  PAX: 'pax',
  STAFF_NAME: 'staff_name',
  CUSTOMER_NAME: 'customer_name',
  CUSTOMER_PHONE: 'customer_phone',
  PAYMENT_TYPE: 'payment_type',
  PAYMENT_MODE: 'payment_mode',
  TOTAL: 'total',
  SUB_TOTAL: 'sub-total',
  BALANCE: 'balance',
  UNPAID: 'unpaid',
  PAID: 'paid',
  DINEIN: 'dine_in',
  DELIVERY: 'delivery',
  TAKEAWAY: 'takeaway',
  PICKUP: 'pickup',
  OLD_TABLE: 'old_table',
  DATETIME: 'date_time',
  NO_OF_ITEMS_VOIDED: 'noOfItemsVoid',
  TABLE_TRANSFER: 'tableTransfer',
  OPENING_CASH_FLOAT: 'opening_cash_float',
  TOTAL_CASH_IN: 'total_cash_in',
  CASH_IN_SALES: 'cash_in_sales',
  CASH_IN_OTHERS: 'cash_in_others',
  TOTAL_CASH_OUT: 'total_cash_out',
  NET_CASH_BALANCE: 'net_cash_balance',
  EXPECTED_CASH_IN_DRAWER: 'expected_cash_in_drawer',
  ACTUAL_CASH_IN_DRAWER: 'actual_cash_in_drawer',
  EXCESS_SHORT: 'excess_short_cash',
  CLOSE_CASHIER: 'close_cashier',
  AMOUNT: 'amount',
  REASON: 'reason',
  DRAWER_KICK: 'drawer_kick',
  OPEN_CASHIER: 'open_cashier',
  CASH_IN: 'cash_in',
  CASH_OUT: 'cash_out',
  POWERED_BY: 'powered_by',
  OLD: 'old',
  NEW: 'new',
  NOTES: 'notes',
  ALLERGIES: 'allergies',
  ADDON: 'addon',
  VARIANT: 'variant',
  DISCOUNT: 'discount',
  DELIVERY_FEE: 'delivery_fee',
  ROUND_OFF: 'round_off',
  TOTAL_AMOUNT: 'total_amount',
  AMOUNT_PAID: 'amount_paid',
  CASH_RECEIVED: 'cash_received',
  CASH_RETURNED: 'cash_returned',
  TRANSACTION_ID: 'txn_id',
  ITEM_NAME: 'item_name',
  BILl_DATE: 'bill_date',
  COUNTER_NAME: 'counter_name',
  UNMAPPED_ITEM_TEXT: 'unmapped_item_text',
  INVALID_COUNTER_TEXT: 'invalid_counter_text',
  MASTER_COUNTER_TEXT: 'master_counter_text',
  CANCELED_ITEMS_TEXT: 'canceled_items_text',
  ITEM_NOT_AVAILABLE_TEXT: 'item_not_available_text',
  ITEMS_NOT_AVAILABLE_TEXT: 'items_not_available_text',
  SOME_ITEMS_NOT_AVAILABLE_TEXT: 'some_items_not_available_text',
  ORDER_DECLINED_TEXT: 'order_declined_text',
  ITEMS_DECLINED_TEXT: 'items_declined_text',
  SIGNED_BY: 'signed_by',
  MASTER_DOCKET: 'master_docket',
  MASTER_ORDER_LIST: 'master_order_list',
  VOID_ITEM: 'void_item',
  CANCEL_ITEM: 'cancel_item',
  ITEM_VOIDED: 'item_voided',
  DECLINED_ORDER: 'declined_order',
  COUNTER_DECLINE_TEXT: 'counter_decline_text',
  COUNTER_CANCEL_TEXT: 'counter_cancel_text',
  TABLE_CHANGED: 'table_changed',
  DISH_OUT_OF_STOCK_TEXT: 'dish_out_of_stock',
  VARIANT_OUT_OF_STOCK_TEXT: 'variant_out_of_stock',
  ADDON_OUT_OF_STOCK_TEXT: 'addon_out_of_stock',
};

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
const insertOrderSequence = (order_seq) => {
  return formatv2(
    '',
    [{ name: `ORDER: #${order_seq}` }],
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
function insertHeaders(obj, keys = []) {
  const toInsert = [];
  keys.forEach((key) => {
    if (
      Object.keys(obj['body']).includes(key) &&
      obj['body'][key] &&
      obj['body'][key].toString().trim()
    ) {
      toInsert.push(
        formatv2('', [
          { name: `${key.toUpperCase()}: ${obj['body'][key].toString().toUpperCase()}` },
        ]),
      );
    }
  });
  return toInsert;
}

// Function to add items in printing config v2
function addItems(items) {
  const temp_arr = [];
  temp_arr.push(formatv2('', [{ name: 'ITEM NAME' }, { name: 'QTY', fw: 6, fa: FontAlign.RIGHT }]));
  temp_arr.push(line_break());
  for (const item of items) {
    const strike = item['strike'] && item['strike'] === 1 ? 1 : 0;
    if (item['name'] && item['name'].trim()) {
      temp_arr.push(
        formatv2('', [
          { name: item['name'].toUpperCase(), strike: strike },
          { name: item['qty'].toString(), fw: 6, fa: FontAlign.RIGHT, strike: strike },
        ]),
      );
    }
    if (item['combo_name'] && item['combo_name'].trim()) {
      temp_arr.push(
        formatv2('', [
          { name: `${item['combo_name'].toUpperCase()}`, strike: strike },
          { name: '', fw: 6 },
        ]),
      );
    }
    if (item['addon'] && item['addon'].trim()) {
      temp_arr.push(
        formatv2('', [
          { name: `${item['addon'].toUpperCase()}`, strike: strike },
          { name: '', fw: 6 },
        ]),
      );
    }
    if (item['variant'] && item['variant'].trim()) {
      temp_arr.push(
        formatv2('', [
          { name: `${item['variant'].toUpperCase()}`, strike: strike },
          { name: '', fw: 6 },
        ]),
      );
    }
    if (item['note'] && item['note'].trim()) {
      temp_arr.push(
        formatv2('', [{ name: `NOTE: ${item['note'].toUpperCase()}` }, { name: '', fw: 6 }]),
      );
    }
  }
  return temp_arr;
}

/* localization function */
function localize(key, language = CountryMapping.MALAYSIA.language) {
  return key;
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

const getInternationalizedNumber = (number, country) => {
  if (isNaN(number)) {
    return number;
  }
  number = Number(number);
  const locale = getLocaleForCountry(country);
  const numberFormatter = getNumberFormatter(locale);
  return numberFormatter.format(number);
};

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
};
