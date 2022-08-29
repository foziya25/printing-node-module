const {
  generateBillReceipt,
  generateCounterReceipt,
  generateMasterOrderReceipt,
  generateVoidAndCancelCounterReceipt,
  generateVoidMasterReceipt,
  generateDeclineMasterReceipt,
} = require('./printing');
const { getSettingVal } = require('./utils/utils');
const { localize } = require('./utils/printing-utils');

const KeyName = {
  TABLE_CHANGED: 'table_changed',
};

/* main print handler for generating print data for given orders */
function generatePrintData(
  order_details,
  rest_details,
  type,
  itr,
  kitchen_counter_details = {},
  subcat_counters = [],
  bill_details = [],
  counter_id = '',
  qty = 0,
  oid = '',
) {
  if (order_details) {
    if (order_details.length == 1) {
      order_details = order_details[0];
    }
    // else if (order_details.length > 1) {}
  } else {
    return [];
  }

  let receipt_data = [];

  // --------------------------- type=0 : for counter ---------------------------
  if (type === 0 && counter_id && itr) {
    invalid = false;

    // generate data for counter receipt
    receipt_data = receipt_data.concat(
      generateCounterReceipt(
        order_details,
        rest_details,
        subcat_counters,
        itr,
        0,
        kitchen_counter_details,
        counter_id,
      ),
    );
  }
  // ---------------------------------------------------------------------------

  // --------------------------- type=1 : for receipt ---------------------------
  else if (type === 1) {
    invalid = false;
    // generating receipt data
    receipt_data.push(generateBillReceipt(order_details, rest_details, bill_details));
  }
  // ---------------------------------------------------------------------------

  // ---------------------- type=2 : for counter && receipt ---------------------
  else if (type === 2) {
    invalid = false;

    // generating receipt data
    receipt_data.push(generateBillReceipt(order_details, rest_details, bill_details));

    // generating counter data
    receipt_data = receipt_data.concat(
      generateCounterReceipt(
        order_details,
        rest_details,
        subcat_counters,
        itr,
        2,
        kitchen_counter_details,
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
        receipt_data.push(generateBillReceipt(order_details, rest_details, bill_details));
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
          generateVoidAndCancelCounterReceipt({ ...order_details }, 3, rest_details, '', oid, qty),
        );
      }

      const master_enabled = getSettingVal(rest_details, 'master_docket');
      if (master_enabled && master_enabled > 0) {
        if ((print_code & 4) === 4) {
          receipt_data.push(
            generateMasterOrderReceipt({ ...order_details }, rest_details, true, null, '', '', ''),
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
        receipt_data.push(generateBillReceipt(order_details, rest_details, bill_details));
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

module.exports = { generatePrintData };
