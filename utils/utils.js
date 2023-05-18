/*
  Last Modified : 27th October
  Changes - added 'getAllergicItemsList' function
*/

const { cloneDeep } = require('lodash/lang');

const { getPmtMethodName } = require('../classes/payment');
const { enKeys } = require('../config/en');
const { idKeys } = require('../config/id');
const {
  KeyName,
  ReceiptType,
  PrintSection,
  FontType,
  FontSize,
  ToShow,
  ForOrderType,
  PrintLanguage,
  CountryMapping,
} = require('../config/enums');
const moment = require('moment-timezone');

const DefaultConfigurablePrintSettings = {
  bill_receipt: {},
  counter_receipt: {
    header_space: 1,
    [KeyName.COUNTER_NAME]: {
      fs: FontSize.MEDIUM,
      ft: FontType.BOLD,
    },
    [KeyName.ORDERTYPE]: {
      show: ToShow.SHOW,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.BOLD,
      priority: 1,
    },
    [KeyName.ORDER_SEQ]: {
      name: 'ORDER NO',
      show: ToShow.SHOW,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.BOLD,
      priority: 1,
    },
    [KeyName.INVOICE]: {
      name: 'INVOICE NO',
      show: ToShow.SHOW,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.PAX]: {
      name: 'PAX',
      show: ToShow.HIDE,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.DATE]: {
      name: 'DATE',
      show: ToShow.HIDE,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.DATETIME]: {
      name: 'BILL DATE',
      show: ToShow.SHOW,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.TIME]: {
      name: 'TIME',
      show: ToShow.HIDE,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.TABLE]: {
      name: 'TABLE NO',
      show: ToShow.SHOW,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.BOLD,
      priority: 1,
    },
    [KeyName.STAFF_NAME]: {
      name: 'STAFF NAME',
      show: ToShow.HIDE,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.CUSTOMER_NAME]: {
      name: 'CUSTOMER NAME',
      show: ToShow.HIDE,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.CUSTOMER_PHONE]: {
      name: 'CUSTOMER PHONE',
      show: ToShow.HIDE,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.NO_OF_ITEMS]: {
      name: 'NUMBER OF ITEMS',
      show: ToShow.SHOW,
      section: PrintSection.HEADER,
      fs: FontSize.MEDIUM,
      o_type: ForOrderType.ALL,
      ft: FontType.NORMAL,
      priority: 1,
    },
    [KeyName.ITEM_NAME]: {
      fs: FontSize.MEDIUM,
      ft: FontType.BOLD,
    },
    [KeyName.VARIANT]: {
      fs: FontSize.MEDIUM,
      ft: FontType.NORMAL,
    },
    [KeyName.ADDON]: {
      fs: FontSize.MEDIUM,
      ft: FontType.NORMAL,
    },
    [KeyName.NOTES]: {
      fs: FontSize.MEDIUM,
      ft: FontType.NORMAL,
    },
    [KeyName.ALLERGIES]: {
      fs: FontSize.MEDIUM,
      ft: FontType.NORMAL,
    },
  },
};

//Separate address to different lines
function separateAddress(orig_array, str, max_length = 30) {
  const string_array = str.split(',');
  let temp = '';
  for (let i = 0; i < string_array.length; i++) {
    if ((string_array[i] + temp).length < max_length) {
      if (temp == '') {
        temp = temp + '' + string_array[i];
      } else {
        temp = temp + ',' + string_array[i];
      }
    } else {
      if (temp.substr(0, 1) == ' ') {
        temp = temp.substr(1);
      }
      orig_array.push(temp);
      temp = string_array[i];
    }
  }
  if (temp != '') {
    if (temp.substr(0, 1) == ' ') {
      temp = temp.substr(1);
    }
    orig_array.push(temp);
  }
  return orig_array;
}

// Get addons list
function getAddons(item) {
  const addons = item.addons && Array.isArray(item.addons) ? item.addons : [];
  if (addons.length == 0 && item.addons_name && item.addons_name != '') {
    const addons_list = item.addons_name.split(',').filter((e) => e.trim());
    addons_list.forEach((addon) => addons.push({ name: addon.trim(), qty: 1 }));
  }
  return addons;
}

/* Return an array of only successful payments with payment channel name */
function getOnlySuccessfulPayments(payments_list) {
  const payments = [];
  if (payments_list && payments_list.length > 0) {
    for (const item of payments_list) {
      if (item['status'] === 1) {
        if (item['payment_channel']) {
          item['payment_method'] = getPmtMethodName(item['payment_channel']);
        } else {
          item['payment_channel'] = getPmtMethodName(item['payment_method']);
          item['payment_method'] = item['payment_channel'];
        }
        payments.push(item);
      }
    }
  }
  return payments;
}

/* Get order_type text */
const getOrderTypeText = (order_type) => {
  order_type = Number(order_type);
  const txt =
    order_type === 0
      ? 'Dine In'
      : order_type === 1
      ? 'Delivery'
      : order_type === 2
      ? 'Pickup'
      : 'NA';
  return txt;
};

/* get printing language from restaurant settings */
function getPrintLanguage(rest_details) {
  const print_bahasa = rest_details
    ? rest_details.settings
      ? rest_details.settings.print
        ? rest_details.settings.print.print_bahasa
          ? 1
          : 0
        : 0
      : 0
    : 0;
  return print_bahasa ? PrintLanguage.INDONESIA : PrintLanguage.DEFAULT;
}

