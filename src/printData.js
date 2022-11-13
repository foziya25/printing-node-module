/*
  Last Modified : 27th October
  Changes - fix for allergic items pre conversion to array from object
            (line 185 & 487)
*/

const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const {
  generateBillReceipt,
  generateCounterReceipt,
  generateMasterOrderReceipt,
  generateVoidAndCancelCounterReceipt,
  generateVoidMasterReceipt,
  generateDeclineMasterReceipt,
  cashierReport,
  mergeReceiptData,
} = require('./printing');

const {
  getSettingVal,
  getOrderTypeBinaryPlace,
  getOrderTypeString,
  getPrintLanguage,
  getAllergicItemsList,
} = require('../utils/utils');
const { localize, generateReportV2, generateReceiptV2 } = require('../utils/printing-utils');
const { KeyName } = require('../config/enums');

const { convertReceiptObj } = require('./printing-new-slip');

/* cash management receipt print function */
function generateCashierReportData(
  rest_details,
  new_format = 1,
  order_details = [],
  order_billings = [],
  open_cashier_data = [],
  close_cashier_data = [],
  cash_mgt_data = [],
  cash_mgt_entries_data = [],
  receipt_type = null,
  country_code = 'MY',
  language = 'en-US',
  print_data = true,
) {
  const restaurant_id = rest_details['id'];
  const restaurant = rest_details;
  if (!restaurant) {
    throw new Error(`Restaurant with id ${restaurant_id} not found`);
  }
  const for_close_enable =
    restaurant &&
    restaurant['settings'] &&
    restaurant['settings']['global'] &&
    restaurant['settings']['global']['force_close_cash_mgt']
      ? restaurant['settings']['global']['force_close_cash_mgt']
      : 0;
  /** This key manually overrides to old format */
  const cash_mgt_format_override = getSettingVal(restaurant, 'cash_mgt_format_override');
  let receipt = {};
  if (receipt_type === 'report') {
    receipt = cashierReport(
      rest_details,
      open_cashier_data,
      close_cashier_data,
      order_details,
      order_billings,
      cash_mgt_data,
      cash_mgt_entries_data,
      {},
      country_code,
      language,
    );
    if (print_data) {
      receipt['counterName'] = 'Cashier Report';
      receipt['name'] = receipt['staff_name'];
      // Added type 'cash-in' for backward-compatibility
      receipt['type'] = 'cash-in';
      delete receipt['staff_name'];
      if (new_format === 1 && cash_mgt_format_override !== 1) {
        receipt = [generateReportV2(receipt, restaurant, for_close_enable)];
      }
    }
  }
  // For other receipt types
  else {
    // const pipeline = [{ $match: { restaurant_id: restaurant_id, txn_id: txn_id } }];
    let result = cash_mgt_entries_data[0];

    if (!result) {
      return [];
    }

    const timezone = restaurant.time_zone;
    const printer_name =
      restaurant['cash_mgt_printer'] !== undefined &&
      restaurant['cash_mgt_printer'] !== null &&
      restaurant['cash_mgt_printer'].trim() !== ''
        ? restaurant['cash_mgt_printer']
        : restaurant['printer'];

    let amount = result['amount'];
    try {
      amount = amount.toFixed(2);
    } catch (e) {
      amount = undefined;
    }
    const created_at = result['created_at'];
    const date = moment.tz(moment.unix(created_at), timezone).format('DD/MM/YYYY');
    const time = moment.tz(moment.unix(created_at), timezone).format('hh:mm A');

    receipt = {
      counterName: result['type'],
      printerName: printer_name,
      name: result['staff_name'],
      type: 'cash-in',
      amount: amount,
      date: date,
      time: time,
      reason: result['reason'],
    };
    if (new_format === 1 && cash_mgt_format_override !== 1) {
      receipt = [generateReceiptV2(receipt, restaurant)];
    }
  }
  return receipt;
}

/* cash drawer kick function */
function cashDrawerKick(rest_details, cash_info, staff_name, reason = null, language = null) {
  const response = {
    status: 0,
    message: '',
    txn_id: '',
    data: {},
  };

  // check restaurant exists or not
  if (!rest_details) {
    return response;
  }

  if (cash_info && cash_info.length === 0) {
    return response;
  }

  language = language || getPrintLanguage(rest_details);

  const drawer_obj = {};
  drawer_obj['restaurant_id'] = rest_details['id'];
  drawer_obj['txn_id'] = uuidv4().replace(/\-/g, '');
  drawer_obj['type'] = 'drawer-kick';
  drawer_obj['staff_name'] = staff_name;
  drawer_obj['amount'] = null;
  drawer_obj['reason'] = reason;
  drawer_obj['created_at'] = moment().unix();

  response['status'] = 1;
  response['data'] = drawer_obj;
  response['message'] = localize('drawer_opened_successfully', language);
  return response;
}

