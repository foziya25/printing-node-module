const {
  FontAlign,
  FontSize,
  FontType,
  SlipType,
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
} = require('./utils/printing-utils');

const {
  getPrintLanguage,
  insertSpaceInReceipt,
  getOrderTypeBinaryPlace,
} = require('./utils/utils');
const {} = require('./utils/enums');

const ReceiptType = {
  STICKER_PRINTER: 'sticker_printer',
};

const PrintSection = {
  HEADER: 'h',
  FOOTER: 'f',
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

/* function to convert the receipt obj to print format */
function convertReceiptObj(obj, rest_details) {
  language = getPrintLanguage(rest_details);
  const country = rest_details.country;
  const is_unpaid = obj['order']['bill'].some(
    (e) => e['name'] === KeyName.PAYMENT_MODE && e['value'] === KeyName.UNPAID,
  );
  const pmt_status = is_unpaid
    ? `* ${localize(KeyName.UNPAID, language).toUpperCase()} *`
    : `* ${localize(KeyName.PAID, language).toUpperCase()} *`;
  const split_addon_variant = rest_details['settings']['print']['split_addon_variant'];
  const data = {};
  insertFpAndThaiLanguageSupport(data, rest_details);
  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['p_width'] = '72';
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
  data['data'] = [];
  if (obj['logo']) {
    data['data'].push(formatv2('_img_', obj['logo']));
  }
  if (obj['header'].length > 0) {
    for (const item of obj['header']) {
      data['data'].push(
        formatv2('', [{ name: item.toUpperCase() }], undefined, FontType.BOLD, FontAlign.CENTER),
      );
    }
  }
  data['data'].push(line_break());
  data['data'].push(
    formatv2('', [{ name: pmt_status }], undefined, FontType.BOLD, FontAlign.CENTER),
  );
  data['data'].push(line_break());
  if (obj['body'][KeyName.ORDER_SEQ]) {
    data['data'].push(insertOrderSequence(obj['body'][KeyName.ORDER_SEQ], undefined, language));
    data['data'].push(line_break());
  }
  const keys = [
    KeyName.INVOICE,
    KeyName.NO_OF_ITEMS,
    KeyName.DATE,
    KeyName.TIME,
    KeyName.TABLE,
    KeyName.PAYMENT_TYPE,
  ];
  insertHeaders(obj, keys).forEach((value) => {
    data['data'].push(value);
  });

  data['data'].push(line_break());
  data['data'].push(
    formatv2(
      '',
      [
        {
          name: obj['body'][KeyName.ORDERTYPE].toUpperCase(),
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER,
    ),
  );
  data['data'].push(line_break());
  const cust_detail_keys = [KeyName.CUSTOMER_NAME, KeyName.CUSTOMER_PHONE];
  insertHeaders(obj, cust_detail_keys, language).forEach((value) => {
    data['data'].push(value);
  });

  data['data'].push(line_break());
  data['data'].push(
    formatv2('', [
      { name: 'QTY', fw: 6, fa: FontAlign.LEFT },
      { name: `${localize(KeyName.ITEM_NAME, language).toUpperCase()}`, fa: FontAlign.LEFT },
      {
        name: `${localize(KeyName.AMOUNT, language).toUpperCase()}`,
        fw: 10,
        fa: FontAlign.RIGHT,
      },
    ]),
  );
  data['data'].push(line_break());
  for (const item of obj['order']['items']) {
    data['data'].push(
      formatv2('', [
        { name: item['qty'].toString(), fw: 6, fa: FontAlign.LEFT },
        { name: item['name'].toUpperCase(), fa: FontAlign.LEFT },
        {
          name:
            rest_details['curr_sym'] +
            ' ' +
            getInternationalizedNumber(Number(item['amount']).toFixed(2), country),
          fw: 10,
          fa: FontAlign.RIGHT,
        },
      ]),
    );
    if (item['combo_name'] && item['combo_name'].trim()) {
      data['data'].push(
        formatv2('', [
          { name: '', fw: 6, fa: FontAlign.LEFT },
          { name: `${item['combo_name'].toUpperCase()}` },
          { name: '', fw: 10, fa: FontAlign.RIGHT },
        ]),
      );
    }
    if (item['addon'] && item['addon'].trim()) {
      splitAddonVariantByLine(
        item['addon'],
        AddonVariantNameEnum.ADDON,
        0,
        AddonVariantReceiptEnum.RECEIPT,
        split_addon_variant,
        null,
        language,
      ).forEach((elem) => {
        data['data'].push(elem);
      });
    }

    if (item['variant'] && item['variant'].trim()) {
      splitAddonVariantByLine(
        item['variant'],
        AddonVariantNameEnum.VARIANT,
        0,
        AddonVariantReceiptEnum.RECEIPT,
        split_addon_variant,
        null,
        language,
      ).forEach((elem) => {
        data['data'].push(elem);
      });
    }
    if (item['note'] && item['note'].trim()) {
      data['data'].push(
        formatv2('', [
          { name: '', fw: 6, fa: FontAlign.LEFT },
          { name: `NOTE: ${item['note'].toUpperCase()}` },
          { name: '', fw: 10, fa: FontAlign.RIGHT },
        ]),
      );
    }
    if (item['item_discount']) {
      data['data'].push(
        formatv2('', [
          { name: '', fw: 6, fa: FontAlign.LEFT },
          {
            name: `ITEM DISCOUNT: ${rest_details['curr_sym']} ${item['item_discount'].toFixed(2)}`,
          },
          { name: '', fw: 10, fa: FontAlign.RIGHT },
        ]),
      );
    }
  }
  data['data'].push(line_break());
  for (const bill of obj['order']['bill']) {
    if (bill['name'] === KeyName.TOTAL) {
      data['data'].push(line_break());
      data['data'].push(
        formatv2('', [
          {
            name: `${localiseFeeNames(bill['name'], language).toUpperCase()}: `,
            ft: FontType.BOLD,
          },
          {
            name:
              bill['name'] != 'Transaction ID' &&
              (Number(bill['value']) || Number(bill['value']) == 0)
                ? obj['order']['currency'] +
                  ' ' +
                  getInternationalizedNumber(Number(bill['value']).toFixed(2), country)
                : bill['value'],
            fw:
              bill['name'] != 'Transaction ID' &&
              (Number(bill['value']) || Number(bill['value']) == 0)
                ? 11
                : bill['value'].length,
            ft: FontType.BOLD,
            fa: FontAlign.RIGHT,
          },
        ]),
      );
      data['data'].push(line_break());
    } else if (bill['name'] === 'Transaction ID') {
      data['data'].push(
        formatv2('', [
          {
            name: `${localiseFeeNames(KeyName.TRANSACTION_ID, language).toUpperCase()}: `,
            ft: FontType.BOLD,
            fw: 9,
          },
          {
            name:
              bill['name'] != 'Transaction ID' &&
              (Number(bill['value']) || Number(bill['value']) == 0)
                ? obj['order']['currency'] +
                  ' ' +
                  getInternationalizedNumber(Number(bill['value']).toFixed(2), country)
                : bill['value'],
            ft: FontType.BOLD,
            fa: FontAlign.RIGHT,
          },
        ]),
      );
    } else if (bill['name'] === KeyName.PAYMENT_MODE) {
      data['data'].push(
        formatv2('', [
          { name: `${localiseFeeNames(bill['name'], language).toUpperCase()}: `, fw: 15 },
          {
            name:
              bill['name'] != 'Transaction ID' &&
              (Number(bill['value']) || Number(bill['value']) == 0)
                ? obj['order']['currency'] +
                  ' ' +
                  getInternationalizedNumber(Number(bill['value']).toFixed(2), country)
                : bill['value'],
            fa: FontAlign.RIGHT,
          },
        ]),
      );
    } else {
      data['data'].push(
        formatv2('', [
          { name: `${localiseFeeNames(bill['name'], language).toUpperCase()}: ` },
          {
            name:
              bill['name'] != 'Transaction ID' &&
              (Number(bill['value']) || Number(bill['value']) == 0)
                ? obj['order']['currency'] +
                  ' ' +
                  getInternationalizedNumber(Number(bill['value']).toFixed(2), country)
                : bill['value'],
            fw:
              bill['name'] != 'Transaction ID' &&
              (Number(bill['value']) || Number(bill['value']) == 0)
                ? 11
                : bill['value'].length,
            ft: FontType.BOLD,
            fa: FontAlign.RIGHT,
          },
        ]),
      );
    }
  }

  if (obj['footer']) {
    data['data'].push(line_break());
    data['data'].push(formatv2('', [{ name: obj['footer'].toString() }]));
  }

  data['data'].push(line_break());
  data['data'].push(powered_by());
  const slip_font = rest_details['settings']['print']['slip_font']
    ? rest_details['settings']['print']['slip_font']
    : {};
  const options = { slip_font: null };
  options.slip_font = slip_font[SlipType.BILL];
  return changeFontSize(data, options);
}

/* convert sticker object */
function convertStickerObj(obj, rest_details, options = {}) {
  const data = {};
  data['type'] = ReceiptType.STICKER_PRINTER;
  data['ptr_name'] = obj['printerName'];
  data['p_width'] = '48';
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
  data['data'] = [];
  if (
    rest_details &&
    rest_details.settings &&
    rest_details.settings.print &&
    rest_details.settings.print.label_format_v2
  ) {
    data['data'].push(
      formatv2('', [
        { name: obj['body'][KeyName.CUSTOMER_NAME], fa: FontAlign.LEFT },
        { name: `#${obj['body'][KeyName.ORDER_SEQ]}`, fa: FontAlign.RIGHT },
      ]),
    );
  } else {
    if (
      Object.keys(obj['body']).includes(KeyName.NO_OF_ITEMS) &&
      Object.keys(obj['body']).includes(KeyName.ORDER_SEQ)
    ) {
      data['data'].push(
        formatv2(
          '',
          [
            { name: obj['body'][KeyName.NO_OF_ITEMS].toString(), fw: 7 },
            { name: obj['body'][KeyName.ORDER_SEQ], fa: FontAlign.RIGHT },
          ],
          undefined,
          FontType.BOLD,
          undefined,
        ),
      );
    }
    data['data'].push(
      formatv2('', [
        { name: obj['body'][KeyName.DATETIME], fw: 22 },
        { name: obj['counterName'].toString().toUpperCase(), fa: FontAlign.RIGHT },
      ]),
    );
  }
  for (const item of obj['items']) {
    data['data'].push(formatv2('', [{ name: item['name'].toUpperCase() }]));
    if (item['addon'] && item['addon'].trim()) {
      data['data'].push(formatv2('', [{ name: `${item['addon'].toUpperCase()}` }]));
    }
    if (item['variant'] && item['variant'].trim()) {
      data['data'].push(formatv2('', [{ name: `${item['variant'].toUpperCase()}` }]));
    }
  }
  return changeFontSize(data, options);
}

/* Convert old counter format to new format */
function convertCounterObj(
  obj,
  rest_details,
  order_type_bit,
  configurable_settings = {},
  options = {},
) {
  const data = {};

  if (obj['type'] === ReceiptType.STICKER_PRINTER) {
    return convertStickerObj(obj, rest_details, options);
  }

  const language = getPrintLanguage(rest_details);
  insertFpAndThaiLanguageSupport(data, rest_details);

  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['p_width'] = '72';
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
  data['data'] = [];

  if (configurable_settings && configurable_settings.header_space) {
    insertSpaceInReceipt(configurable_settings.header_space).forEach((i) => {
      data['data'].push(i);
    });
  }

  data['data'].push(
    formatv2(
      '',
      [
        {
          name: obj[KeyName.COUNTER_NAME].toUpperCase(),
        },
      ],
      configurable_settings[KeyName.COUNTER_NAME]['fs'],
      configurable_settings[KeyName.COUNTER_NAME]['ft'],
      FontAlign.CENTER,
    ),
  );
  if (configurable_settings[KeyName.ORDERTYPE]['show'] === 1) {
    data['data'].push(line_break());
    data['data'].push(
      formatv2(
        '',
        [
          {
            name: obj[KeyName.ORDERTYPE].toUpperCase(),
          },
        ],
        configurable_settings[KeyName.ORDERTYPE]['fs'],
        configurable_settings[KeyName.ORDERTYPE]['ft'],
        FontAlign.CENTER,
      ),
    );
  }
  data['data'].push(line_break());
  if (
    obj[KeyName.ORDER_SEQ] &&
    configurable_settings[KeyName.ORDER_SEQ]['show'] === 1 &&
    configurable_settings[KeyName.ORDER_SEQ]['section'] === PrintSection.HEADER
  ) {
    data['data'].push(
      insertOrderSequence(
        obj[KeyName.ORDER_SEQ],
        configurable_settings[KeyName.ORDER_SEQ],
        language,
      ),
    );
    data['data'].push(line_break());
  }

  insertCustomHeaderAndFooter(
    configurable_settings,
    PrintSection.HEADER,
    obj,
    order_type_bit,
    language,
  ).forEach((value) => {
    data['data'].push(value);
  });

  data['data'].push(line_break());
  const item_arr = addItems(obj['items'], rest_details, configurable_settings, language);

  for (const item of item_arr) {
    data['data'].push(item);
  }
  if (obj['note'] && obj['note'].length > 0) {
    data['data'].push(line_break());
    data['data'].push(
      formatv2(
        '',
        [
          {
            name: `${localize(KeyName.NOTES, language)}`,
          },
        ],
        configurable_settings[KeyName.NOTES]['fs'],
        configurable_settings[KeyName.NOTES]['ft'],
        FontAlign.CENTER,
      ),
    );
    data['data'].push(line_break());
    for (const note of obj['note']) {
      if (note && note.trim()) {
        data['data'].push(
          formatv2(
            '',
            [{ name: note.toUpperCase() }],
            configurable_settings[KeyName.ORDERTYPE]['fs'],
            configurable_settings[KeyName.ORDERTYPE]['ft'],
          ),
        );
      }
    }
  }

  if (obj['allergic_items'].length > 0) {
    data['data'].push(line_break());
    data['data'].push(
      formatv2(
        '',
        [
          {
            name: `${localize(KeyName.ALLERGIES, language)}`,
          },
        ],
        configurable_settings[KeyName.ALLERGIES]['fs'],
        configurable_settings[KeyName.ALLERGIES]['ft'],
        FontAlign.CENTER,
      ),
    );
    data['data'].push(line_break());
    data['data'].push(
      formatv2(
        '',
        [
          {
            name: obj['allergic_items'].join(', ').toUpperCase(),
          },
        ],
        configurable_settings[KeyName.ALLERGIES]['fs'],
        configurable_settings[KeyName.ALLERGIES]['ft'],
      ),
    );
  }

  data['data'].push(line_break());
  if (
    obj[KeyName.ORDER_SEQ] &&
    configurable_settings[KeyName.ORDER_SEQ]['show'] === 1 &&
    configurable_settings[KeyName.ORDER_SEQ]['section'] === PrintSection.FOOTER
  ) {
    data['data'].push(
      insertOrderSequence(
        obj[KeyName.ORDER_SEQ],
        configurable_settings[KeyName.ORDER_SEQ],
        language,
      ),
    );
    data['data'].push(line_break());
  }

  /* Insert fields which are set for footer */
  let count = 0;
  insertCustomHeaderAndFooter(
    configurable_settings,
    PrintSection.FOOTER,
    obj,
    order_type_bit,
    language,
  ).forEach((value) => {
    data['data'].push(value);
    count++;
  });
  if (count > 0) {
    data['data'].push(line_break());
  }

  data['data'].push(powered_by(language));
  return changeFontSize(data, options);
}

/* convert master object  */
function convertMasterObj(obj, rest_details, options = {}) {
  const language = getPrintLanguage(rest_details);
  const data = {};
  insertFpAndThaiLanguageSupport(data, rest_details);
  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['p_width'] = '72';
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
  data['data'] = [];
  data['data'].push(
    formatv2(
      '',
      [
        {
          name: 'MASTER ORDER LIST',
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER,
    ),
  );

  data['data'].push(line_break());
  data['data'].push(
    formatv2(
      '',
      [
        {
          name: obj['body'][KeyName.ORDERTYPE].toUpperCase(),
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER,
    ),
  );
  data['data'].push(line_break());
  if (obj['body'][KeyName.ORDER_SEQ]) {
    data['data'].push(insertOrderSequence(obj['body'][KeyName.ORDER_SEQ], undefined, language));
    data['data'].push(line_break());
  }
  const keys = [
    KeyName.INVOICE,
    KeyName.NO_OF_ITEMS,
    KeyName.DATE,
    KeyName.TIME,
    KeyName.PAX,
    KeyName.STAFF_NAME,
    KeyName.CUSTOMER_NAME,
    KeyName.TABLE,
  ];
  insertHeaders(obj, keys, language).forEach((value) => {
    data['data'].push(value);
  });

  data['data'].push(line_break());
  const item_arr = addItems(obj['items'], rest_details, null, language);

  for (const item of item_arr) {
    data['data'].push(item);
  }

  if (obj['note'].length > 0) {
    data['data'].push(line_break());
    data['data'].push(
      formatv2(
        '',
        [
          {
            name: `${localize(KeyName.NOTES, language)}`,
          },
        ],
        undefined,
        FontType.BOLD,
        FontAlign.CENTER,
      ),
    );
    data['data'].push(line_break());
    for (const item of obj['note']) {
      data['data'].push(formatv2('', [{ name: item.toUpperCase() }]));
    }
  }
  if (obj['allergic_items'].length > 0) {
    data['data'].push(line_break());
    data['data'].push(
      formatv2(
        '',
        [
          {
            name: `${localize(KeyName.ALLERGIES, language)}`,
          },
        ],
        undefined,
        FontType.BOLD,
        FontAlign.CENTER,
      ),
    );
    data['data'].push(line_break());
    data['data'].push(
      formatv2('', [
        {
          name: obj['allergic_items'].join(', ').toUpperCase(),
          ft: FontType.BOLD,
          fa: FontAlign.CENTER,
        },
      ]),
    );
  }

  data['data'].push(line_break());
  data['data'].push(powered_by(language));
  return changeFontSize(data, options);
}

function convertTableTransferObj(obj, rest_details, options) {
  const data = {};
  const language = getPrintLanguage(rest_details);

  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
  data['p_width'] = '72';
  data['data'] = [];
  data['data'].push(line_break());
  data['data'].push(
    formatv2(
      '',
      [
        {
          name: `${localize(KeyName.TABLE_TRANSFER, language)}`,
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER,
    ),
  );

  const old_tno = obj['body']['old_table'] ? obj['body']['old_table'].toString() : '';
  const new_table_no = obj['body']['table'] ? obj['body']['table'].toString() : '';

  data['data'].push(line_break());
  data['data'].push(
    formatv2(
      '',
      `${localize(KeyName.OLD, language)}: ${obj['body'][KeyName.OLD_TABLE]} ----> ${localize(
        KeyName.NEW,
        language,
      )}: ${obj['body'][KeyName.TABLE].toString()} `,
      undefined,
      undefined,
      FontAlign.CENTER,
    ),
  );

  data['data'].push(line_break());
  data['data'].push(powered_by(language));
  return changeFontSize(data, options);
}

module.exports = {
  convertReceiptObj,
  convertCounterObj,
  convertMasterObj,
  convertTableTransferObj,
};