/* add date time for receipts */
function addDateTime(order_details, rest_details) {
  const timezone = rest_details.time_zone;
  let created_at_moment = moment.tz(moment.unix(order_details.created_at), timezone);
  let date_time = {
    datetime: created_at_moment.format('YYYY-MM-DD hh:mm A'),
    date: created_at_moment.format('YYYY-MM-DD'),
    time: created_at_moment.format('hh:mm A'),
  };
  // Show scheduled datetime if order is scheduled
  if (order_details.scheduled === 1 && order_details.time_epoch) {
    const time_epcoh_moment = moment.tz(moment.unix(order_details.time_epoch), timezone);
    date_time.datetime = time_epcoh_moment.format('YYYY-MM-DD hh:mm A');
    date_time.date = time_epcoh_moment.format('YYYY-MM-DD');
    date_time.time = time_epcoh_moment.format('hh:mm A');
  }
  if (order_details && order_details.items && order_details.items.length > 0) {
    let maxItr = 0;
    order_details.items.forEach(function (item) {
      if (item.itr > maxItr) {
        maxItr = item.itr;
        created_at_moment = moment.tz(moment.unix(item.created_at), timezone);
        date_time = {
          datetime: created_at_moment.format('YYYY-MM-DD hh:mm A'),
          date: created_at_moment.format('YYYY-MM-DD'),
          time: created_at_moment.format('hh:mm A'),
        };
      }
    });
  }
  return date_time;
}

function unMappedItemMapping(items_list) {
  items_list.forEach((item) => {
    if (
      !item['kitchen_counter_id'] ||
      !(item['kitchen_counter_id'] && item['kitchen_counter_id'].trim())
    ) {
      item['kitchen_counter_id'] = 'default';
    }
  });
  return items_list;
}

/* Code logic for combo items printing (counter objects)*/
function comboPrinting1(item_obj, item, kc_id) {
  if (item['kitchen_counter_id'] && item['kitchen_counter_id'].includes(kc_id)) {
    item_obj['name'] = item['item_name'];
    item_obj['combo_name'] = '';
    item_obj['qty'] = item['item_quantity'];
    item_obj['addon'] = '';
    item_obj['variant'] = item['variation_name'] ? item['variation_name'] : '';
    item_obj['note'] = item['special_note'] ? item['special_note'] : '';
    for (const combo_item of item['combo_items']) {
      if (
        !combo_item['kitchen_counter_id'] ||
        (combo_item['kitchen_counter_id'] && combo_item['kitchen_counter_id'].includes(kc_id))
      ) {
        item_obj['combo_name'] +=
          item_obj['combo_name'] === ''
            ? `(${combo_item['quantity']}) ${combo_item['item_name']}`
            : `, (${combo_item['quantity']}) ${combo_item['item_name']}`;
      }
    }
  } else {
    item_obj['combo_name'] = '';
    for (const combo_item of item['combo_items']) {
      if (
        !combo_item['kitchen_counter_id'] ||
        (combo_item['kitchen_counter_id'] && combo_item['kitchen_counter_id'].includes(kc_id))
      ) {
        item_obj['combo_name'] +=
          item_obj['combo_name'] === ''
            ? `(${combo_item['quantity']}) ${combo_item['item_name']}`
            : `, (${combo_item['quantity']}) ${combo_item['item_name']}`;
      }
    }
    if (item_obj['combo_name'].trim()) {
      item_obj['name'] = '';
      item_obj['qty'] = item['item_quantity'];
      item_obj['addon'] = '';
      item_obj['variant'] = item['variation_name'] ? item['variation_name'] : '';
      item_obj['note'] = item['special_note'] ? item['special_note'] : '';
    }
  }
}

/* Code logic for combo items printing (counter objects)*/
function comboPrinting(
  temp_item_obj,
  temp_item_data,
  item_obj,
  item,
  printer_mapping,
  order_details,
  rest_details,
  receipt_data,
  is_copy,
  strike = 0,
) {
  item_obj['name'] = item['item_name'];
  item_obj['combo_name'] = '';
  item_obj['qty'] = item['item_quantity'];
  item_obj['unit'] = getUnit(item);
  item_obj['addon'] = '';
  item_obj['variant'] = item['new_variation_name']
    ? item['new_variation_name']
    : item['variation_name']
    ? this.getModifiedVariantName({ ...item }, item['kitchen_counter_id'])
    : '';
  item_obj['note'] = item['special_note'] ? item['special_note'] : '';
  item_obj['item_id'] = item['item_id'];
  for (const combo_item of item['combo_items']) {
    if (combo_item['kitchen_counter_id'] && combo_item['kitchen_counter_id'].trim()) {
      const printer_list = combo_item['kitchen_counter_id'].trim().split(',');
      for (const printer of printer_list) {
        if (
          !(printer === item['kitchen_counter_id']) &&
          printer_mapping[printer] &&
          printer_mapping[printer]['is_sticker_printer'] !== 1 &&
          !is_copy &&
          !item['dummy_kitchen_counter_id'].includes(printer)
        ) {
          if (!(item['itr'] + '_' + printer in temp_item_obj)) {
            temp_item_obj[item['itr'] + '_' + printer] = [];
          }
          if (!(item['itr'] + '_' + printer in temp_item_data)) {
            temp_item_data[item['itr'] + '_' + printer] = [];
          }
          temp_item_obj[item['itr'] + '_' + printer].push({
            name: `${combo_item['item_name']}`,
            qty: item['item_quantity'] * combo_item['quantity'],
            addon: '',
            variant: '',
            note: item['special_note'] ? item['special_note'] : '',
            strike: strike,
            item_id: item['item_id'],
          });
          if (temp_item_data[item['itr'] + '_' + printer].length === 0) {
            try {
              temp_item_data[item['itr'] + '_' + printer].push({
                counterName: printer_mapping[printer]['counter_name'],
                printerName: printer_mapping[printer]['printer_name'],
                ptr_id: printer_mapping[printer]['ptr_id'],
              });
            } catch (e) {
              temp_item_data[item['itr'] + '_' + printer].push({
                counterName: 'Default Counter',
                printerName: 'Default Printer',
                ptr_id: 'master',
              });
            }
          }
        } else if (
          printer_mapping[printer] &&
          printer_mapping[printer]['is_sticker_printer'] &&
          !is_copy
        ) {
          const sticker_printer_item_info = {
            kitchen_counter_id: printer,
            counter_name: printer_mapping[printer]['counter_name'],
            printer_name: printer_mapping[printer]['printer_name'],
            ptr_id: printer_mapping[printer]['ptr_id'],
            itr: item['itr'],
            item_name: combo_item['item_name'],
            item_quantity: item['item_quantity'] * combo_item['quantity'],
          };
          const sticker_printer_objects = separateStickerPrinterObjects(
            sticker_printer_item_info,
            order_details,
            rest_details,
            temp_item_obj,
            temp_item_data,
          );
          sticker_printer_objects.forEach((sticker_obj) => {
            receipt_data.push(sticker_obj);
          });
        } else if (printer === item['kitchen_counter_id']) {
          item_obj['combo_name'] +=
            item_obj['combo_name'] === ''
              ? `(${combo_item['quantity']}) ${combo_item['item_name']}`
              : `, (${combo_item['quantity']}) ${combo_item['item_name']}`;
        }
      }
    }
  }
}