/* print receipt generator function for kitchen counters,
   bill receipt, table change, void, declined cases */
function generatePrintData(
  order_details,
  rest_details,
  type,
  itr,
  printer_mapping = {},
  kitchen_counter_details = {},
  subcat_counters = [],
  bill_details = [],
  counter_id = '',
  qty = 0,
  oid = '',
  staff_name = '',
  logo_base_url = '',
) {
  // generate print logo url for restaurant
  if (rest_details['print_logo'] && logo_base_url) {
    rest_details['print_logo'] = `${base_path}/${rest_details['print_logo']}`;
  }

  // case for single order receipt, countet, master, void and table change printing
  if (order_details && order_details.length == 1) {
    order_details = order_details[0];
    let receipt_data = [];

    order_details['allergic_items'] = getAllergicItemsList(order_details['allergic_items']);
    order_details['staff_name'] = staff_name ? staff_name : '';

    // --------------------------- type=0 : for counter ---------------------------
    if (type === 0 && counter_id && itr) {
      invalid = false;

      // generate data for counter receipt
      let derived_data = generateCounterReceipt(
        order_details,
        rest_details,
        subcat_counters,
        itr,
        0,
        kitchen_counter_details,
        printer_mapping,
        counter_id,
      );
      receipt_data = derived_data ? receipt_data.concat(derived_data) : [];
    }
    // ---------------------------------------------------------------------------

    // --------------------------- type=1 : for receipt ---------------------------
    else if (type === 1) {
      invalid = false;
      // generating receipt data
      receipt_data.push(generateBillReceipt(order_details, rest_details, bill_details[0] || {}));
    }
    // ---------------------------------------------------------------------------

    // ---------------------- type=2 : for counter && receipt ---------------------
    else if (type === 2) {
      invalid = false;

      // generating receipt data
      receipt_data.push(generateBillReceipt(order_details, rest_details, bill_details[0] || {}));

      // generating counter data
      receipt_data = receipt_data.concat(
        generateCounterReceipt(
          order_details,
          rest_details,
          subcat_counters,
          itr,
          2,
          kitchen_counter_details,
          printer_mapping,
        ),
      );
    }
    // ---------------------------------------------------------------------------

    // -------------- type=4 : for counters only or auto accept case -------------
    else if (type == 4 && itr) {
      invalid = false;
      let print_code = 0;

      const on_accept_new_order = getSettingVal(rest_details, 'on_accept_new_order');
      const on_accept_new_itr = getSettingVal(rest_details, 'on_accept_new_itr');

      if (!on_accept_new_order && !on_accept_new_itr) {
        receipt_data = receipt_data.concat(
          generateCounterReceipt(
            order_details,
            rest_details,
            subcat_counters,
            itr,
            4,
            kitchen_counter_details,
            printer_mapping,
          ),
        );
      } else {
        print_code = itr === 1 ? on_accept_new_order : on_accept_new_itr;
      }

      if (print_code > 0) {
        // 2: counter_obj
        if ((print_code & 2) === 2) {
          // generate counter data
          receipt_data = receipt_data.concat(
            generateCounterReceipt(
              order_details,
              rest_details,
              subcat_counters,
              itr,
              4,
              kitchen_counter_details,
              printer_mapping,
            ),
          );
        }
        const master_enabled = getSettingVal(rest_details, 'master_docket');
        if (master_enabled && master_enabled > 0) {
          // 4: master order list
          if ((print_code & 4) == 4) {
            const note_type = itr > 1 ? 'Order Updated' : '';
            // generate master list data
            receipt_data.push(
              generateMasterOrderReceipt(order_details, rest_details, itr, note_type, true, '', ''),
            );
          }
        }
        if ((print_code & 1) === 1) {
          // 1: receipt obj
          // generating receipt data
          receipt_data.push(
            generateBillReceipt(order_details, rest_details, bill_details[0] || {}),
          );
        }
      }
    }
    // ----------------------------------------------------------------------------------

    // ------------------------------- type=3 : for void dishes --------------------------
    else if (type === 3 && qty > 0 && oid !== '') {
      invalid = false;
      let voided_item = {};
      const void_index = order_details.void_items
        ? order_details.void_items.findIndex((e) => e.order_item_id === oid)
        : -1;
      if (void_index > -1) {
        voided_item = { ...order_details.void_items[void_index] };
        voided_item.item_quantity = qty;
      }
      let print_code = 0;

      const on_void_unaccepted = getSettingVal(rest_details, 'on_void_unaccepted');
      const on_void_accepted = getSettingVal(rest_details, 'on_void_accepted');
      const on_void_new_itr = getSettingVal(rest_details, 'on_void_new_itr');

      if (!on_void_unaccepted && !on_void_accepted && !on_void_new_itr) {
        receipt_data = receipt_data.concat(
          generateVoidAndCancelCounterReceipt({ ...order_details }, 3, rest_details, '', oid, qty),
        );
      } else {
        if (voided_item.item_status === 0 && voided_item.itr === 1) {
          print_code = on_void_unaccepted;
        } else if (voided_item.item_status === 0 && voided_item.itr > 1) {
          print_code = on_void_new_itr;
        } else if ([1, 2, 3].includes(voided_item.item_status)) {
          print_code = on_void_accepted;
        }
      }

      if (print_code > 0) {
        if ((print_code & 2) === 2) {
          receipt_data = receipt_data.concat(
            generateVoidAndCancelCounterReceipt(
              { ...order_details },
              3,
              rest_details,
              '',
              oid,
              qty,
            ),
          );
        }

        const master_enabled = getSettingVal(rest_details, 'master_docket');
        if (master_enabled && master_enabled > 0) {
          if ((print_code & 4) === 4) {
            receipt_data.push(
              generateMasterOrderReceipt(
                { ...order_details },
                rest_details,
                true,
                null,
                '',
                '',
                '',
              ),
            );

            if ((print_code & 8) === 8) {
              // 8: print master docket
              receipt_data.push(
                generateVoidMasterReceipt({ ...order_details }, rest_details, voided_item),
              );
            }
          }
        }
      }
    }
    // -----------------------------------------------------------------------------------------

    // ------------------ type=5 : show canceled order items/declined items --------------------
    else if (type === 5 && itr) {
      invalid = false;

      //const on_decline = rest_details['settings']['print']['on_decline'];

      const on_decline = getSettingVal(rest_details, 'on_decline');
      if ((on_decline & 2) === 2) {
        receipt_data = receipt_data.concat(
          generateVoidAndCancelCounterReceipt(
            { ...order_details },
            5,
            rest_details,
            itr,
            oid,
            qty,
            subcat_counters,
            kitchen_counter_details,
          ),
        );
      }
      const master_enabled = getSettingVal(rest_details, 'master_docket');
      if (master_enabled && master_enabled > 0) {
        if ((on_decline & 8) === 8) {
          const decline_master_receipt = generateDeclineMasterReceipt(
            { ...order_details },
            rest_details,
            itr,
          );
          if (Object.keys(decline_master_receipt).length > 0) {
            receipt_data.push(decline_master_receipt);
          }
        }
      }
    }
    // ----------------------------------------------------------------------------------

    // ---------------------- type=6 : show slips on table change -----------------------
    else if (type === 6) {
      invalid = false;
      let print_code = 0;

      const on_table_change = getSettingVal(rest_details, 'on_table_change');

      if (on_table_change && on_table_change > 0) {
        print_code = on_table_change;
        const note_type = localize(KeyName.TABLE_CHANGED, getSettingVal(rest_details, 'language'));
        let old_tno = '';
        try {
          const old_tables = order_details['analytics']['old_tables'];
          if (old_tables && old_tables.length > 0) {
            const index = old_tables.length - 1;
            old_tno = old_tables[index]['table_no'];
          }
        } catch (e) {}

        if ((print_code & 2) === 2) {
          receipt_data = receipt_data.concat(
            generateCounterReceipt(
              order_details,
              rest_details,
              subcat_counters,
              itr,
              6,
              kitchen_counter_details,
              printer_mapping,
              '',
              note_type,
              old_tno,
            ),
          );
        }
        const master_enabled = getSettingVal(rest_details, 'master_docket');
        if (master_enabled && master_enabled > 0) {
          if ((print_code & 4) === 4) {
            receipt_data.push(
              generateMasterOrderReceipt(order_details, rest_details, itr, note_type, true, '', ''),
            );
          }
        }
        if ((print_code & 1) === 1) {
          receipt_data.push(
            generateBillReceipt(order_details, rest_details, bill_details[0] || {}),
          );
        }
      }
    }
    // ---------------------------------------------------------------------------

    // type=7 : show master order list for restaurants which have master_docket = 1 in settings
    else if (type == 7) {
      invalid = false;

      const master_enabled = getSettingVal(rest_details, 'master_docket');
      if (master_enabled && master_enabled > 0) {
        receipt_data.push(
          generateMasterOrderReceipt({ ...order_details }, rest_details, true, null, '', '', ''),
        );
      }
    }

    return receipt_data;
  }

  // ------------------------------ Case of merge bill --------------------------
  else if (type === 1 && order_details.length > 0) {
    const response_format = getSettingVal(rest_details, 'response_format');
    let order_type_bit = 7;
    const receipt_data = [];
    let temp_obj = {};
    for (const [key, order_detail] of Object.entries(order_details)) {
      const bill_detail = bill_details.filter((e) => {
        return order_detail['order_id'] === e['order_id'];
      });
      if (!bill_detail) {
        return [];
      }

      order_detail['allergic_items'] = getAllergicItemsList(order_detail['allergic_items']);

      /* Attach order type bit map in order_details */
      order_type_bit = getOrderTypeBinaryPlace(order_detail.order_type);
      try {
        const result = getOrderTypeString(order_detail, rest_details);
        order_detail.order_type = result.order_type;
        order_detail.table_no = result.table_no;
      } catch (e) {
        this.logger.error(e);
      }

      const obj = generateBillReceipt({ ...order_detail }, rest_details, bill_detail[0], true);

      if (parseInt(key) === 0) {
        temp_obj = { ...obj };
      } else {
        temp_obj = mergeReceiptData(temp_obj, obj, rest_details);
      }
    }

    const merge_v2 = convertReceiptObj(temp_obj, rest_details);
    receipt_data.push(merge_v2);

    if (receipt_data.length > 0) {
      return receipt_data;
    } else {
      return [];
    }
  } else {
    return [];
  }
}

