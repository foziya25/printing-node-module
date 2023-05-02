const {
  getAddons,
  addDateTime,
  separateAddress,
  getOnlySuccessfulPayments,
  getOrderTypeText,
  comboPrinting,
  getPrintLanguage,
  getSettingVal,
  separateStickerPrinterObjects,
  getModifiedVariantName,
  separateVariantByCounter,
  formatCounterObj,
  getUnit,
  appendCounterFooter,
  getOrderTypeBinaryPlace,
  getItemsList,
  getOrderTypeString,
  getModifiedOrderNo,
  getRoundOffValue,
} = require('../utils/utils');

const {
  localize,
  localiseDrawerNames,
  formatv2,
  getInternationalizedNumber,
  getCountryDetails,
  getCashInfo,
  getIsPaid,
} = require('../utils/printing-utils');

const { getPmtMethodName, getPmtMethods } = require('../classes/payment');

const moment = require('moment');

const {
  convertReceiptObj,
  convertCounterObj,
  convertMasterObj,
  convertTableTransferObj,
  convertVoidAndCancelCounterObj,
  convertVoidMasterObj,
  convertDeclineMasterObj,
} = require('./printing-new-slip');
const { cloneDeep } = require('lodash/lang');
const { KeyName, FormatType, CountryMapping } = require('../config/enums');

/* generate printing payload for bill receipt */
function generateBillReceipt(order_details, rest_details, bill_details, merge_bill = false) {
  if (order_details) {
    if (order_details.length == 1) {
      order_details = order_details[0];
    }
    // else if (order_details.length > 1) {}
  } else {
    return [];
  }
  const order_id = order_details['order_id'];
  const show_sname = rest_details['settings']['print']['sname'];
  const show_uname = rest_details['settings']['print']['uname'];
  const show_item_code = rest_details['settings']['print']['item_code'];
  const pax_enabled = rest_details['settings']['print']['pax'];
  const show_logo = getSettingVal(rest_details, 'show_logo');
  const show_op_order_id = getSettingVal(rest_details, 'show_op_order_id', order_details);

  // object to store the same items for final bill aggregating purpose
  let print_data_item_mapping = {};

  const obj = {};
  obj['type'] = 'receipt';
  obj['printerName'] = rest_details['printer'] ? rest_details['printer'] : 'Cashier';
  obj['ptr_id'] = 'master';

  if (show_logo && show_logo > 0) {
    obj['logo'] = rest_details['print_logo'];
  }
  obj['header'] = [];
  const header_obj = getSettingVal(rest_details, 'header');
  // rest_details['settings']['print']['header'];
  const custom_header = header_obj ? header_obj['custom'] : null;
  if (custom_header && Array.isArray(custom_header) && custom_header.length > 0) {
    obj['header'] = custom_header;
  } else {
    // Add strings from prepend list
    obj['header'].push(rest_details.name);
    const prepend_list = header_obj ? header_obj['prepend'] : [];
    if (prepend_list && prepend_list.length > 0) {
      prepend_list.forEach((str) => obj['header'].push(str));
    }
    // Add address
    obj['header'] = separateAddress(obj['header'], rest_details.address, 30);
    // Add strings from append list
    const append_list = header_obj ? header_obj['append'] : [];
    if (append_list && append_list.length > 0) {
      append_list.forEach((str) => obj['header'].push(str));
    }
  }
  obj['body'] = {};
  obj['body'][KeyName.ORDERTYPE] = getOrderTypeText(order_details['order_type']);

  if (!['', null, undefined].includes(order_details['table_no'])) {
    obj['body'][KeyName.TABLE] = order_details['table_no'].toString();
  }
  obj['body'][KeyName.INVOICE] = `#${order_details['order_no']}`;
  obj['body'][KeyName.ORDER_SEQ] = order_details['order_seq'];

  const guest_name = order_details.guest_name;
  if (guest_name && guest_name.trim()) {
    obj['body'][KeyName.INVOICE] += ` (${guest_name})`;
  }

  const get_date_time = addDateTime(order_details, rest_details);
  obj['body'][KeyName.DATE] = get_date_time['date'];
  obj['body'][KeyName.TIME] = get_date_time['time'];

  obj['body'][KeyName.CASHIER] = rest_details.cashier ? rest_details.cashier : '';

  if (pax_enabled == 1) {
    obj['body'][KeyName.PAX] = order_details.pax ? order_details.pax.toString() : '';
  }

  if (show_sname == 1) {
    // obj['body']['name'] = order_details.sname;
    obj['body'][KeyName.STAFF_NAME] = order_details.sname;
  }

  if (show_uname == 1) {
    obj['body'][KeyName.CUSTOMER_NAME] = order_details.name ? order_details.name : '';
  }
  obj['body'][KeyName.CUSTOMER_PHONE] =
    order_details['phone'] && order_details['phone'].length < 14 ? order_details['phone'] : '';

  obj['order'] = {};
  obj['order']['currency'] = rest_details.curr_sym ? rest_details.curr_sym : 'RM';
  obj['order']['allergic_items'] = order_details['allergic_items'];

  obj['order']['items'] = [];

  let noOfItems = 0;
  for (const original_item of order_details['items']) {
    const item = { ...original_item };
    if (item['item_status'] != 5 && item['item_status'] != 6) {
      if ((show_item_code & 8) == 8 && item['item_code'] && item['item_code'].trim() != '') {
        item['item_name'] = `(${item['item_code']}) ${item['item_name']}`;
      }
      const item_obj = {
        name: item['item_name'],
        qty: item['item_quantity'],
        unit: getUnit(item),
        price: item['item_price'],
        amount: item['item_price'] * item['item_quantity'],
        addon: item['addons_name'] ? swapQtyWithaddonName(item['addons_name']) : '',
        variant: item['new_variation_name']
          ? item['new_variation_name']
          : item['variation_name']
          ? item['variation_name']
          : '',
      };
      if (item['item_discount']) {
        item_obj['item_discount'] = item['item_discount']['amount'];
      }
      if (item['is_combo_item']) {
        item_obj['combo_name'] = '';
        for (const combo_item of item['combo_items']) {
          item_obj['combo_name'] +=
            item_obj['combo_name'] === ''
              ? `(${combo_item['quantity']}) ${combo_item['item_name']}`
              : `, (${combo_item['quantity']}) ${combo_item['item_name']}`;
        }
      }
      if (
        [
          localize(KeyName.DINEIN, getPrintLanguage(rest_details)),
          localize(KeyName.TAKEAWAY, getPrintLanguage(rest_details)),
        ].includes(order_details.order_type)
      ) {
        const receipt_aggregation_key = item_obj['name'] + item_obj['addon'] + item_obj['variant'];
        if (!print_data_item_mapping.hasOwnProperty(receipt_aggregation_key)) {
          print_data_item_mapping[receipt_aggregation_key] = {
            index: obj['order']['items'].length,
          };
          obj['order']['items'].push(item_obj);
        } else {
          const item_idx = print_data_item_mapping[receipt_aggregation_key]['index'];
          obj['order']['items'][item_idx]['amount'] += item_obj['amount'];
          obj['order']['items'][item_idx]['qty'] += item_obj['qty'];
          if (item['item_discount']) {
            if (obj['order']['items'][item_idx].hasOwnProperty('item_discount')) {
              obj['order']['items'][item_idx]['item_discount'] += item_obj['item_discount'];
            } else {
              obj['order']['items'][item_idx]['item_discount'] = item_obj['item_discount'];
            }
          }
        }
      } else {
        obj['order']['items'].push(item_obj);
      }
    }
  }

  for (const item of obj['order']['items']) {
    noOfItems += item['qty'];
  }

  obj['body'][KeyName.NO_OF_ITEMS] = noOfItems.toString();

  obj['order']['bill'] = [];
  let subtotal_index = null;
  for (const [key, fee] of Object.entries(bill_details['fees'])) {
    if (
      fee['id'] === 'item_total' &&
      !(order_details['order_by'] === 'auto' && order_details['platform'] === 'foodpanda')
    ) {
      fee['fee_name'] = 'Sub-Total';
    }
    obj['order']['bill'].push({ name: fee['fee_name'], value: fee['fee'] });

    if (['platform_commision', 'platform_commission'].includes(fee['id'])) {
      subtotal_index = key;
    }
  }

  // If subtotal exists, insert it before platform_commission object
  if (
    order_details['order_by'] === 'auto' &&
    order_details['platform'] === 'foodpanda' &&
    bill_details['subtotal']
  ) {
    const subtotal_obj = {
      name: 'Sub-Total',
      value: bill_details['subtotal'],
    };
    if (subtotal_index === null) {
      obj['order']['bill'].push(subtotal_obj);
    } else {
      obj['order']['bill'].splice(subtotal_index, 0, subtotal_obj);
    }
  }

  obj['order']['bill'].push({
    name: KeyName.TOTAL,
    value: bill_details['bill_total'],
  });

  /* Add Payment Details to Receipt */
  const all_payments = getOnlySuccessfulPayments(bill_details['payments']);
  const temp = {};
  let pmt_header = '';

  if (all_payments.length > 0 && bill_details['paid'] > 0) {
    const platform = order_details.platform ? order_details.platform.toLowerCase() : 'easyeat';

    for (const payment of all_payments) {
      const payment_channel = payment['payment_channel'].toLowerCase();
      temp[payment_channel] = temp[payment_channel] ? temp[payment_channel] : {};

      /* Payment by Cash */
      if (payment_channel === 'cash') {
        if (!temp[payment_channel]['Cash Received']) {
          temp[payment_channel]['Cash Received'] = 0;
          pmt_header += pmt_header ? ', Cash' : 'Cash';
        }
        if (!temp[payment_channel]['Cash Returned']) {
          temp[payment_channel]['Cash Returned'] = 0;
        }

        temp[payment_channel]['Cash Received'] += payment['collected_amt'];
        temp[payment_channel]['Cash Returned'] += payment['returned_amt'];

        if (payment['transaction_id']) {
          const transaction_id = payment['transaction_id'].trim();
          if (temp[payment_channel]['Transaction ID']) {
            temp[payment_channel]['Transaction ID'] += `, ${transaction_id}`;
          } else {
            temp[payment_channel]['Transaction ID'] = transaction_id;
          }
        }
      }

      // Online Wallets
      else if (
        Object.keys(getPmtMethods([2])).includes(payment_channel) &&
        platform === 'easyeat'
      ) {
        if (!temp[payment_channel]['Amount Paid']) {
          temp[payment_channel]['Payment Mode'] = getPmtMethodName(payment_channel);
          temp[payment_channel]['Amount Paid'] = 0;
          pmt_header += pmt_header ? ', ' : '';
          pmt_header += temp[payment_channel]['Payment Mode'];
        }
        temp[payment_channel]['Amount Paid'] += payment['amount'];
        temp[payment_channel]['Amount Paid'] = temp[payment_channel]['Amount Paid'];
      }

      // NetBanking (FPX)
      else if (
        Object.keys(getPmtMethods([4])).includes(payment_channel) &&
        platform === 'easyeat'
      ) {
        if (!temp[payment_channel]['Amount Paid']) {
          const bank_name = getPmtMethodName(payment_channel);
          temp[payment_channel]['Payment Mode'] = 'FPX - ' + bank_name;
          temp[payment_channel]['Amount Paid'] = 0;
          pmt_header += pmt_header ? ', ' : '';
          pmt_header += temp[payment_channel]['Payment Mode'];
        }
        temp[payment_channel]['Amount Paid'] += payment['amount'];
        temp[payment_channel]['Amount Paid'] = temp[payment_channel]['Amount Paid'];
      }

      // Online and Offline credit cards
      else if (
        (Object.keys(getPmtMethods([3])).includes(payment_channel) && platform === 'easyeat') ||
        Object.keys(getPmtMethods([6])).includes(payment_channel)
      ) {
        delete temp[payment_channel];
        temp['credit_card'] = temp['credit_card'] ? temp['credit_card'] : {};
        if (!temp['credit_card']['Amount Paid']) {
          temp['credit_card']['Payment Mode'] = getPmtMethodName(payment_channel);
          temp['credit_card']['Amount Paid'] = 0;
          pmt_header += pmt_header ? ', ' : '';
          pmt_header += temp['credit_card']['Payment Mode'];
        }
        temp['credit_card']['Amount Paid'] += payment['amount'];
        temp['credit_card']['Amount Paid'] = temp['credit_card']['Amount Paid'];

        if (payment['transaction_id']) {
          if (Object.keys(getPmtMethods([6])).includes(payment_channel)) {
            const transaction_id = payment['transaction_id'].trim();
            if (temp['credit_card']['Transaction ID']) {
              temp['credit_card']['Transaction ID'] += `, ${transaction_id}`;
            } else {
              temp['credit_card']['Transaction ID'] = transaction_id;
            }
          }
        }
      }

      // Offline Wallets
      else if (Object.keys(getPmtMethods([5])).includes(payment_channel)) {
        if (!temp[payment_channel]['Amount Paid']) {
          const method_name = getPmtMethodName(payment_channel);
          temp[payment_channel]['Payment Mode'] = method_name.replace('Offline', '');
          temp[payment_channel]['Amount Paid'] = 0;
          pmt_header += pmt_header ? ', ' : '';
          pmt_header += temp[payment_channel]['Payment Mode'];
        }
        temp[payment_channel]['Amount Paid'] += payment['amount'];
        temp[payment_channel]['Amount Paid'] = temp[payment_channel]['Amount Paid'];

        if (
          payment['transaction_id'] &&
          payment['transaction_id'] != null &&
          payment['transaction_id'] != ''
        ) {
          const transaction_id = payment['transaction_id'].trim();
          if (temp[payment_channel]['Transaction ID']) {
            temp[payment_channel]['Transaction ID'] += `, ${transaction_id}`;
          } else {
            temp[payment_channel]['Transaction ID'] = transaction_id;
          }
        }
      }
    }
  } else if (getIsPaid(bill_details) > 2) {
    obj['order']['bill'].push({ name: KeyName.PAYMENT_MODE, value: KeyName.PAID });
  } else {
    obj['order']['bill'].push({ name: KeyName.PAYMENT_MODE, value: KeyName.UNPAID });
  }

  try {
    const pmt_mode_in_body = rest_details['settings']['print']['pmt_mode_in_body'];
    if (pmt_mode_in_body && pmt_mode_in_body > 0) {
      pmt_header = pmt_header.trim();
      obj['body'][KeyName.PAYMENT_TYPE] = pmt_header;
    }
  } catch (e) {}

  const temp_keys = Object.keys(temp);
  temp_keys.sort();
  for (const temp_key of temp_keys) {
    for (const [key, value] of Object.entries(temp[temp_key])) {
      obj['order']['bill'].push({ name: key, value: value });
    }
  }
  const balance = bill_details.balance;

  obj['order']['bill'].push({ name: 'Balance', value: balance });

  obj['footer'] = [];
  try {
    const footer_list = getSettingVal(rest_details, 'footer');
    // rest_details['settings']['print']['footer'];
    if (footer_list && footer_list.length > 0) {
      obj['footer'] = footer_list;
    }
  } catch (e) {}

  if (merge_bill) {
    return obj;
  }
  return convertReceiptObj(obj, rest_details);
}