function separateVariantByCounter(
  item,
  temp_item_obj,
  temp_item_data,
  printer_mapping,
  show_item_name_with_variant,
) {
  /* If variant_printer key is present then separate variant according to its kitchen counter*/
  const item_printers = item['kitchen_counter_id'] ? item['kitchen_counter_id'].split(',') : [];
  if (item['variant_printer']) {
    const obj = {
      name: show_item_name_with_variant ? item['item_name'] : '',
      qty: item['item_quantity'],
      addon: '',
      variant: '',
      note: item['special_note'] ? item['special_note'] : '',
    };
    const printer_variant_name_arr_map = {};
    for (const variant of item['variant_printer']) {
      for (const printer of variant['kc_id_list']) {
        /*Separate only if variant counter is different from item counter*/
        if (!item_printers.includes(printer)) {
          if (!(item['itr'] + '_' + printer in temp_item_obj)) {
            temp_item_obj[item['itr'] + '_' + printer] = [];
          }
          if (!(item['itr'] + '_' + printer in temp_item_data)) {
            temp_item_data[item['itr'] + '_' + printer] = [];
          }
          if (printer_variant_name_arr_map[printer]) {
            printer_variant_name_arr_map[printer].push(variant['name']);
          } else {
            printer_variant_name_arr_map[printer] = [variant['name']];
          }
          if (temp_item_data[item['itr'] + '_' + printer].length === 0) {
            try {
              temp_item_data[item['itr'] + '_' + printer].push({
                counterName: printer_mapping[item['item_id']][printer]['counter_name'],
                printerName: printer_mapping[item['item_id']][printer]['printer_name'],
                ptr_id: printer_mapping[item['item_id']][printer]['ptr_id'],
              });
            } catch (e) {
              temp_item_data[item['itr'] + '_' + printer].push({
                counterName: 'Default Counter',
                printerName: 'Default Printer',
                ptr_id: 'master',
              });
            }
          }
        }
      }
    }
    for (const [printer, variant_arr] of Object.entries(printer_variant_name_arr_map)) {
      const obj_clone = cloneDeep(obj);
      obj_clone['variant'] = `${variant_arr.toString()}`;
      temp_item_obj[item['itr'] + '_' + printer].push(obj_clone);
    }
  }
}

/* Get settings value by name */
function getSettingVal(rest_details, name, order_details = {}) {
  const settings = rest_details['settings'];
  let setting_val = null;
  const print_keys = [
    'master_docket',
    'on_accept_new_order',
    'on_accept_new_itr',
    'on_void_unaccepted',
    'on_void_accepted',
    'on_void_new_itr',
    'font_size',
    'slip_font',
    'cash_mgt_format_override',
    'master_docket_printer',
    'on_table_change',
    'counter_footer',
    'format_code',
    'response_format',
    'pmt_mode_in_body',
    'separate_docket',
    'void_format_code',
    'void_separate_docket',
    'show_logo',
    'on_decline',
    'sname',
    'uname',
    'show_op_order_id',
    'header',
    'footer',
    'counter_footer',
    'split_addon_variant',
    'configurable_settings',
    'master_counter_itr_list',
    'custom_counter_note',
    'char_page_code',
    'feed_point',
    'language_code',
    'show_item_name_with_variant',
    'print_bahasa',
    'qty_align',
  ];
  const menu_keys = ['item_code', 'pax'];

  // print settings
  if (print_keys.includes(name)) {
    // Check whether to show offline-platform order_id{
    if (name == 'show_op_order_id') {
      setting_val = 0;
      if (
        !['easyeat', '', null, undefined].includes(order_details.platform) &&
        order_details &&
        order_details.order_by === 'auto'
      ) {
        setting_val =
          settings.print && settings.print.show_op_order_id ? settings.print.show_op_order_id : 0;
      }
    } else if (name === 'response_format') {
      setting_val = settings.print && settings.print[name] >= 0 ? settings.print[name] : null;
    } else if (name === 'slip_font') {
      setting_val = settings.print && settings.print[name] ? settings.print[name] : {};
    } else if (name === 'configurable_settings') {
      setting_val =
        settings.print && settings.print[name]
          ? settings.print[name]
          : DefaultConfigurablePrintSettings;
    } else {
      setting_val = settings.print && settings.print[name] ? settings.print[name] : 0;
    }
  }
  // menu settings
  else if (menu_keys.includes(name)) {
    setting_val = settings.menu && settings.menu[name] ? settings.menu[name] : 0;
  }
  return setting_val;
}