/* create generatePrintData function payload */
function createPrinterMappingsHelper(kitchenCounterDetails, itemDetails, subcategoryDetails) {
  let itemKitchenCounterMapping = {};
  let subcatKitchenCounterMapping = {};
  let kitchenCounterMapping = {};

  /* create all kitchen counters mapping */
  for (const kitchenCounterDetail of kitchenCounterDetails) {
    kitchenCounterMapping[kitchenCounterDetail['id']] = kitchenCounterDetail;
  }

  /* create item's kitchen counters mapping */
  for (const itemDetail of itemDetails) {
    const kitchenCounterList = itemDetail['kitchen_counter_id']
      .split(',')
      .filter((e) => e.trim())
      .map((e) => e.trim());
    if (kitchenCounterList && kitchenCounterList.length > 0) {
      itemKitchenCounterMapping[itemDetail['id']] = {};
      for (const kitchenCounter of kitchenCounterList) {
        if (!itemKitchenCounterMapping[itemDetail['id']][kitchenCounter]) {
          itemKitchenCounterMapping[itemDetail['id']][kitchenCounter] =
            kitchenCounterMapping[kitchenCounter];
        }
      }
    }
  }

  /* creating subcategory printer mapping */
  for (const subcategoryDetail of subcategoryDetails) {
    if (subcategoryDetails && subcategoryDetails.length > 0) {
      for (let kitchenCounterDetail of subcategoryDetail['kitchen_counters']) {
        if (!subcatKitchenCounterMapping[subcategoryDetail['id']]) {
          subcatKitchenCounterMapping[subcategoryDetail['id']] = [];
        }
        if (kitchenCounterDetail['status'] === 1) {
          subcatKitchenCounterMapping[subcategoryDetail['id']].push({
            kc_id: kitchenCounterDetail['kitchen_counter_id'],
            counter_name: kitchenCounterDetail['counter_name'],
            printer_name: kitchenCounterDetail['printer_name'],
            kitchen_counter_id: kitchenCounterDetail['kitchen_counter_id'],
          });
        }
      }
    }
  }

  return {
    kitchenCounterMap: kitchenCounterMapping,
    itemPrinterMap: itemKitchenCounterMapping,
    subcategoryPrinterMap: subcatKitchenCounterMapping,
  };
}

