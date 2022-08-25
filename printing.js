const {
  getAddons,
  addDateTime,
  separateAddress,
  getOnlySuccessfulPayments,
  getOrderTypeText,
  unMappedItemMapping,
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
} = require('./utils/utils');
const { localize } = require('./utils/printing-utils').default;
const { getPmtMethodName, getPmtMethods } = require('./classes/payment');
const {
  convertReceiptObj,
  convertCounterObj,
  convertMasterObj,
  convertTableTransferObj,
} = require('./printing-new-slip');
// const { KeyName } = require('./utils/enums.js');

const FormatType = {
  RECEIPT: 'bill_receipt',
  COUNTER: 'counter_receipt',
  VOID_CANCEL_COUNTER: 3,
  TABLE_TRANSFER: 4,
  MASTER: 5,
  VOID_MASTER: 6,
  DECLINE_MASTER: 7,
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

/* generate printing payload for bill receipt */
function generateBillReceipt(order_details, rest_details, bill_details) {
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
        price: item['item_price'],
        amount: item['item_price'] * item['item_quantity'],
        addon: item['addons_name'] ? item['addons_name'] : '',
        variant: item['variation_name'] ? item['variation_name'] : '',
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
  return convertReceiptObj(obj, rest_details);
}

/* generate counter receipt object */
function generateCounterReceipt(
  order_details,
  rest_details,
  subcat_counters = [],
  itr = 1,
  type = 0,
  kitchen_counter_details = {},
  counter_id = '',
) {
  let receipt_data = [];
  let note_type = '';
  let note_reason = '';
  let old_tno = '';
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

  let kitchen_details = {};
  const printer_mapping = kitchen_details;

  const order_type_bit = getOrderTypeBinaryPlace(order_details.order_type);

  const result = getOrderTypeString(order_details, rest_details, language);

  order_details['order_type'] = result.order_type;
  order_details['table_no'] = result.table_no;

  // order_details.sname = staff_name ? staff_name : '';

  // order_details['items'] = unMappedItemMapping(order_details['items']);
  order_details['items'] = getItemsList(
    order_details['items'],
    rest_details,
    kitchen_details,
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
        item['variation_name']
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
                ? `${addon['name']} x(${addon['qty']})`
                : `, ${addon['name']} x(${addon['qty']})`;
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
                ? `${addon['name']} x(${addon['qty']})`
                : `, ${addon['name']} x(${addon['qty']})`;
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
    obj[KeyName.ORDER_SEQ] = order_details['order_seq'];
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
    this.logger.error('getCounterObj error: ', e);
  }

  // receipt_data = formatCounterObj(receipt_data, type, rest_details);

  /* Finally pushing every receipt of master counter list in receipt data array */
  if (master_counter_arr.length > 0) {
    master_counter_arr.forEach((item) => {
      receipt_data.push(item);
    });
  }

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

module.exports = { generateBillReceipt, generateCounterReceipt, generateMasterOrderReceipt };

// const kitchen_details = {
//   kitchen_counter_id,
//   counter_name,
//   printer_name,
// };

/**
 *  item['kitchen_counter_id'] = 'default';
          item['counter_name'] = 'Unmapped Items';
          item['printer_name'] = rest_details['printer']
            ? rest_details['printer']
            : 'Default Printer';
 */