function getUnit(item) {
  let unit = '';
  try {
    const base_qty = item.base_qty ? item.base_qty : '';
    unit = item.unit && item.unit !== 'number' ? item.unit : '';
    if (base_qty != '' && base_qty.toString() != '1') {
      unit = '(x ' + base_qty + unit + ')';
    }
  } catch (e) {
    unit = '';
  }
  return unit;
}

/* Get round off value around a base value */
function getRoundOffValue(value, base, roundup = false) {
  base = base > 0 ? base : 1;
  // Smaller multiple
  const a = parseInt((Number(value) / base).toString()) * base;
  // Larger multiple
  const b = a + base;
  // Return of closest of two
  return value - a >= b - value || (roundup === true && value - a > 0) ? b : a;
}

function getAddons(item) {
  const addons = item.addons && Array.isArray(item.addons) ? item.addons : [];
  if (addons.length == 0 && item.addons_name && item.addons_name != '') {
    const addons_list = item.addons_name.split(',').filter((e) => e.trim());
    addons_list.forEach((addon) => addons.push({ name: addon }));
  }
  return addons;
}

/* Separate variant by Counter */
function separateStickerPrinterObjects(
  item,
  order_details,
  rest_details,
  temp_item_obj,
  temp_item_data,
) {
  const sticker_counter_array = [];
  const item_info_object = {};
  const printer_info_object = {};
  const searchString = item['itr'] + '_' + item['kitchen_counter_id'];
  if (!(item['itr'] + '_' + item['kitchen_counter_id'] in item_info_object)) {
    item_info_object[item['itr'] + '_' + item['kitchen_counter_id']] = [];
  }

  if (!(item['itr'] + '_' + item['kitchen_counter_id'] in printer_info_object)) {
    printer_info_object[item['itr'] + '_' + item['kitchen_counter_id']] = [];
  }

  const item_obj = {
    name: item['item_name'],
    qty: item['item_quantity'],
    unit: getUnit(item),
    addon: '',
    variant: item['new_variation_name']
      ? item['new_variation_name']
      : item['variation_name']
      ? item['variation_name']
      : '',
    note: item['special_note'] ? item['special_note'] : '',
  };

  /* Create new counter obj for addons if it has printer name present */

  item['addons'] = getAddons(item);

  for (const addon of item['addons']) {
    if (
      !addon['printer'] ||
      (addon['printer'] &&
        addon['printer'].trim() &&
        addon['printer'] === item['kitchen_counter_id'])
    ) {
      item_obj['addon'] += item_obj['addon'] === '' ? addon['name'] : ', ' + addon['name'];
    } else if (addon['printer'] && addon['printer'].trim()) {
      const printer = addon['printer'].trim();
      if (!(item['itr'] + '_' + printer in temp_item_obj)) {
        temp_item_obj[item['itr'] + '_' + printer] = [];
      }
      if (!(item['itr'] + '_' + printer in temp_item_data)) {
        temp_item_data[item['itr'] + '_' + printer] = [];
      }
      temp_item_obj[item['itr'] + '_' + printer].push({
        name: addon['name'],
        qty: item['item_quantity'],
        addon: '',
        variant: '',
        note: '',
      });
      if (temp_item_data[item['itr'] + '_' + printer].length === 0) {
        temp_item_data[item['itr'] + '_' + printer].push({
          counterName: printer,
          printerName: printer,
        });
      }
    }
  }

  item_info_object[item['itr'] + '_' + item['kitchen_counter_id']].push(item_obj);

  if (printer_info_object[item['itr'] + '_' + item['kitchen_counter_id']].length === 0) {
    printer_info_object[item['itr'] + '_' + item['kitchen_counter_id']].push({
      kitchen_counter_id: item['kitchen_counter_id'],
      counterName: item['counter_name'] != '' ? item['counter_name'] : 'Default Counter',
      printerName: item['printer_name'] != '' ? item['printer_name'] : 'Default Printer',
      sticker_height: item['sticker_height'] ? item['sticker_height'] : '40',
      sticker_width: item['sticker_width'] ? item['sticker_width'] : '48',
      auto_cut_enabled: item['auto_cut_enabled'] ? item['auto_cut_enabled'] : 0,
      is_single_roll: item['is_single_roll'] ? item['is_single_roll'] : 0,
    });
  }

  const obj = {};
  obj['type'] = ReceiptType.STICKER_PRINTER;
  obj['counterName'] = printer_info_object[searchString][0]['counterName'];
  obj['ptr_id'] = printer_info_object[searchString][0]['kitchen_counter_id'];
  obj['printerName'] = printer_info_object[searchString][0]['printerName'];
  obj['sticker_height'] = printer_info_object[searchString][0]['sticker_height'];
  obj['sticker_width'] = printer_info_object[searchString][0]['sticker_width'];
  obj['auto_cut_enabled'] = printer_info_object[searchString][0]['auto_cut_enabled'];
  obj['is_single_roll'] = printer_info_object[searchString][0]['is_single_roll'];
  obj['body'] = {};
  // obj['body']['Type'] = order_details['order_type'];

  // /*Exclude takeaway,pickup and null table_no or table_id from counter details*/
  // if (
  //   !['', null, undefined].includes(order_details['table_no']) &&
  //   !['takeaway', 'pickup'].includes(order_details['table_id'])
  // ) {
  //   obj['body']['Table'] = order_details['table_no'].toString();
  // }

  obj['body'][KeyName.ORDER_SEQ] = order_details['order_seq'];
  obj['body'][KeyName.CUSTOMER_NAME] = order_details['name'];
  const get_date_time = addDateTime(order_details, rest_details);
  obj['body'][KeyName.DATETIME] = get_date_time['datetime'];
  obj['items'] = item_info_object[searchString];
  sticker_counter_array.push(obj);

  try {
    for (let i = sticker_counter_array.length - 1; i >= 0; i--) {
      const counter_obj = sticker_counter_array[i];
      for (let item_obj_idx = counter_obj['items'].length - 1; item_obj_idx >= 0; item_obj_idx--) {
        const item_obj = counter_obj['items'][item_obj_idx];
        for (let sticker_slips = 0; sticker_slips < +item_obj['qty']; sticker_slips++) {
          const deep_copy = cloneDeep(counter_obj);
          deep_copy['items'] = [cloneDeep(item_obj)];
          deep_copy['items'][0]['qty'] = '1';
          deep_copy['body']['NUMBER OF ITEMS'] = `${sticker_slips + 1}/${item_obj['qty']}`;
          sticker_counter_array.push(deep_copy);
        }
        counter_obj['items'].splice(item_obj_idx, 1);
      }
    }
    for (let idx = sticker_counter_array.length - 1; idx >= 0; idx--) {
      if (sticker_counter_array[idx]['items'].length === 0) {
        sticker_counter_array.splice(idx, 1);
      }
    }
  } catch (e) {
    console.log('separateStickerPrinterObjects error: ', e);
  }
  return sticker_counter_array;
}