/*
  function to generate data for kitchen counter mapping
  for printing popup on print click button
*/
function generateOrderPrintPopUpResponse(
  items,
  allKitchenCounters,
  itemMenuDetails,
  subcategoryDetails,
) {
  let kitchenCounterMapping = {};

  /* process all kitchen counter(s) data */
  for (const kitchenCounter of allKitchenCounters) {
    kitchenCounterMapping[kitchenCounter['id']] = kitchenCounter;
  }

  /* process menu item counter(s) data */
  for (const itemMenuDetail of itemMenuDetails) {
    if (itemMenuDetail['kitchen_counter_id']) {
      const kcIdList = itemMenuDetail['kitchen_counter_id'].split(',').filter((e) => e.trim());
      for (const kitchen_counter of kcIdList) {
        /* initialise the items array */
        if (
          kitchenCounterMapping[kitchen_counter] &&
          !kitchenCounterMapping[kitchen_counter]['itemIds']
        ) {
          kitchenCounterMapping[kitchen_counter]['itemIds'] = [];
        }
        kitchenCounterMapping[kitchen_counter]['itemIds'].push(itemMenuDetail['id']);
      }
    }
  }

  /* process subcategory counter(s) data */
  for (const subcategroyDetail of subcategoryDetails) {
    if (subcategroyDetail['kitchen_counters']) {
      for (const kitchen_counter of subcategroyDetail['kitchen_counters']) {
        let kcId = kitchen_counter['kitchen_counter_id'];
        if (kcId) {
          /* initialise the subcategory array */
          if (kitchenCounterMapping[kcId] && !kitchenCounterMapping[kcId]['subcategoryIds']) {
            kitchenCounterMapping[kcId]['subcategoryIds'] = [];
          }
          kitchenCounterMapping[kcId]['subcategoryIds'].push(subcategroyDetail['id']);
        }
      }
    }
  }

  /* creating final response */
  let response = {};
  let added_counters = {};
  for (const item of items) {
    if (added_counters && !added_counters[item['itr']]) {
      added_counters[item['itr']] = [];
    }
    if (!response[item['itr']]) {
      response[item['itr']] = {
        itr: item['itr'],
        data: [],
      };
    }
    let kcFoundFlag = false;

    /* 1st priority to check for item printer mapping */
    for (const [kitchenCounterId, KitchenCounterDetail] of Object.entries(kitchenCounterMapping)) {
      let kcObj = KitchenCounterDetail;
      if (kcObj['itemIds'] && kcObj['itemIds'].includes(item['item_id'])) {
        if (!added_counters[item['itr']].includes(kcObj['counter_name'])) {
          response[item['itr']]['data'].push({
            counter_name: kcObj['counter_name'],
            counter_id: kcObj['id'],
          });
          added_counters[item['itr']].push(kcObj['counter_name']);
        }
        kcFoundFlag = true;
      }
    }

    /* 2nd priority to check for subcategory printer mapping */
    if (!kcFoundFlag) {
      for (const [kitchenCounterId, KitchenCounterDetail] of Object.entries(
        kitchenCounterMapping,
      )) {
        let kcObj = KitchenCounterDetail;
        if (kcObj['subcategoryIds'] && kcObj['subcategoryIds'].includes(item['subcategory_id'])) {
          if (!added_counters[item['itr']].includes(kcObj['counter_name'])) {
            response[item['itr']]['data'].push({
              counter_name: kcObj['counter_name'],
              counter_id: kcObj['id'],
            });
            added_counters[item['itr']].push(kcObj['counter_name']);
          }
          kcFoundFlag = true;
        }
      }
    }

    /* if item and subcat printer mapping not found then mark it as unmapped */
    if (!kcFoundFlag) {
      if (!added_counters[item['itr']].includes('Unmapped Items')) {
        response[item['itr']]['data'].push({
          counter_name: 'Unmapped Items',
          counter_id: 'default',
        });
        added_counters[item['itr']].push('Unmapped Items');
      }
    }
    response[item['itr']]['data'] = Array.from(new Set(response[item['itr']]['data']));
  }
  if (response) {
    return Object.values(response);
  }
  return [];
}

module.exports = {
  generatePrintData,
  generateCashierReportData,
  cashDrawerKick,
  createPrinterMappingsHelper,
  generateOrderPrintPopUpResponse,
};