function mergeReceiptData(temp_obj, obj, rest_details) {
  const show_uname = getSettingVal(rest_details, 'uname');
  const pax_enabled = getSettingVal(rest_details, 'pax');

  if (!['', null, undefined].includes(obj['body'][KeyName.TABLE])) {
    temp_obj['body'][KeyName.TABLE] =
      temp_obj['body'][KeyName.TABLE].toString() + ', ' + obj['body'][KeyName.TABLE].toString();
  }
  temp_obj['body'][KeyName.INVOICE] += ', ' + obj['body'][KeyName.INVOICE];
  temp_obj['body'][KeyName.NO_OF_ITEMS] += ', ' + obj['body'][KeyName.NO_OF_ITEMS];
  temp_obj['body'][KeyName.ORDER_SEQ] += ', ' + obj['body'][KeyName.ORDER_SEQ];

  if (pax_enabled === 1) {
    temp_obj['body'][KeyName.PAX] += ', ' + obj['body'][KeyName.PAX];
  }

  if (show_uname === 1) {
    temp_obj['body'][KeyName.CUSTOMER_NAME] += ', ' + obj['body'][KeyName.CUSTOMER_NAME];
  }

  if (temp_obj['order']['allergic_items']) {
    let temp = [...temp_obj['order']['allergic_items']];
    for (const allergic_item of obj['order']['allergic_items']) {
      let matched = false;
      for (const temp_obj_allergic_item of temp_obj['order']['allergic_items']) {
        if (temp_obj_allergic_item == allergic_item) {
          matched = true;
          break;
        }
      }
      if (matched == false) {
        temp.push(allergic_item);
      }
    }
    temp_obj['order']['allergic_items'] = [...temp];
  }

  temp = [...temp_obj['order']['items']];
  for (const item of obj['order']['items']) {
    let matched = false;
    for (const [key, temp_obj_item] of Object.entries(temp_obj['order']['items'])) {
      if (
        temp_obj_item['name'] == item['name'] &&
        temp_obj_item['price'] == item['price'] &&
        temp_obj_item['variant'] == item['variant']
      ) {
        temp[key]['qty'] += item['qty'];
        temp[key]['unit'] = getUnit(item);
        temp[key]['amount'] += item['amount'];
        temp[key]['amount'] = getRoundOffValue(temp[key]['amount'], 0.05);
        matched = true;
        break;
      }
    }
    if (matched == false) {
      temp.push(item);
    }
  }
  temp_obj['order']['items'] = [...temp];

  temp = [...temp_obj['order']['bill']];
  for (const bill of obj['order']['bill']) {
    let matched = false;
    for (const [key, temp_obj_bill] of Object.entries(temp_obj['order']['bill'])) {
      matched = false;
      if (
        temp_obj_bill['name'].search('discount') !== -1 &&
        bill['name'].search('discount') !== -1
      ) {
        temp[key]['name'] = 'Discount';
        temp[key]['value'] += bill['value'];
        temp[key]['value'] = getRoundOffValue(temp[key]['value'], 0.05);
        matched = true;
        break;
      } else if (
        (temp_obj_bill['name'].search(KeyName.PAYMENT_MODE) !== -1 &&
          bill['name'].search(KeyName.PAYMENT_MODE) !== -1) ||
        (temp_obj_bill['name'].search('transaction id') !== -1 &&
          bill['name'].search('transaction id') !== -1)
      ) {
        temp[key]['value'] += temp[key]['value'] != '' ? ', ' + bill['value'] : bill['value'];
        matched = true;
        break;
      } else if (temp_obj_bill['name'] == bill['name']) {
        temp[key]['value'] += bill['value'];
        temp[key]['value'] = getRoundOffValue(temp[key]['value'], 0.05);
        matched = true;
        break;
      }
    }
    if (matched == false) {
      temp.push(bill);
    }
  }
  temp_obj['order']['bill'] = [...temp];

  return temp_obj;
}