function getModifiedVariantName(item, item_kc_id) {
  const variant_name_array = (
    item['new_variation_name']
      ? item['new_variation_name']
      : item['variation_name']
      ? item['variation_name']
      : ''
  ).split(',');
  if (item['is_copy']) {
    if (item['variant_printer_copy']) {
      for (const variant of item['variant_printer_copy']) {
        for (const name of variant_name_array) {
          if (
            name.toLowerCase().includes(variant['name'].toLowerCase()) &&
            !variant['kc_id_list'].toString().includes(item_kc_id)
          ) {
            const idx = variant_name_array.indexOf(name);
            variant_name_array.splice(idx, 1);
          }
        }
      }
    }
  } else {
    if (item['variant_printer']) {
      for (const variant of item['variant_printer']) {
        for (const name of variant_name_array) {
          if (
            name.toLowerCase().includes(variant['name'].toLowerCase()) &&
            !variant['kc_id_list'].toString().includes(item_kc_id)
          ) {
            const idx = variant_name_array.indexOf(name);
            variant_name_array.splice(idx, 1);
          }
        }
      }
    }
  }
  return variant_name_array.length > 0 ? variant_name_array.toString() : '';
}

function formatCounterObj(receipt_data_list, type, rest_details) {
  let format_code = getSettingVal(rest_details, 'format_code');
  let separate_docket = getSettingVal(rest_details, 'separate_docket');
  const void_format_code = getSettingVal(rest_details, 'void_format_code');
  const void_separate_docket = getSettingVal(rest_details, 'void_separate_docket');

  if (type == 3 || type == 5) {
    format_code = void_format_code;
    separate_docket = void_separate_docket;
  }

  if (format_code && ['001', '002', '003'].indexOf(format_code) != -1) {
    for (let i = 0; i < receipt_data_list.length; i++) {
      if (receipt_data_list[i]['type'] === 'counter') {
        if (type != 3 && type != 5) {
          receipt_data_list[i]['code'] = format_code;
        }

        if (format_code === '001') {
          receipt_data_list[i] = separateAddonsFromItem(receipt_data_list[i]);
        } else if (format_code === '002') {
          receipt_data_list[i] = separateItemsAndAddonsByQty(receipt_data_list[i]);
        } else if (format_code === '003') {
          receipt_data_list[i] = separateItemsOnlyByQty(receipt_data_list[i]);
        }
      }
    }
  }
  if (separate_docket && separate_docket > 0) {
    receipt_data_list = separateAllDockets(receipt_data_list);
  }
  return receipt_data_list;
}

function separateAllDockets(counter_obj_list) {
  const separated_list = [];
  for (const counter_obj of counter_obj_list) {
    const items = counter_obj['items'];
    for (let i = 0; i < items.length; i++) {
      const temp_counter_obj = { ...counter_obj };
      temp_counter_obj['items'] = [items[i]];
      separated_list.push(temp_counter_obj);
    }
  }
  return separated_list;
}

function separateAddonsFromItem(counter_data) {
  const counter_obj = { ...counter_data };
  const separate_addon_list = [];
  for (let j = 0; j < counter_obj['items'].length; j++) {
    const item = counter_obj['items'][j];
    if (item['addon'] && item['addon'].trim() !== '') {
      const addon_list = item['addon'].trim().split(',');
      for (const addon of addon_list) {
        const temp_addon = {
          name: addon ? addon.trim() : '',
          qty: item['qty'],
          addon: '',
          variant: '',
          note: '',
        };
        if (item['strike'] && item['strike'] == 1) {
          temp_addon['strike'] = 1;
        }
        separate_addon_list.push(temp_addon);
      }
      counter_obj['items'][j]['addon'] = '';
    }
  }
  counter_obj['items'] = counter_obj['items'].concat(separate_addon_list);
  return counter_obj;
}

