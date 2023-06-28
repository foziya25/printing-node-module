const {
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
} = require('../utils/printing-utils');

const {
  getPrintLanguage,
  insertSpaceInReceipt,
  getOrderTypeBinaryPlace,
  getSettingVal,
  DefaultConfigurablePrintSettings,
} = require('../utils/utils');

const {
  KeyName,
  ReceiptType,
  PrintSection,
  FontAlign,
  FontType,
  SlipType,
  AddonVariantReceiptEnum,
  AddonVariantNameEnum,
  FontSize,
} = require('../config/enums');

/* function to convert the receipt obj to print format */
function convertReceiptObj(obj, rest_details, reprinted_data = false, configurable_settings = {}) {
  // in case of old receipt design
  if (getSettingVal(rest_details, 'response_format') === 0) {
    return convertToOldReceiptObj(obj, rest_details.country);
  }
  configurable_settings =
    configurable_settings && Object.keys(configurable_settings).length > 0
      ? configurable_settings
      : DefaultConfigurablePrintSettings.bill_receipt;

  let language = getPrintLanguage(rest_details);
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
  // Insert 'REPRINTED' bcz it is required if attempt_print>1
  if (reprinted_data && reprinted_data === true) {
    data['data'].push(line_break());
    data['data'].push(
      formatv2('', [{ name: 'REPRINTED' }], FontSize.MEDIUM, FontType.BOLD, FontAlign.CENTER),
    );
    data['data'].push(line_break());
  }
  data['data'].push(line_break());
  data['data'].push(
    formatv2('', [{ name: pmt_status }], undefined, FontType.BOLD, FontAlign.CENTER),
  );
  data['data'].push(line_break());
  if (obj['body'][KeyName.ORDER_SEQ]) {
    data['data'].push(
      insertOrderSequence(
        obj['body'][KeyName.ORDER_SEQ],
        configurable_settings?.order_seq ? configurable_settings.order_seq : undefined,
        language,
      ),
    );
    data['data'].push(line_break());
  }
  const keys = [
    KeyName.INVOICE,
    KeyName.NO_OF_ITEMS,
    KeyName.DATE,
    KeyName.TIME,
    KeyName.TABLE,
    KeyName.PAYMENT_TYPE,
    KeyName.STAFF_NAME,
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
          name: getInternationalizedNumber(Number(item['amount']).toFixed(2), country),
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
    } else if (bill['name'] === KeyName.FINAL_BILL_PAYMENT_MODE) {
      data['data'].push(
        formatv2('', [
          {
            name: `${localiseFeeNames(bill['name'], language).toUpperCase()}: `,
            fw: `${localiseFeeNames(bill['name'], language).toUpperCase()}: `.length + 1,
          },
          {
            name:
              bill['name'] != 'Transaction ID' &&
              (Number(bill['value']) || Number(bill['value']) == 0)
                ? obj['order']['currency'] +
                  ' ' +
                  getInternationalizedNumber(Number(bill['value']).toFixed(2), country)
                : bill['value'].trim(),
            fa: FontAlign.RIGHT,
          },
        ]),
      );
    } else {
      // Remove unpaid value from payment_mode, Remove unpaid in printing
      if (bill['value'] != KeyName.UNPAID) {
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
  data['p_width'] = obj['sticker_width'];
  data['p_height'] = obj['sticker_height'];
  data['auto_cut_enabled'] = obj['auto_cut_enabled'];
  data['is_single_roll'] = obj['is_single_roll'];
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
  reprinted_data = false,
) {
  // for old receispt design
  if (getSettingVal(rest_details, 'response_format') === 0) {
    return convertToOldCounterObj(obj);
  }
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

  if (reprinted_data && reprinted_data === true) {
    data['data'].push(line_break());
    data['data'].push(
      formatv2(
        '',
        [
          {
            name: 'REPRINTED',
          },
        ],
        FontSize.MEDIUM,
        FontType.BOLD,
        FontAlign.CENTER,
      ),
    );
    data['data'].push(line_break());
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
  if (
    configurable_settings[KeyName.ORDERTYPE]['show'] === 1 &&
    configurable_settings[KeyName.ORDERTYPE]['section'] === PrintSection.HEADER
  ) {
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
  if (
    configurable_settings[KeyName.ORDERTYPE]['show'] === 1 &&
    configurable_settings[KeyName.ORDERTYPE]['section'] === PrintSection.FOOTER
  ) {
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

  if (obj['allergic_items'] && obj['allergic_items'].length > 0) {
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
function convertMasterObj(obj, rest_details, options = {}, reprinted_data = false) {
  // for old receipt design
  if (getSettingVal(rest_details, 'response_format') === 0) {
    return convertToOldCounterObj(obj);
  }

  const language = getPrintLanguage(rest_details);
  const data = {};
  insertFpAndThaiLanguageSupport(data, rest_details);
  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['p_width'] = '72';
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
  data['data'] = [];
  // Insert 'REPRINTED' bcz it is required if attempt_print>1
  if (reprinted_data && reprinted_data === true) {
    data['data'].push(line_break());
    data['data'].push(
      formatv2(
        '',
        [
          {
            name: 'REPRINTED',
          },
        ],
        FontSize.MEDIUM,
        FontType.BOLD,
        FontAlign.CENTER,
      ),
    );
    data['data'].push(line_break());
  }
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
  if (obj['allergic_items'] && obj['allergic_items'].length > 0) {
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
      )}: ${obj['body'][KeyName.TABLE]} `,
      undefined,
      undefined,
      FontAlign.CENTER,
    ),
  );

  data['data'].push(line_break());
  data['data'].push(powered_by(language));
  return changeFontSize(data, options);
}

function convertVoidAndCancelCounterObj(obj, options, rest_details) {
  // for old design receipt
  if (getSettingVal(rest_details, 'response_format') === 0) {
    return obj;
  }

  const language = getPrintLanguage(rest_details);
  const data = {};
  insertFpAndThaiLanguageSupport(data, rest_details);
  data['ptr_name'] = obj['printerName'];
  data['p_width'] = '72';
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
  data['data'] = [];
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
    KeyName.NO_OF_ITEMS_VOIDED,
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

  if (obj['note'].length > 2) {
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
    for (const item of obj['note'].slice(1)) {
      data['data'].push(formatv2('', [{ name: item.toUpperCase() }]));
    }
  }
  data['data'].push(line_break());
  data['data'].push(powered_by(language));
  return changeFontSize(data, options);
}

function convertVoidMasterObj(obj, options, rest_details) {
  // for olde receipt design
  if (getSettingVal(rest_details, 'response_format') === 0) {
    return obj;
  }

  const language = getPrintLanguage(rest_details);
  const data = {};
  insertFpAndThaiLanguageSupport(data, rest_details);
  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['p_width'] = '72';
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
  data['data'] = [];
  data['data'].push(line_break());
  data['data'].push(
    formatv2(
      '',
      [
        {
          name: 'VOID',
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
    KeyName.DATE,
    KeyName.TIME,
    KeyName.PAX,
    KeyName.STAFF_NAME,
    KeyName.CUSTOMER_NAME,
    KeyName.TABLE,
  ];
  insertHeaders(obj, keys).forEach((value) => {
    data['data'].push(value);
  });

  data['data'].push(line_break());
  const item_arr = addItems(obj['items'], rest_details, null, language);
  for (const item of item_arr) {
    data['data'].push(item);
  }
  data['data'].push(line_break());
  data['data'].push(powered_by(language));
  return changeFontSize(data, options);
}

function convertDeclineMasterObj(obj, options, rest_details) {
  // for olde receipt design
  if (getSettingVal(rest_details, 'response_format') === 0) {
    return obj;
  }

  const data = {};
  insertFpAndThaiLanguageSupport(data, rest_details);
  if (Object.keys(obj).length === 0) {
    return data;
  }
  const language = getPrintLanguage(rest_details);
  data['type'] = obj['type'];
  data['ptr_name'] = obj['printerName'];
  data['p_width'] = '72';
  data['ptr_id'] = obj['ptr_id'] ? obj['ptr_id'] : data['ptr_name'];
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
  if (obj['body'][KeyName.ORDER_SEQ]) {
    data['data'].push(insertOrderSequence(obj['body'][KeyName.ORDER_SEQ], undefined, language));
    data['data'].push(line_break());
  }
  const keys = [
    KeyName.INVOICE,
    KeyName.DATE,
    KeyName.TIME,
    KeyName.PAX,
    KeyName.STAFF_NAME,
    KeyName.CUSTOMER_NAME,
    KeyName.TABLE,
  ];
  insertHeaders(obj, keys).forEach((value) => {
    data['data'].push(value);
  });

  data['data'].push(line_break());
  const item_arr = addItems(obj['items'], rest_details, null, language);
  for (const item of item_arr) {
    data['data'].push(item);
  }

  if (obj['note'].length > 2) {
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
    for (const item of obj['note'].slice(1)) {
      data['data'].push(formatv2('', [{ name: item.toUpperCase() }]));
    }
  }
  data['data'].push(line_break());
  data['data'].push(powered_by(language));
  return changeFontSize(data, options);
}

function convertToOldCounterObj(data) {
  try {
    if (data.items && data.items.length > 0) {
      for (let item of data.items) {
        if (typeof item.qty === 'string') {
          item.qty = parseInt(item.qty);
        }
      }
    }

    if (data.body) {
      data.body = keyCorrection(
        {
          order_type: 'Type',
          table: 'Table',
          invoice_no: 'Invoice_No',
          order_seq: 'Order_seq',
          date: 'Date',
          time: 'Time',
          cashier: 'Cashier',
          staff_name: 'sname',
          customer_name: 'uname',
          customer_phone: 'mob',
          pax: 'PAX',
        },
        data.body,
      );
      data.body['Order_seq'] = data.order_seq;
      data.body['Type'] = data.order_type;
    }
    if (data.hasOwnProperty('counter_name')) {
      data.counterName = data.counter_name;
      delete data.counter_name;
    }
  } catch (e) {}

  return data;
}

/**
 * Convert the response format for old receipt data.
 *
 * @param {Object} data - An object containing old receipt data.
 * @returns {Object} - An object containing old receipt data with converted response format.
 */
function convertToOldReceiptObj(data, country) {
  try {
    if (data.order && data.order.items && data.order.items.length > 0) {
      for (let item of data.order.items) {
        if (typeof item.price === 'number') {
          item.price = getInternationalizedNumber(item.price, country);
        }
        if (typeof item.amount === 'number') {
          item.amount = getInternationalizedNumber(item.amount, country);
        }
      }
    }

    if (data.body) {
      if (data.body.time && data.body.date) {
        data.body.date = data.body.date + ' ' + data.body.time;
      }
      data.body = keyCorrection(
        {
          order_type: 'Type',
          table: 'Table',
          invoice_no: 'Invoice_No',
          order_seq: 'Order_seq',
          date: 'Date',
          time: 'Time',
          cashier: 'Cashier',
          staff_name: 'sname',
          pax: 'PAX',
        },
        data.body,
      );
    }

    if (data.order && data.order.bill && data.order.bill.length > 0) {
      for (let bill of data.order.bill) {
        if (bill.name == 'payment_mode' && bill.name == 'unpaid') {
          bill['value'] = 'Unpaid';
        }
        bill = valueCorrectionBill(bill, country);
      }
    }
  } catch (e) {}
  return data;
}

/**
 * Correct the keys and values of an object.
 *
 * @param {Object} obj - The object to modify.
 * @returns {Object} - The modified object.
 */
function valueCorrectionBill(obj, country) {
  const keysMapping = {
    'Sub-Total': 'Subtotal',
    total: 'Total Payable',
    payment_mode: 'Payment Mode',
    Discount: 'Discount',
    'Round Off': 'Round Off',
  };
  for (const originalKey of Object.keys(keysMapping)) {
    try {
      if (obj && obj['name'] == originalKey) {
        obj.name = keysMapping[originalKey];
      }
      if (obj && obj.hasOwnProperty('value') && Number(obj['value']) != NaN) {
        obj.value = getInternationalizedNumber(obj.value, country);
      }
    } catch (e) {}
  }
  return obj;
}

/* Insert a key and delete another key from an object.
 *
 * @param {string} insert_key - The key to be inserted.
 * @param {string} delete_key - The key to be deleted.
 * @param {Object} obj - The object to modify.
 * @returns {Object} - The modified object.
 */
function keyCorrection(keys_mapping, obj) {
  for (const original_key of Object.keys(keys_mapping)) {
    try {
      if (obj.hasOwnProperty(original_key)) {
        obj[keys_mapping[original_key]] = obj[original_key];
        delete obj[original_key];
      }
    } catch (e) {}
  }
  return obj;
}

module.exports = {
  convertReceiptObj,
  convertCounterObj,
  convertMasterObj,
  convertTableTransferObj,
  convertVoidAndCancelCounterObj,
  convertVoidMasterObj,
  convertDeclineMasterObj,
};