/* generate counter receipt object */
function generateCounterReceipt(
  order_details,
  rest_details,
  subcat_counters = [],
  itr = 1,
  type = 0,
  kitchen_counter_details = {},
  printer_mapping = {},
  counter_id = '',
  note_type = '',
  old_tno = '',
) {
  let receipt_data = [];
  let note_reason = '';
  const temp_item_obj = {};
  const temp_kitchen_data = {};
  const show_sname = getSettingVal(rest_details, 'sname');
  const show_uname = getSettingVal(rest_details, 'uname');
  const pax_enabled = getSettingVal(rest_details, 'pax');

  if (order_details) {
    if (order_details.length == 1) {
      order_details = order_details[0];
    }
    // else if (order_details.length > 1) {}
  } else {
    return [];
  }

  const temp_item_data = {};
  const show_op_order_id = getSettingVal(rest_details, 'show_op_order_id', order_details);
  const format_code = getSettingVal(rest_details, 'format_code', order_details);
  const master_counter_itr_list = getSettingVal(
    rest_details,
    'master_counter_itr_list',
    order_details,
  );
  const custom_counter_note = getSettingVal(rest_details, 'custom_counter_note', order_details);
  const separate_docket = getSettingVal(rest_details, 'separate_docket', order_details);
  const language = getPrintLanguage(rest_details);
  const show_item_name_with_variant = getSettingVal(
    rest_details,
    'show_item_name_with_variant',
    order_details,
  );

  const custom_prints = rest_details['custom_print'];

  const order_type_bit = getOrderTypeBinaryPlace(order_details.order_type);

  const result = getOrderTypeString(order_details, rest_details, language);

  order_details['order_type'] = result.order_type;
  order_details['table_no'] = result.table_no;

  // order_details.sname = staff_name ? staff_name : '';

  // order_details['items'] = unMappedItemMapping(order_details['items']);
  order_details['items'] = getItemsList(
    order_details['items'],
    rest_details,
    kitchen_counter_details,
    subcat_counters,
    kitchen_counter_details,
  );

  for (const original_item of order_details['items']) {
    const item = { ...original_item };
    if (
      (type === 0 && item['itr'] === itr && item['kitchen_counter_id'] === counter_id) ||
      type === 2 ||
      (type === 4 && item['itr'] === itr) ||
      type === 6
    ) {
      // if (
      //   item['itr'] === itr &&
      //   item['kitchen_counter_id'] &&
      //   item['kitchen_counter_id'].includes(kitchen_details['kitchen_counter_id'])
      // ) {
      /* sticker printer handling */
      if (item['sticker_print']) {
        const sticker_printer_objects = separateStickerPrinterObjects(
          item,
          order_details,
          rest_details,
          temp_item_obj,
          temp_item_data,
        );
        sticker_printer_objects.forEach((sticker_obj) => {
          receipt_data.push(sticker_obj);
        });
        continue;
      }
      if (!(item['itr'] + '_' + item['kitchen_counter_id'] in temp_item_obj)) {
        temp_item_obj[item['itr'] + '_' + item['kitchen_counter_id']] = [];
      }

      // if (!(item['itr'] + '_' + item['kitchen_counter_id'] in temp_kitchen_data)) {
      //   temp_kitchen_data[item['itr'] + '_' + item['kitchen_counter_id']] = [];
      // }

      if (!(item['itr'] + '_' + item['kitchen_counter_id'] in temp_item_data)) {
        temp_item_data[item['itr'] + '_' + item['kitchen_counter_id']] = [];
      }
      const item_obj = {};
      /* For case of notmal item, notheing specical is to be done */
      if (!item['is_combo_item']) {
        item_obj['name'] = item['item_name'];
        item_obj['qty'] = item['item_quantity'];
        item_obj['unit'] = getUnit(item);
        item_obj['addon'] = '';
        // item['variation_name']
        //   ? getModifiedVariantName({ ...item }, item['kitchen_counter_id'])
        //   : '';
        item_obj['variant'] = item['new_variation_name']
          ? item['new_variation_name']
          : item['variation_name']
          ? getModifiedVariantName({ ...item }, item['kitchen_counter_id'])
          : '';
        item_obj['note'] = item['special_note'] ? item['special_note'] : '';
        item_obj['item_id'] = item['item_id'];
      } else {
        const is_copy = item['is_copy'] ? 1 : 0;
        // comboPrinting1(item_obj, item, kitchen_details['kitchen_counter_id']);
        comboPrinting(
          temp_item_obj,
          temp_item_data,
          item_obj,
          item,
          printer_mapping,
          order_details,
          rest_details,
          receipt_data,
          is_copy,
        );
      }

      item['addons'] = getAddons(item);
      if (!item['is_copy']) {
        for (const addon of item['addons']) {
          if (addon['printer'] && addon['printer'].trim() != '') {
            const printer = addon['printer'].trim();
            if (!(item['itr'] + '_' + printer in temp_item_obj)) {
              temp_item_obj[item['itr'] + '_' + printer] = [];
            }
            if (!(item['itr'] + '_' + printer in temp_item_data)) {
              temp_item_data[item['itr'] + '_' + printer] = [];
            }
            temp_item_obj[item['itr'] + '_' + printer].push({
              name: addon['name'],
              qty: item['item_quantity'] * addon['qty'],
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
          } else {
            item_obj['addon'] +=
              item_obj['addon'] === ''
                ? `${addon['qty']}x ${addon['name']}`
                : `, ${addon['qty']}x ${addon['name']}`;
          }
        }
      }

      if (item['is_copy']) {
        for (const addon of item['addons']) {
          if (
            !(addon['printer'] && addon['printer'].trim()) ||
            (addon['printer'] && addon['printer'].trim()) === item['printer_name']
          ) {
            item_obj['addon'] +=
              item_obj['addon'] === ''
                ? `${addon['qty']}x ${addon['name']}`
                : `, ${addon['qty']}x ${addon['name']}`;
          }
        }
      }

      temp_item_obj[item['itr'] + '_' + item['kitchen_counter_id']].push(item_obj);

      /* I need to insert addon name which do not have a printer assigned or have same printer as item printer
          for the case of copied item object */

      // for (const addon of item['addons']) {
      //   if (
      //     !(addon['printer'] && addon['printer'].trim()) ||
      //     (addon['printer'] && addon['printer'].trim()) === kitchen_details['printer_name']
      //   ) {
      //     item_obj['addon'] +=
      //       item_obj['addon'] === ''
      //         ? `${addon['name']} x(${addon['qty']})`
      //         : `, ${addon['name']} x(${addon['qty']})`;
      //   }
      // }

      // temp_item_obj[item['itr'] + '_' + item['kitchen_counter_id']].push(item_obj);

      separateVariantByCounter(
        item,
        temp_item_obj,
        temp_item_data,
        printer_mapping,
        show_item_name_with_variant,
      );
      const ptr_ip = item['printer_name'] != '' ? item['printer_name'] : 'Default Printer';
      const ptr_id = item['ptr_id'] ? item['ptr_id'] : ptr_ip;
      if (
        temp_item_data[item['itr'] + '_' + item['kitchen_counter_id']] &&
        temp_item_data[item['itr'] + '_' + item['kitchen_counter_id']].length === 0
      ) {
        temp_item_data[item['itr'] + '_' + item['kitchen_counter_id']].push({
          kitchen_counter_id: item['kitchen_counter_id'],
          counterName: item['counter_name'] ? item['counter_name'] : 'Default Counter',
          printerName: ptr_ip,
          ptr_id: ptr_id,
        });
      }

      // if (temp_kitchen_data[item['itr'] + '_' + item['kitchen_counter_id']].length === 0) {
      //   temp_kitchen_data[item['itr'] + '_' + item['kitchen_counter_id']].push({
      //     kitchen_counter_id: item['kitchen_counter_id'],
      //     counterName: kitchen_details['counter_name']
      //       ? kitchen_details['counter_name']
      //       : 'Default Counter',
      //     printerName: kitchen_details['printer_name']
      //       ? kitchen_details['printer_name']
      //       : 'Default Printer',
      //   });
      // }
    }
  }
  let obj = {};
  for (const key of Object.keys(temp_item_obj)) {
    const obj = {};
    obj['type'] = 'counter';
    obj[KeyName.COUNTER_NAME] = temp_item_data[key][0]['counterName'];
    obj['printerName'] = temp_item_data[key][0]['printerName'];
    obj[KeyName.ORDER_SEQ] = order_details['kiosk_order_seq']
      ? order_details['kiosk_order_seq']
      : order_details['order_seq'];
    obj['ptr_id'] = temp_item_data[key][0]['ptr_id']
      ? temp_item_data[key][0]['ptr_id']
      : obj['printerName'];
    obj['order_seq'] = order_details['order_seq'];
    obj['note'] = [];
    if (note_type != '') {
      obj['note'].push('Type: ' + note_type);
    }
    if (note_reason != '') {
      obj['note'].push('Reason: ' + note_reason);
    }
    if (old_tno != '') {
      obj['note'].push('Old Table No: ' + old_tno);
    }
    if (temp_item_data[key][0]['kitchen_counter_id'] === 'default') {
      obj['note'].push(localize(KeyName.UNMAPPED_ITEM_TEXT, language));
    } else if (temp_item_data[key][0]['kitchen_counter_id'] === 'default_override') {
      obj['note'].push(localize(KeyName.INVALID_COUNTER_TEXT, language));
    }
    for (const note of order_details['special_notes']) {
      if (note['note'].trim() && note['itr'] == key.split('_')[0]) {
        obj['note'].push(note['note'].trim());
      }
    }

    obj['body'] = {};
    obj[KeyName.ORDERTYPE] = order_details['order_type'];

    /*Exclude takeaway,pickup and null table_no or table_id from counter details*/
    if (
      !['', null, undefined].includes(order_details['table_no']) &&
      !['takeaway', 'pickup'].includes(order_details['table_id'])
    ) {
      obj['body'][KeyName.TABLE] = order_details['table_no'].toString();
    }
    if (old_tno != '') {
      obj['body'][KeyName.OLD_TABLE] = old_tno;
    }
    obj['body'][KeyName.INVOICE] = `#${order_details['order_no']}`;
    const get_date_time = addDateTime(order_details, rest_details);
    obj['body'][KeyName.DATE] = get_date_time['date'];
    obj['body'][KeyName.TIME] = get_date_time['time'];
    obj['body'][KeyName.DATETIME] = get_date_time['datetime'];

    if ((show_op_order_id & 2) == 2) {
      obj['body'][KeyName.INVOICE] = getModifiedOrderNo(order_details);
    }
    obj['body'][KeyName.PAX] = order_details['pax'] ? order_details['pax'].toString() : '';
    obj['body'][KeyName.STAFF_NAME] = order_details['sname'];
    obj['body'][KeyName.CUSTOMER_NAME] = order_details['name'] ? order_details['name'] : '';
    obj['body'][KeyName.CUSTOMER_PHONE] =
      order_details['phone'] && order_details['phone'].length < 14 ? order_details['phone'] : '';
    obj['allergic_items'] = order_details['allergic_items'];
    obj['note'] = appendCounterFooter(obj['note'], rest_details);
    obj['items'] = temp_item_obj[key];

    let noOfItems = 0;
    for (const item of obj['items']) {
      noOfItems += item['qty'];
    }
    obj['body'][KeyName.NO_OF_ITEMS] = noOfItems.toString();
    receipt_data.push(obj);
  }

  const master_counter_arr = [];
  if ((format_code || separate_docket) && master_counter_itr_list) {
    receipt_data.forEach((counter) => {
      const cloned_counter_obj = cloneDeep(counter);
      cloned_counter_obj['counter_name'] = 'MASTER COUNTER LIST';
      if (custom_counter_note && itr > 1) {
        cloned_counter_obj['note'].push(custom_counter_note);
      } else if (itr > 1) {
        const text = localize(KeyName.MASTER_COUNTER_TEXT, language);
        cloned_counter_obj['note'].push(text);
      }
      master_counter_arr.push(cloned_counter_obj);
    });
  }

  /* Printing item based coupons */
  try {
    if (custom_prints) {
      const custom_print_obj = {};
      custom_prints.forEach((itm) => {
        custom_print_obj[itm.item_id] = itm.count;
      });
      for (let i = receipt_data.length - 1; i >= 0; i--) {
        const counter_obj = receipt_data[i];
        for (
          let item_obj_idx = counter_obj['items'].length - 1;
          item_obj_idx >= 0;
          item_obj_idx--
        ) {
          const item_obj = counter_obj['items'][item_obj_idx];
          if (custom_print_obj[item_obj['item_id']]) {
            const deep_copy = cloneDeep(counter_obj);
            deep_copy['items'] = [cloneDeep(item_obj)];
            deep_copy['items'][0]['qty'] = '1';
            deep_copy['body']['no_of_items'] = '1';
            for (
              let step = 0;
              step < +custom_print_obj[item_obj['item_id']] * item_obj['qty'];
              step++
            ) {
              receipt_data.push(deep_copy);
            }
            counter_obj['items'].splice(item_obj_idx, 1);
            counter_obj['body']['no_of_items'] = (
              Number(counter_obj['body']['no_of_items']) - 1
            ).toString();
          }
        }
      }
    }
    for (let idx = receipt_data.length - 1; idx >= 0; idx--) {
      if (receipt_data[idx]['items'].length === 0) {
        receipt_data.splice(idx, 1);
      }
    }
    // return receipt_data;
  } catch (e) {
    return [];
  }

  // receipt_data = formatCounterObj(receipt_data, type, rest_details);

  /* Finally pushing every receipt of master counter list in receipt data array */
  if (master_counter_arr.length > 0) {
    master_counter_arr.forEach((item) => {
      receipt_data.push(item);
    });
  }

  receipt_data = receipt_data.filter(
    (elem, index, self) => index === self.findIndex((t) => t.ptr_id === elem.ptr_id),
  );

  let final_receipt_data = [];
  const configurable_settings = getSettingVal(rest_details, 'configurable_settings');
  if (Object.keys(receipt_data).length > 0) {
    for (const obj of receipt_data) {
      // this.convertReceiptFormatService.convertFormat(
      //   obj,
      //   response_format,
      //   FormatType.COUNTER,
      //   rest_details,
      //   order_type_bit,
      //   language,
      // );
      switch (type) {
        case 6:
          final_receipt_data.push(convertTableTransferObj(obj, rest_details));
          break;
        default:
          final_receipt_data.push(
            convertCounterObj(
              obj,
              rest_details,
              order_type_bit,
              configurable_settings[FormatType.COUNTER],
            ),
          );
          break;
      }
    }
    return final_receipt_data;
  } else {
    return null;
  }
}

/* generate master order list */
function generateMasterOrderReceipt(
  order_details,
  rest_details,
  new_itr,
  note_type,
  is_order_list = false,
  note_reason = '',
  old_tno = '',
) {
  const language = getPrintLanguage(rest_details);
  const result = getOrderTypeString(order_details, rest_details, language);
  order_details['order_type'] = result.order_type;
  order_details['table_no'] = result.table_no;

  const show_sname = getSettingVal(rest_details, 'sname');
  const show_uname = getSettingVal(rest_details, 'uname');
  const show_item_code = getSettingVal(rest_details, 'item_code');
  const pax_enabled = getSettingVal(rest_details, 'pax');
  const show_op_order_id = getSettingVal(rest_details, 'show_op_order_id', order_details);
  const master_docket_printer = getSettingVal(rest_details, 'master_docket_printer');

  const obj = { type: 'counter' };
  obj['counterName'] = localize(KeyName.MASTER_DOCKET, language);
  obj['printerName'] = master_docket_printer
    ? master_docket_printer
    : rest_details.printer
    ? rest_details.printer
    : 'Cashier';
  obj['ptr_id'] = 'master';
  obj['note'] = [];
  if (is_order_list) {
    obj['counterName'] = localize(KeyName.MASTER_ORDER_LIST, language);
  }
  if (note_type != '') {
    obj['note'].push('Type: ' + note_type);
  }
  if (note_reason != '') {
    obj['note'].push('Reason: ' + note_reason);
  }
  if (old_tno != '') {
    obj['note'].push('Old Table No: ' + old_tno);
  }
  obj['note'] = appendCounterFooter(obj['note'], rest_details);
  obj['body'] = {};
  obj['body'][KeyName.ORDERTYPE] = order_details['order_type'];
  if (!['', null, undefined].includes(order_details['table_no'])) {
    obj['body'][KeyName.TABLE] = order_details['table_no'].toString();
  }
  if (old_tno != '') {
    obj['body'][KeyName.OLD_TABLE] = old_tno;
  }
  obj['body'][KeyName.INVOICE] = `#${order_details['order_no']}`;
  obj['body'][KeyName.ORDER_SEQ] = order_details['order_seq'];

  if ((show_op_order_id & 4) == 4) {
    obj['body'][KeyName.INVOICE] = getModifiedOrderNo(order_details);
  }
  if (pax_enabled == 1) {
    obj['body'][KeyName.PAX] = order_details.pax ? order_details.pax.toString() : '';
  }
  if (show_sname == 1) {
    //obj['body']['name'] = order_details['sname']; // for backward compatibility
    obj['body'][KeyName.STAFF_NAME] = order_details.sname;
  }
  if (show_uname == 1) {
    obj['body'][KeyName.CUSTOMER_NAME] = order_details.name ? order_details.name : '';
  }

  const get_date_time = addDateTime(order_details, rest_details);
  obj['body'][KeyName.DATE] = get_date_time['date'];
  obj['body'][KeyName.TIME] = get_date_time['time'];

  obj['allergic_items'] = order_details.allergic_items;
  obj['items'] = [];
  for (const original_item of order_details['items']) {
    const item = { ...original_item };
    if ((show_item_code & 16) == 16 && item['item_code'] && item['item_code'].trim() !== '') {
      item['item_name'] = `(${item['item_code']}) ${item['item_name']}`;
    }
    let temp_item = null;
    if (is_order_list) {
      if (item.item_status != 5 && item.item_status != 6) {
        if (new_itr) {
          if (item['itr'] <= new_itr) {
            temp_item = { ...item };
          }
        } else {
          temp_item = { ...item };
        }
      }
    } else {
      temp_item = { ...item };
    }
    if (temp_item) {
      if (new_itr && new_itr > 1 && item.itr == new_itr) {
        item['item_name'] = item['item_name'] + ' (NEW)';
      }
      const item_obj = {
        name: item.item_name,
        qty: item.item_quantity,
        unit: getUnit(item),
        price: item.item_price,
        addon: item.addons_name ? item.addons_name : '',
        variant: item.variation_name ? item.variation_name : '',
        note: item.special_note ? item.special_note : '',
      };
      if (item['is_combo_item']) {
        item_obj['combo_name'] = '';
        for (const combo_item of item['combo_items']) {
          item_obj['combo_name'] +=
            item_obj['combo_name'] === ''
              ? `(${combo_item['quantity']}) ${combo_item['item_name']}`
              : `, (${combo_item['quantity']}) ${combo_item['item_name']}`;
        }
      }
      obj['items'].push(item_obj);
    }
  }
  let noOfItems = 0;
  for (const item of obj['items']) {
    noOfItems += item['qty'];
  }

  obj['body'][KeyName.NO_OF_ITEMS] = noOfItems.toString();
  return convertMasterObj(obj, rest_details);
}

function generateVoidAndCancelCounterReceipt(
  order_details,
  type,
  rest_details,
  itr = null,
  oid = '',
  qty = 1,
  subcat_counters = {},
  kitchen_counter_details = {},
) {
  let receipt_data = [];
  let decline_type = '';
  let decline_reason = '';
  let item_count = 0;
  const temp_item_obj = {};
  const temp_item_data = {};
  let items_list = [];
  const restaurant_id = order_details['restaurant_id'];
  const show_sname = getSettingVal(rest_details, 'sname');
  const show_uname = getSettingVal(rest_details, 'uname');
  const pax_enabled = getSettingVal(rest_details, 'pax');
  const show_op_order_id = getSettingVal(rest_details, 'show_op_order_id', order_details);
  const language = getPrintLanguage(rest_details);

  if (type == 3) {
    decline_type = localize(KeyName.VOID_ITEM, language);
    items_list = [...order_details['void_items']];
  } else if (type == 5) {
    decline_type = localize(KeyName.CANCEL_ITEM, language);
    items_list = [...order_details['items']];
  }

  /* Creating mapping of kc_id with its printer_name and counter_name*/
  const printer_mapping = {};
  order_details['order_type'] = getOrderTypeText(order_details['order_type']);

  // const printer_mapping = await this.getPrinterName([...items_list], restaurant_id);

  /* As a single item can be mapped to multiple counters, below function create new copies of item and map it to
  its respective counter. Ex-If one item has kc_id = KC104, KC105 then it creates two object of same item
  and each such object has a single kc_id. */
  // items_list = getItemsList(items_list, rest_details);
  items_list = getItemsList(items_list, rest_details, {}, subcat_counters, kitchen_counter_details);

  for (const item of items_list) {
    if (
      (type == 3 && item['order_item_id'] == oid) ||
      (type == 5 && item['itr'] == itr && (item['item_status'] == 5 || item['item_status'] == 6))
    ) {
      if (!(item['itr'] + '_' + item['kitchen_counter_id'] in temp_item_obj)) {
        temp_item_obj[item['itr'] + '_' + item['kitchen_counter_id']] = [];
      }
      if (!(item['itr'] + '_' + item['kitchen_counter_id'] in temp_item_data)) {
        temp_item_data[item['itr'] + '_' + item['kitchen_counter_id']] = [];
      }

      let total_qty = 0;
      if (type == 3) {
        total_qty = qty <= item['item_quantity'] ? qty : item['item_quantity'];
      } else {
        total_qty = item['item_quantity'];
      }

      const item_obj = {};
      if (!item['is_combo_item']) {
        item_obj['name'] = item['item_name'];
        item_obj['qty'] = item['item_quantity'];
        item_obj['unit'] = getUnit(item);
        item_obj['addon'] = '';
        item_obj['variant'] = item['variation_name']
          ? getModifiedVariantName({ ...item }, item['kitchen_counter_id'])
          : '';
        item_obj['note'] = item['special_note'] ? item['special_note'] : '';
        item_obj['strike'] = 1;
      } else {
        const is_copy = item['is_copy'] ? 1 : 0;
        comboPrinting(
          temp_item_obj,
          temp_item_data,
          item_obj,
          item,
          printer_mapping,
          order_details,
          rest_details,
          receipt_data,
          is_copy,
          1,
        );
      }

      /* Create new counter obj for addons if it has printer name present */
      item['addons'] = getAddons(item);
      /*If it is copied item object then do not go inside this loop as it will also create multiple copies
       of addons */
      if (!item['is_copy']) {
        for (const addon of item['addons']) {
          if (addon['printer'] && addon['printer'].trim() != '') {
            const printer = addon['printer'].trim();

            if (!(item['itr'] + '_' + printer in temp_item_obj)) {
              temp_item_obj[item['itr'] + '_' + printer] = [];
            }
            if (!(item['itr'] + '_' + printer in temp_item_data)) {
              temp_item_data[item['itr'] + '_' + printer] = [];
            }
            temp_item_obj[item['itr'] + '_' + printer].push({
              name: addon['name'],
              qty: total_qty * Number(addon['qty']),
              addon: '',
              variant: '',
              note: '',
            });
            if (temp_item_data[item['itr'] + '_' + printer].length == 0) {
              temp_item_data[item['itr'] + '_' + printer].push({
                counterName: printer,
                printerName: printer,
              });
            }
          } else {
            item_obj['addon'] +=
              item_obj['addon'] === ''
                ? `${addon['name']} x(${addon['qty']})`
                : `, ${addon['name']} x(${addon['qty']})`;
          }
        }
      }

      /* I need to insert addon name which do not have a printer assigned or have same printer as item printer
        for the case of copied item object */
      if (item['is_copy']) {
        for (const addon of item['addons']) {
          if (
            !(addon['printer'] && addon['printer'].trim()) ||
            (addon['printer'] && addon['printer'].trim()) === item['printer_name']
          ) {
            item_obj['addon'] +=
              item_obj['addon'] === ''
                ? `${addon['name']} x(${addon['qty']})`
                : `, ${addon['name']} x(${addon['qty']})`;
          }
        }
      }

      temp_item_obj[item['itr'] + '_' + item['kitchen_counter_id']].push(item_obj);

      /* USING PASS BY REFERENCE,As a single item can be mapped to different counters and same goes to every
         variant present in a single item. */
      separateVariantByCounter(item, temp_item_obj, temp_item_data, printer_mapping);
      const ptr_ip = item['printer_name'] != '' ? item['printer_name'] : 'Default Printer';
      const ptr_id = item['ptr_id'] ? item['ptr_id'] : ptr_ip;

      if (temp_item_data[item['itr'] + '_' + item['kitchen_counter_id']].length == 0) {
        temp_item_data[item['itr'] + '_' + item['kitchen_counter_id']].push({
          kitchen_counter_id: item['kitchen_counter_id'],
          counterName: item['counter_name'] != '' ? item['counter_name'] : 'Default Counter',
          printerName: item['printer_name'] != '' ? item['printer_name'] : 'Default Printer',
          ptr_id: ptr_id,
        });
      }

      if (
        (type == 3 || type == 5) &&
        item['decline_reason'] &&
        Object.keys(item['decline_reason']).length > 0
      ) {
        decline_reason = item['decline_reason']['decline_reason'];
      }
      item_count = item_count + 1;
    }
  }

  for (const key of Object.keys(temp_item_obj)) {
    const obj = {};
    obj['type'] = 'counter';
    obj['counterName'] = temp_item_data[key][0]['counterName'];
    obj['printerName'] = temp_item_data[key][0]['printerName'];
    obj['ptr_id'] = temp_item_data[key][0]['ptr_id']
      ? temp_item_data[key][0]['ptr_id']
      : obj['printerName'];

    obj['note'] = [decline_type];
    if (decline_reason.trim() != '') {
      const fixed_decline_texts = {
        'dish out of stock': KeyName.DISH_OUT_OF_STOCK_TEXT,
        'variant out of stock': KeyName.VARIANT_OUT_OF_STOCK_TEXT,
        'add on out of stock': KeyName.ADDON_OUT_OF_STOCK_TEXT,
      };
      if (decline_reason && fixed_decline_texts[decline_reason.toLocaleLowerCase()]) {
        obj['note'].push(
          `${KeyName.REASON}: ${localize(
            fixed_decline_texts[decline_reason.toLocaleLowerCase()],
            language,
          )}`,
        );
      } else {
        obj['note'].push(`${KeyName.REASON}: ${decline_reason}`);
      }
    }
    const str =
      type == 3
        ? localize(KeyName.COUNTER_CANCEL_TEXT, language)
        : localize(KeyName.COUNTER_DECLINE_TEXT, language);
    if (item_count == 1) {
      obj['note'].push(str);
    } else if (item_count > 1) {
      obj['note'].push(str);
    }
    obj['note'] = appendCounterFooter(obj['note'], rest_details);
    obj['allergic_items'] = order_details['allergic_items'];
    obj['body'] = {};
    obj['body'][KeyName.ORDERTYPE] = order_details['order_type'];
    if (!['', null, undefined].includes(order_details['table_no'])) {
      obj['body'][KeyName.TABLE] = order_details['table_no'].toString();
    }
    obj['body'][KeyName.INVOICE] = `#${order_details['order_no']}`;
    obj['body'][KeyName.ORDER_SEQ] = order_details['order_seq'];

    const get_date_time = addDateTime(order_details, rest_details);
    obj['body'][KeyName.DATE] = get_date_time['date'];
    obj['body'][KeyName.TIME] = get_date_time['time'];
    if ((show_op_order_id & 2) == 2) {
      obj['body'][KeyName.INVOICE] = getModifiedOrderNo(order_details);
    }
    if (pax_enabled == 1) {
      obj['body'][KeyName.PAX] = order_details['pax'] ? order_details['pax'].toString() : '';
    }
    if (show_sname == 1) {
      obj['body'][KeyName.STAFF_NAME] = order_details['sname'];
    }
    if (show_uname == 1) {
      obj['body'][KeyName.CUSTOMER_NAME] = order_details['name'] ? order_details['name'] : '';
    }
    obj['items'] = temp_item_obj[key];
    let noOfVoidedItems = 0;

    for (const item of obj['items']) {
      noOfVoidedItems += item['qty'];
    }

    obj['body'][KeyName.NO_OF_ITEMS_VOIDED] = noOfVoidedItems.toString();
    receipt_data.push(obj);
  }

  receipt_data = formatCounterObj(receipt_data, type, rest_details);

  let final_receipt_data = [];

  for (let obj of receipt_data) {
    final_receipt_data.push(convertVoidAndCancelCounterObj(obj, {}, rest_details));
  }
  return final_receipt_data;
}

function generateVoidMasterReceipt(order_details, rest_details, voided_item) {
  const show_sname = getSettingVal(rest_details, 'sname');
  const show_uname = getSettingVal(rest_details, 'uname');
  const show_item_code = getSettingVal(rest_details, 'item_code');
  const pax_enabled = getSettingVal(rest_details, 'pax');
  const show_op_order_id = getSettingVal(rest_details, 'show_op_order_id', order_details);
  const master_docket_printer = getSettingVal(rest_details, 'master_docket_printer');
  const language = getPrintLanguage(rest_details);

  const obj = { type: 'counter' };
  obj['counterName'] = localize(KeyName.MASTER_DOCKET, language);
  obj['printerName'] = master_docket_printer
    ? master_docket_printer
    : rest_details.printer
    ? rest_details.printer
    : 'Cashier';
  obj['ptr_id'] = 'master';
  obj['note'] = [localize(KeyName.ITEM_VOIDED, language)];
  obj['body'] = {};
  obj['body'][KeyName.ORDER_SEQ] = order_details['order_type'];
  if (!['', null, undefined].includes(order_details['table_no'])) {
    obj['body'][KeyName.TABLE] = order_details['table_no'].toString();
  }
  obj['body'][KeyName.INVOICE] = `#${order_details['order_no']}`;
  obj['body'][KeyName.ORDER_SEQ] = order_details['order_seq'];

  const get_date_time = addDateTime(order_details, rest_details);
  obj['body']['Date'] = get_date_time['datetime'];
  if ((show_op_order_id & 8) == 8) {
    obj['body'][KeyName.INVOICE] = getModifiedOrderNo(order_details);
  }
  if (pax_enabled == 1) {
    obj['body'][KeyName.PAX] = order_details['pax'] ? order_details['pax'].toString() : '';
  }
  if (show_sname == 1) {
    //obj['body']['name'] = order_details['sname']; // for backward compatibility
    obj['body'][KeyName.STAFF_NAME] = order_details['sname'];
  }
  if (show_uname == 1) {
    obj['body'][KeyName.CUSTOMER_NAME] = order_details['name'] ? order_details['name'] : '';
  }
  obj['allergic_items'] = order_details['allergic_items'];

  obj['items'] = [];
  if (
    (show_item_code & 16) == 16 &&
    voided_item['item_code'] &&
    voided_item['item_code'].trim() !== ''
  ) {
    voided_item['item_name'] = '(' + voided_item['item_code'] + ') ' + voided_item['item_name'];
  }
  const item_obj = {
    name: voided_item['item_name'],
    qty: voided_item['item_quantity'],
    unit: getUnit(voided_item),
    price: voided_item['item_price'],
    addon: voided_item['addons_name'] ? voided_item['addons_name'] : '',
    variant: voided_item['variation_name'] ? voided_item['variation_name'] : '',
    note: voided_item['special_note'] ? voided_item['special_note'] : '',
    strike: 1,
  };
  if (voided_item['is_combo_item']) {
    item_obj['combo_name'] = '';
    for (const combo_item of voided_item['combo_items']) {
      item_obj['combo_name'] +=
        item_obj['combo_name'] === ''
          ? `(${combo_item['quantity']}) ${combo_item['item_name']}`
          : `, (${combo_item['quantity']}) ${combo_item['item_name']}`;
    }
  }

  obj['items'].push(item_obj);

  const decline_reason = voided_item['decline_reason']['decline_reason'];
  if (decline_reason && decline_reason != '') {
    const fixed_decline_texts = {
      'dish out of stock': KeyName.DISH_OUT_OF_STOCK_TEXT,
      'variant out of stock': KeyName.VARIANT_OUT_OF_STOCK_TEXT,
      'add on out of stock': KeyName.ADDON_OUT_OF_STOCK_TEXT,
    };
    if (decline_reason && fixed_decline_texts[decline_reason.toLocaleLowerCase()]) {
      obj['note'].push(
        `${KeyName.REASON}: ${localize(
          fixed_decline_texts[decline_reason.toLocaleLowerCase()],
          language,
        )}`,
      );
    } else {
      obj['note'].push(`${KeyName.REASON}: ${decline_reason}`);
    }
  }
  obj['note'].push(localize(KeyName.CANCELED_ITEMS_TEXT, language));
  obj['note'] = appendCounterFooter(obj['note'], rest_details);

  return convertVoidMasterObj(obj, {}, rest_details);
}

function generateDeclineMasterReceipt(order_details, rest_details, itr) {
  const show_sname = getSettingVal(rest_details, 'sname');
  const show_uname = getSettingVal(rest_details, 'uname');
  const show_item_code = getSettingVal(rest_details, 'item_code');
  const pax_enabled = getSettingVal(rest_details, 'pax');
  const show_op_order_id = getSettingVal(rest_details, 'show_op_order_id', order_details);
  const master_docket_printer = getSettingVal(rest_details, 'master_docket_printer');
  const language = getPrintLanguage(rest_details);

  let obj = { type: 'counter' };
  obj['counterName'] = localize(KeyName.MASTER_DOCKET, language);
  obj['printerName'] = master_docket_printer
    ? master_docket_printer
    : rest_details.printer
    ? rest_details.printer
    : 'Cashier';
  obj['ptr_id'] = 'master';
  obj['note'] = [localize(KeyName.DECLINED_ORDER, language)];
  obj['body'] = {};
  obj['body'][KeyName.ORDERTYPE] = order_details['order_type'];
  if (!['', null, undefined].includes(order_details['table_no'])) {
    obj['body'][KeyName.TABLE] = order_details['table_no'].toString();
  }
  obj['body'][KeyName.INVOICE] = `#${order_details['order_no']}`;
  obj['body'][KeyName.ORDER_SEQ] = order_details['order_seq'];

  const get_date_time = addDateTime(order_details, rest_details);
  obj['body'][KeyName.DATETIME] = get_date_time['datetime'];

  if ((show_op_order_id & 8) == 8) {
    obj['body'][KeyName.INVOICE] = getModifiedOrderNo(order_details);
  }

  if (pax_enabled == 1) {
    obj['body'][KeyName.PAX] = order_details['pax'] ? order_details['pax'].toString() : '';
  }

  if (show_sname == 1) {
    // obj['body']['name'] = order_details['sname']; // for backward compatibility
    obj['body'][KeyName.STAFF_NAME] = order_details['sname'];
  }

  if (show_uname == 1) {
    obj['body'][KeyName.CUSTOMER_NAME] = order_details['name'] ? order_details['name'] : '';
  }

  obj['allergic_items'] = order_details['allergic_items'];

  obj['items'] = [];
  let decline_reason = '';
  let decline_count = 0;
  let unavailable_item_count = 0;

  for (const original_item of order_details['items']) {
    const item = { ...original_item };
    if (item['itr'] == itr && (item['item_status'] == 5 || item['item_status'] == 6)) {
      if ((show_item_code & 16) == 16 && item['item_code'] && item['item_code'].trim() !== '') {
        item['item_name'] = '(' + item['item_code'] + ') ' + item['item_name'];
      }
      const item_obj = {
        name: item['item_name'],
        qty: item['item_quantity'],
        unit: getUnit(item),
        price: item['item_price'],
        addon: item['addons_name'] ? item['addons_name'] : '',
        variant: item['variation_name'] ? item['variation_name'] : '',
        note: item['special_note'] ? item['special_note'] : '',
        strike: 1,
      };

      if (item['is_combo_item']) {
        item_obj['combo_name'] = '';
        for (const combo_item of item['combo_items']) {
          item_obj['combo_name'] +=
            item_obj['combo_name'] === ''
              ? `(${combo_item['quantity']}) ${combo_item['item_name']}`
              : `, (${combo_item['quantity']}) ${combo_item['item_name']}`;
        }
      }
      obj['items'].push(item_obj);

      if (item['decline_reason']['decline_item_code'] == 1) {
        unavailable_item_count += 1;
      } else {
        decline_reason = item['decline_reason']['decline_reason'];
      }
      decline_count += 1;
    }
  }
  if (unavailable_item_count > 0) {
    if (unavailable_item_count == decline_count) {
      if (decline_count == 1) {
        decline_reason = localize(KeyName.ITEM_NOT_AVAILABLE_TEXT, language);
      } else {
        decline_reason = localize(KeyName.ITEMS_NOT_AVAILABLE_TEXT, language);
      }
    } else {
      decline_reason = localize(KeyName.SOME_ITEMS_NOT_AVAILABLE_TEXT, language);
    }
  }
  let note = '';
  if (itr == 1) {
    note = localize(KeyName.ORDER_DECLINED_TEXT, language);
  } else {
    note = localize(KeyName.ITEMS_DECLINED_TEXT, language);
  }
  obj['note'].push(`${localize(KeyName.REASON, language)}: ` + decline_reason);
  obj['note'].push(note);
  obj['note'] = appendCounterFooter(obj['note'], rest_details);

  if (decline_count == 0) {
    obj = {};
  }

  return convertDeclineMasterObj(obj, {}, rest_details);
}

/* View Cashier Report by Date*/
function viewCashierReport(rest_details, cashier_report_data, country_code, language) {
  language = language || CountryMapping.MALAYSIA.language;
  country_code = country_code || CountryMapping.MALAYSIA.country_code;
  const country = getCountryDetails('country_code', country_code).country;

  //Check restaurant exists or not.
  const restaurant = rest_details;
  if (!restaurant) {
    throw new Error(localize('restaurantNotFoundError', language));
  }

  const timezone = restaurant['time_zone'] ? restaurant['time_zone'] : 'Asia/Kuala_Lumpur';
  const printer_name =
    restaurant.cash_mgt_printer !== undefined &&
    restaurant.cash_mgt_printer !== null &&
    restaurant.cash_mgt_printer.trim() !== ''
      ? restaurant.cash_mgt_printer
      : restaurant.printer;

  // const resp = await this.cashMgtRepository.findCashReport({
  //   restaurant_id: restaurant_id,
  //   open_cashier_epoch: start_epoch,
  //   close_cashier_epoch: end_epoch,
  // });

  const resp = cashier_report_data;

  const {
    date,
    open_cashier_date_time,
    close_cashier_date_time,
    close_cashier_epoch,
    opening_cash_float,
    total_cash_in,
    cash_in_sales,
    cash_in_others,
    total_cash_out,
    net_cash_balance,
    expected_cash_in_drawer,
    actual_cash_in_drawer,
    excess_short_cash,
    cash_count_enabled,
    denominations,
    staff_name,
    close_cashier,
  } = resp[0];

  return {
    date: date,
    time: moment.unix(close_cashier_epoch).tz(timezone).format('hh:mm A'),
    open_cashier_date_time: open_cashier_date_time,
    close_cashier_date_time: close_cashier_date_time,
    opening_cash_float: getInternationalizedNumber(Number(opening_cash_float).toFixed(2), country),
    total_cash_in: getInternationalizedNumber(Number(total_cash_in).toFixed(2), country),
    cash_in_sales: getInternationalizedNumber(Number(cash_in_sales).toFixed(2), country),
    cash_in_others: getInternationalizedNumber(Number(cash_in_others).toFixed(2), country),
    total_cash_out: getInternationalizedNumber(Number(total_cash_out).toFixed(2), country),
    net_cash_balance: getInternationalizedNumber(Number(net_cash_balance).toFixed(2), country),
    expected_cash_in_drawer: getInternationalizedNumber(
      Number(expected_cash_in_drawer).toFixed(2),
      country,
    ),
    actual_cash_in_drawer: getInternationalizedNumber(
      Number(actual_cash_in_drawer).toFixed(2),
      country,
    ),
    excess_short_cash: getInternationalizedNumber(Number(excess_short_cash).toFixed(2), country),
    cash_count_enabled: cash_count_enabled || 0,
    denominations_arr: denominations || [],
    staff_name: staff_name,
    close_cashier: close_cashier,
    printerName: printer_name,
  };
}

function cashierReport(
  rest_details,
  open_cashier_data = [],
  close_cashier_data = [],
  order_details_aggregate = [],
  order_billings = [],
  cash_mgt_data = [],
  cash_mgt_entries_data = [],
  user = {},
  country_code,
  language,
) {
  language = language || CountryMapping.MALAYSIA.language;
  country_code = country_code || CountryMapping.MALAYSIA.country_code;
  //Get user name who authenticated close cashier
  const country = getCountryDetails('country_code', country_code).country;
  let close_cashier_user = 'Staff';
  if (Object.keys(user).length > 0) {
    close_cashier_user = user['user_name'];
  }

  //Check restaurant exists or not.
  const project = { _id: 0, id: 1, time_zone: 1, printer: 1, cash_mgt_printer: 1, country: 1 };
  const restaurant = rest_details;
  if (!restaurant) {
    throw new Error(localize('restaurantNotFoundError', language));
  }
  const timezone = restaurant['time_zone'] ? restaurant['time_zone'] : 'Asia/Kuala_Lumpur';
  const printer_name =
    restaurant['cash_mgt_printer'] !== undefined &&
    restaurant['cash_mgt_printer'] !== null &&
    restaurant['cash_mgt_printer'].trim() !== ''
      ? restaurant['cash_mgt_printer']
      : restaurant['printer'];

  //check if cash management system exists or not.
  const pipeline1 = [
    { $match: { restaurant_id: rest_details['id'] } },
    { $project: { _id: 0, cash_in_drawer: 1, active_epoch: 1 } },
  ];
  // const cash_mgt_system = cashMgtAggregation(pipeline1, false, true);
  const cash_mgt_system = cash_mgt_data;
  if (cash_mgt_system.length === 0) {
    throw new Error(localize('cash_management_system_not_found', language));
  }

  //check if cashier is closed or not
  const is_cashier_open = cash_mgt_system[0].active_epoch;
  if (is_cashier_open) {
    throw new Error(localize('close_cashier_for_cashier_report', language));
  }

  // const pipeline = [
  //   { $match: { restaurant_id: restaurant_id, type: 'open-cashier' } },
  //   { $sort: { created_at: -1 } },
  // ];
  let result = open_cashier_data;
  // for (let open_cash_entry of cash_mgt_entries_data) {
  //   if (open_cash_entry && open_cash_entry['type'] == 'open-cashier') {
  //     if (
  //       open_cashier_created_date === 0 ||
  //       open_cashier_created_date > open_cash_entry['created_at']
  //     ) {
  //       result = [open_cash_entry];
  //       open_cashier_created_date = open_cash_entry['created_at'];
  //     }
  //   }
  // }
  // const result = await this.cashMgtRepository.aggregateTxnEntries(pipeline, false, true);
  // result = cash_mgt_entries_data;
  if (result.length === 0) {
    throw new Error(localize('no_entries_found', language));
  }
  const cashier_open_epoch = result[0].created_at;
  const cash_info = getCashInfo(
    rest_details['id'],
    cashier_open_epoch,
    cash_mgt_data,
    cash_mgt_entries_data,
  );
  const cash_float = cash_info['total-open-cashier'] ? Number(cash_info['total-open-cashier']) : 0;
  /* staff name who did the cashier closed */
  // pipeline[0]['$match']['type'] = 'close-cashier';
  // const close_cashier_result = await this.cashMgtRepository.aggregateTxnEntries(
  //   pipeline,
  //   false,
  //   true,
  // );
  const close_cashier_result = close_cashier_data;
  // let close_cashier_created_date = 0;
  // for (let close_cash_entry of cash_mgt_entries_data) {
  //   if (close_cash_entry && close_cash_entry['type'] == 'close-cashier') {
  //     if (
  //       close_cashier_created_date === 0 ||
  //       close_cashier_created_date > close_cash_entry['created_at']
  //     ) {
  //       close_cashier_result = [close_cash_entry];
  //       close_cashier_created_date = close_cash_entry['created_at'];
  //     }
  //   }
  // }
  // for (let close_cash_entry of cash_mgt_entries_data) {
  //   if (close_cash_entry && close_cash_entry['type'] == 'close-cashier') {
  //     close_cashier_result.push(close_cash_entry);
  //   }
  // }
  if (close_cashier_result.length === 0) {
    throw new Error(localize('no_entries_found', language));
  }
  const staff_name = close_cashier_result[0].staff_name;
  const close_cashier_amount = Number(close_cashier_result[0].amount);
  const cashier_closed_epoch = close_cashier_result[0].created_at;
  /* Find cash sales by orders */
  // const order_pipeline = [
  //   {
  //     $match: {
  //       restaurant_id: restaurant_id,
  //       completed_at: { $gte: cashier_open_epoch, $lte: cashier_closed_epoch },
  //       order_status: 4,
  //     },
  //   },
  // ];
  // const found_orders = await this.orderDetailsRepository.getOrderDetailsAggregate(
  //   order_pipeline,
  //   true,
  //   true,
  // );
  const found_orders = order_details_aggregate;
  let cash_sales_by_orders = 0;
  if (found_orders.length === 0) {
  } else {
    const order_ids_list = [];
    for (const order of found_orders) {
      order_ids_list.push(order.order_id);
    }
    // const orders_billing = await this.orderBillingRepository.getOrdersBills(
    //   order_ids_list,
    //   {},
    //   true,
    // );
    // const order_billings =
    order_billings.forEach((order_bill) => {
      const payments = order_bill.payments;
      payments.forEach((payment) => {
        if (
          payment.status === 1 &&
          payment.payment_method &&
          payment.payment_method.toLowerCase() === 'cash'
        ) {
          cash_sales_by_orders += payment.amount;
        }
      });
    });
  }

  return {
    date: moment.unix(moment().unix()).tz(timezone).format('DD/MM/YYYY'),
    time: moment.unix(moment().unix()).tz(timezone).format('hh:mm A'),
    open_cashier_date_time: moment
      .unix(cashier_open_epoch)
      .tz(timezone)
      .format('DD/MM/YYYY hh:mm A'),
    close_cashier_date_time: moment.unix(moment().unix()).tz(timezone).format('DD/MM/YYYY hh:mm A'),
    cashier_open_date: moment.unix(cashier_open_epoch).tz(timezone).format('DD/MM/YYYY'),
    cashier_open_time: moment.unix(cashier_open_epoch).tz(timezone).format('hh:mm A'),
    opening_cash_float: getInternationalizedNumber(cash_float.toFixed(2), country),
    total_cash_in: getInternationalizedNumber(
      Number(cash_info['total-cash-in']).toFixed(2),
      country,
    ),
    cash_in_sales: getInternationalizedNumber(cash_sales_by_orders.toFixed(2), country),
    cash_in_others: getInternationalizedNumber(
      Number(cash_info['total-cash-in'] - cash_sales_by_orders).toFixed(2),
      country,
    ),
    total_cash_out: getInternationalizedNumber(
      Number(cash_info['total-cash-out']).toFixed(2),
      country,
    ),
    net_cash_balance: getInternationalizedNumber(
      Number(cash_info['total-cash-in'] - cash_info['total-cash-out']).toFixed(2),
      country,
    ),
    expected_cash_in_drawer: getInternationalizedNumber(
      Number(cash_info['total-cash-in'] - cash_info['total-cash-out'] + cash_float).toFixed(2),
      country,
    ),
    actual_cash_in_drawer: getInternationalizedNumber(close_cashier_amount.toFixed(2), country),
    excess_short_cash: getInternationalizedNumber(
      Number(
        close_cashier_amount -
          Number(
            Number(cash_info['total-cash-in'] - cash_info['total-cash-out'] + cash_float).toFixed(
              2,
            ),
          ),
      ).toFixed(2),
      country,
    ),
    staff_name: staff_name,
    close_cashier: `${localize('APPROVED BY', language)} ${close_cashier_user.toUpperCase()}`,
    printerName: printer_name,
  };
}

function swapQtyWithaddonName(addon_name) {
  const addons_list = addon_name.split(',');
  let swapped_str = '';
  addons_list.forEach((addon) => {
    const [name, qty] = addon.split('x');
    swapped_str +=
      swapped_str == ''
        ? qty
          ? `${qty}x ${name.trim()}`
          : `${name.trim()}`
        : qty
        ? `, ${qty}x ${name.trim()}`
        : `, ${name.trim()}`;
  });
  return swapped_str;
}

module.exports = {
  generateBillReceipt,
  generateCounterReceipt,
  generateMasterOrderReceipt,
  generateVoidAndCancelCounterReceipt,
  generateVoidMasterReceipt,
  generateDeclineMasterReceipt,
  cashierReport,
  mergeReceiptData,
  viewCashierReport,
};