// For code=002 => separate both items & addons by qty (extract addons from item)
function separateItemsAndAddonsByQty(counter_data) {
  const counter_obj = { ...counter_data };
  const separate_item_list = [];
  for (let j = 0; j < counter_obj['items'].length; j++) {
    const item = counter_obj['items'][j];
    for (let k = 0; k < item['qty']; k++) {
      const temp_item = {
        name: item['name'],
        qty: 1,
        unit: getUnit(item),
        addon: '',
        variant: item['variant'] ? item['variant'] : '',
        note: item['note'] ? item['note'] : '',
      };
      if (item['strike'] && item['strike'] == 1) {
        temp_item['strike'] = 1;
      }
      separate_item_list.push(temp_item);

      if (item['addon'] && item['addon'].trim() !== '') {
        const addon_list = item['addon'].trim().split(',');
        for (const addon of addon_list) {
          const temp_addon = {
            name: addon.trim(),
            qty: 1,
            addon: '',
            variant: '',
            note: '',
          };
          if (item['strike'] && item['strike'] == 1) {
            temp_addon['strike'] = 1;
          }
          separate_item_list.push(temp_addon);
        }
      }
    }
  }
  counter_obj['items'] = separate_item_list;
  return counter_obj;
}

// For code=003 => separate only items by qty (keep addons inside item)
function separateItemsOnlyByQty(counter_data) {
  const counter_obj = { ...counter_data };
  const separate_item_list = [];
  for (let j = 0; j < counter_obj['items'].length; j++) {
    const item = counter_obj['items'][j];
    for (let k = 0; k < item['qty']; k++) {
      const temp_item = {
        name: item['name'],
        qty: 1,
        unit: getUnit(item),
        addon: item['addon'] ? item['addon'] : '',
        variant: item['variant'] ? item['variant'] : '',
        note: item['note'] ? item['note'] : '',
      };
      if (item['strike'] && item['strike'] == 1) {
        temp_item['strike'] = 1;
      }
      separate_item_list.push(temp_item);
    }
  }
  counter_obj['items'] = separate_item_list;
  return counter_obj;
}

function appendCounterFooter(notes, rest_details) {
  const footers = getSettingVal(rest_details, 'counter_footer');
  if (notes.length > 0 && footers && Array.isArray(footers)) {
    for (const elem of footers) {
      if (elem.trim()) {
        notes.push(elem);
      }
    }
  }
  return notes;
}

function insertSpaceInReceipt(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({ key: '_line_', value: ' ' });
  }
  return arr;
}

function getOrderTypeBinaryPlace(order_type) {
  order_type = Number(order_type);
  return order_type === 0 ? 1 : order_type === 1 ? 2 : order_type === 2 ? 4 : 'NA';
}

/* modify order items*/
function getItemsList(
  item_list,
  rest_details,
  kitchen_counters,
  subcat_counters,
  kitchen_counter_details,
) {
  const restaurant_id = rest_details.id;
  const show_item_code = getSettingVal(rest_details, 'item_code');
  const new_items_list = [];
  const unmapped_item_list = [];
  //($show_item_code & 16) == 16 && $item['item_code'] !== null && trim($item['item_code']) !== ''
  for (const item of item_list) {
    if ((show_item_code & 16) == 16 && item['item_code'] && item['item_code'].trim() !== '') {
      item['item_name'] = `(${item['item_code']}) ${item['item_name']}`;
    }
    let count = 0;
    item['dummy_kitchen_counter_id'] =
      item['kitchen_counter_id'] && item['kitchen_counter_id'].trim()
        ? item['kitchen_counter_id']
        : '';

    if (
      kitchen_counter_details[item['item_id']] &&
      Object.keys(kitchen_counter_details[item['item_id']]).length > 0
    ) {
      let kc_id_list = [];
      for (let counter_id of Object.keys(kitchen_counter_details[`${item['item_id']}`])) {
        kc_id_list.push(counter_id);
      }

      let all_counters = kitchen_counter_details[item['item_id']];

      for (const kc_id of kc_id_list) {
        const temp_item = { ...item };
        temp_item['kitchen_counter_id'] = kc_id;

        if (count > 0) {
          /*I am deleting deleting variant_printer key from item copy because i do not want to create extra copies
            of variant name in counter objects. I am also injecting 'variant_printer_copy' key with variant_printer
            data as i will need it to modify variant names in counter objects for copied item object.*/
          const variant_printer = temp_item['variant_printer'];
          delete temp_item['variant_printer'];
          /* Injecting new key in item copy object if find if it's the copied one. */
          temp_item['is_copy'] = true;
          temp_item['variant_printer_copy'] = variant_printer;
        }

        let counter_details = null;
        for (let kitchen_counter_id of Object.keys(all_counters)) {
          if (kitchen_counter_id === kc_id) {
            counter_details = all_counters[kitchen_counter_id];
          }
        }
        // const counter_details = all_counters.filter((e) => e.kitchen_counter_id === kc_id)[0];
        if (counter_details) {
          temp_item['counter_name'] = counter_details['counter_name']
            ? counter_details['counter_name']
            : 'default';
          temp_item['printer_name'] = counter_details['printer_name']
            ? counter_details['printer_name']
            : 'default';
          temp_item['ptr_id'] = counter_details['kitchen_counter_id'];
          if (counter_details['is_sticker_printer']) {
            temp_item['sticker_print'] = 1;
            /* configurable sticker printing */
            temp_item['is_single_roll'] = counter_details['is_single_roll']
              ? counter_details['is_single_roll']
              : 0;
            temp_item['auto_cut_enabled'] = counter_details['auto_cut_enabled']
              ? counter_details['auto_cut_enabled']
              : 0;
            temp_item['sticker_height'] = counter_details['sticker_height']
              ? counter_details['sticker_height']
              : '40';
            temp_item['sticker_width'] = counter_details['sticker_width']
              ? counter_details['sticker_width']
              : '48';
          }
        } else {
          temp_item['counter_name'] = 'default';
          temp_item['printer_name'] = 'default';
        }

        if (temp_item['counter_name'] === 'default') {
          if (unmapped_item_list.indexOf(temp_item['item_id']) == -1) {
            temp_item['kitchen_counter_id'] = 'default_override';
            temp_item['counter_name'] = 'Invalid Counters';
            temp_item['printer_name'] = rest_details['printer']
              ? rest_details['printer']
              : 'Default Printer';
            temp_item['ptr_id'] = 'master';
            unmapped_item_list.push(temp_item['item_id']);
            new_items_list.push(temp_item);
          }
        } else {
          new_items_list.push(temp_item);
        }

        count = count + 1;
      }
    }

    if (count === 0) {
      let item_copy_count = 0;
      let all_counters = subcat_counters[item['subcategory_id']];

      if (all_counters && all_counters.length > 0) {
        for (const counter of all_counters) {
          const temp_item = { ...item };

          if (item_copy_count > 0) {
            /*I am deleting deleting variant_printer key from item copy because i do not want to create extra copies
            of variant name in counter objects. I am also injecting 'variant_printer_copy' key with variant_printer
            data as i will need it to modify variant names in counter objects for copied item objects.*/
            const variant_printer = temp_item['variant_printer'];
            delete temp_item['variant_printer'];
            /* Injecting new key in item copy object if find if it's the copied one. */
            temp_item['is_copy'] = true;
            temp_item['variant_printer_copy'] = variant_printer;
          }
          temp_item['kitchen_counter_id'] = counter['kc_id'];
          temp_item['counter_name'] = counter['counter_name'];
          temp_item['printer_name'] = counter['printer_name'];
          temp_item['ptr_id'] = counter['kitchen_counter_id'];
          if (counter['is_sticker_printer']) {
            temp_item['sticker_print'] = 1;
            /* configurable sticker printing */
            temp_item['is_single_roll'] = counter['is_single_roll'] ? counter['is_single_roll'] : 0;
            temp_item['auto_cut_enabled'] = counter['auto_cut_enabled']
              ? counter['auto_cut_enabled']
              : 0;
            temp_item['sticker_height'] = counter['sticker_height']
              ? counter['sticker_height']
              : '40';
            temp_item['sticker_width'] = counter['sticker_width'] ? counter['sticker_width'] : '48';
          }
          new_items_list.push(temp_item);
          item_copy_count += 1;
        }
      } else {
        item['kitchen_counter_id'] = 'default';
        item['counter_name'] = 'Unmapped Items';
        item['printer_name'] = rest_details['printer']
          ? rest_details['printer']
          : 'Default Printer';
        item['ptr_id'] = 'master';
        new_items_list.push(item);
      }
    }
  }
  return new_items_list;
}

function localize(key, language = CountryMapping.MALAYSIA.language) {
  if (!enKeys[key]) {
    return key;
  }
  language = language || CountryMapping.MALAYSIA.language;
  if (language === CountryMapping.INDONESIA.language) {
    return idKeys[key] ? idKeys[key] : enKeys[key];
  }
  return enKeys[key];
}

function getOrderTypeTextv2(order_type, table_id, language = PrintLanguage.DEFAULT) {
  return order_type === 0
    ? localize(KeyName.DINEIN, language)
    : order_type === 1
    ? localize(KeyName.DELIVERY, language)
    : order_type === 2 && table_id === 'takeaway'
    ? localize(KeyName.TAKEAWAY, language)
    : order_type === 2
    ? localize(KeyName.PICKUP, language)
    : 'NA';
}

function getOrderTypeString(order_details, rest_details, language = null) {
  const result = order_details;
  /*Check if indonesian language is enabled */
  language = language || getPrintLanguage(rest_details);
  try {
    result['order_type'] = getOrderTypeTextv2(
      order_details['order_type'],
      order_details['table_id'],
      language,
    );
    if (![null, undefined, '', 'easyeat'].includes(order_details.platform)) {
      result['table_no'] = undefined;
      let platform = order_details.platform;
      platform = platform.charAt(0).toUpperCase() + platform.slice(1);
      result['order_type'] = platform;
    }
  } catch (e) {}

  return result;
}

function getModifiedOrderNo(order_details) {
  if (order_details['platform'] === 'grab' || order_details['platform'] === 'grabfood') {
    return `${order_details['order_no']} ( ${order_details['op_no']} )`;
  } else {
    return `${order_details['order_no']} ( ${order_details['order_id']} )`;
  }
}

function getLocalizedData(
  data,
  locale = '',
  country = '',
  include_list = [],
  quantity_keys_list = [],
  exclude_list = [],
  key_suffix = '',
) {
  let current_locale = 'en-US';
  try {
    current_locale = getCurrentLocale(locale, current_locale, country);
    try {
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
    return localizeData(
      data,
      current_locale,
      '',
      include_list,
      quantity_keys_list,
      exclude_list,
      key_suffix,
    );
  } catch (e) {
    return data;
  }
}

function localizeData(
  data,
  locale,
  key_to_format = '',
  include_list = [],
  quantity_list = [],
  exclude_list = [],
  key_suffix = '',
) {
  // Stringify and Parse needed to make res a new object (remove reference from data)
  let res = JSON.parse(JSON.stringify(data));
  try {
    // Localise all elements in array with only numbers
    if (data && Array.isArray(data) && data.length > 0 && !data.some((element) => isNaN(element))) {
      if (isLocalizable(key_to_format, include_list, quantity_list, exclude_list)) {
        const arraySize = data.length;
        for (let i = 0; i < arraySize; i++) {
          res[i] = localizeData(
            data[i],
            locale,
            key_to_format,
            include_list,
            quantity_list,
            exclude_list,
            key_suffix,
          );
        }
      }
    } else if (
      data &&
      (Array.isArray(data) || typeof data === 'object') &&
      Object.keys(data).length > 0
    ) {
      for (const [key, value] of Object.entries(data)) {
        let new_key = key;
        if (Array.isArray(value) && isNumberOnlyArray(value)) {
          if (isLocalizable(key, include_list, quantity_list, exclude_list)) {
            new_key = key + (key_suffix ? key_suffix : '_text');
          }
        } else if (
          typeof value === 'number' ||
          (!['null', 'undefined', ''].includes(String(value)) && !isNaN(Number(value)))
        ) {
          if (isLocalizable(key, include_list, quantity_list, exclude_list)) {
            new_key = key + (key_suffix ? key_suffix : '_text');
            // Sanitizing the data : Converting the value to number if present as string.
            res[key] = Number(value);
          }
        }
        res[new_key] = localizeData(
          value,
          locale,
          key,
          include_list,
          quantity_list,
          exclude_list,
          key_suffix,
        );
      }
    } else if (
      typeof data === 'number' ||
      (!['null', 'undefined', ''].includes(String(data)) && !isNaN(Number(data)))
    ) {
      if (isLocalizable(key_to_format, include_list, quantity_list, exclude_list)) {
        try {
          if (quantity_list.includes(key_to_format)) {
            res = getQuantityFormatter(locale).format(Number(data));
          } else {
            res = getNumberFormatter(locale).format(Number(data));
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
  return res;
}

function getQuantityFormatter(locale) {
  const malaysiaFormatter = new Intl.NumberFormat(CountryMapping.MALAYSIA.locale);
  const indonesiaFormatter = new Intl.NumberFormat(CountryMapping.INDONESIA.locale);

  if (typeof locale === 'string' && locale.trim() != '') {
    if (locale === CountryMapping.INDONESIA.locale) {
      return indonesiaFormatter;
    }
  }
  return malaysiaFormatter;
}

function getNumberFormatter(locale) {
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
}

function isLocalizable(key, include_list, quantity_list, exclude_list) {
  if (
    (Array.isArray(include_list) && include_list.length > 0) ||
    (Array.isArray(quantity_list) && quantity_list.length > 0)
  ) {
    if (include_list.includes(key)) {
      return true;
    }
    if (quantity_list.includes(key)) {
      return true;
    }
  }
  if (Array.isArray(exclude_list) && exclude_list.length > 0) {
    if (!exclude_list.includes(key)) {
      return true;
    }
  }
  if (
    Array.isArray(include_list) &&
    include_list.length === 0 &&
    Array.isArray(quantity_list) &&
    quantity_list.length === 0 &&
    Array.isArray(exclude_list) &&
    exclude_list.length === 0
  ) {
    return true;
  }
  return false;
}

function getCurrentLocale(locale, current_locale, country) {
  if (typeof locale === 'string' && locale.trim() != '') {
    current_locale = locale.trim();
  } else if (typeof country === 'string' && country.trim() != '') {
    if (country.length === 2) {
      const country_details = getCountryDetails('country_code', country.trim());
      current_locale = country_details['locale'] ? country_details['locale'] : current_locale;
    } else {
      current_locale = getLocaleForCountry(country.trim());
    }
  }
  return current_locale;
}

// Get allergic items
function getAllergicItemsList(allergic_items) {
  if (!allergic_items) {
    return [];
  }
  const allergic_items_list = [];
  try {
    if (allergic_items['is_allergy'] === 1) {
      for (const category of allergic_items['categories']) {
        let string = '';
        string += category['cat_name'];

        let subcat_str = '';
        if (category['subcat']) {
          for (const subcat of category['subcat']) {
            subcat_str += subcat_str ? subcat['subcat_name'] : subcat['subcat_name'];
          }
        }
        if (subcat_str.length > 0) {
          string += `-(${subcat_str})`;
        }
        allergic_items_list.push(string);
      }
    }
  } catch (e) {}

  return allergic_items_list;
}

/* Get is_paid status of order  */
function getIsPaid(bill) {
  let is_paid = 0;
  try {
    const balance = Number(bill['balance']);
    const paid = Number(bill['paid']);
    is_paid = balance < 0 ? 4 : balance === 0 ? 3 : balance > 0 && paid > 0 ? 2 : 1;
  } catch (e) {}
  return is_paid;
}

module.exports = {
  getOnlySuccessfulPayments,
  getAddons,
  getPrintLanguage,
  separateAddress,
  getOrderTypeText,
  unMappedItemMapping,
  comboPrinting,
  addDateTime,
  getSettingVal,
  separateStickerPrinterObjects,
  getModifiedVariantName,
  separateVariantByCounter,
  formatCounterObj,
  getUnit,
  appendCounterFooter,
  insertSpaceInReceipt,
  getOrderTypeBinaryPlace,
  getItemsList,
  getOrderTypeString,
  getModifiedOrderNo,
  getLocalizedData,
  getCurrentLocale,
  getRoundOffValue,
  getAllergicItemsList,
  getIsPaid,
};

//console.log(formatv2("", [{ name: "saurabh" }]));
