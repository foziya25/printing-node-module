const { getAddons, separateAddress, getOnlySuccessfulPayments, getOrderTypeText, unMappedItemMapping, comboPrinting } = require("./utils/utils.js");
const { getPmtMethodName, getPmtMethods } = require("./classes/payment.js");
const { convertReceiptObj, convertCounterObj } = require("./printing-new-slip");

function generateBillReceipt(rest_details, order_details, bill_details) {
  const order_id = order_details["order_id"];
  const show_sname = rest_details["settings"]["print"]["sname"];
  const show_uname = rest_details["settings"]["print"]["uname"];
  const pax_enabled = rest_details["settings"]["print"]["pax"];
  const show_item_code = rest_details["settings"]["print"]["item_code"];
  const obj = {};
  obj["type"] = "receipt";
  obj["printerName"] = rest_details["printer"] ? rest_details["printer"] : "Cashier";
  obj["header"] = [];
  const header_obj = rest_details["settings"]["print"]["header"];
  const custom_header = header_obj ? header_obj["custom"] : null;
  if (custom_header && Array.isArray(custom_header) && custom_header.length > 0) {
    obj["header"] = custom_header;
  } else {
    // Add strings from prepend list
    obj["header"].push(rest_details.name);
    const prepend_list = header_obj ? header_obj["prepend"] : [];
    if (prepend_list && prepend_list.length > 0) {
      prepend_list.forEach((str) => obj["header"].push(str));
    }
    // Add address
    obj["header"] = separateAddress(obj["header"], rest_details.address, 30);
    // Add strings from append list
    const append_list = header_obj ? header_obj["append"] : [];
    if (append_list && append_list.length > 0) {
      append_list.forEach((str) => obj["header"].push(str));
    }
  }
  obj["body"] = {};
  obj["body"]["Type"] = getOrderTypeText(order_details["order_type"]);

  if (!["", null, undefined].includes(order_details["table_no"])) {
    obj["body"]["Table"] = order_details["table_no"].toString();
  }
  obj["body"]["Order"] = order_details["order_no"];

  const guest_name = order_details.guest_name;
  if (guest_name && guest_name.trim()) {
    obj["body"]["Order"] += ` (${guest_name})`;
  }

  // const get_date_time = this.getReceiptDataUtils.addDateTime(order_details, rest_details);
  // obj["body"]["Date"] = get_date_time["date"];
  // obj["body"]["Time"] = get_date_time["time"];

  obj["body"]["Cashier"] = rest_details.cashier ? rest_details.cashier : "";

  if (pax_enabled == 1) {
    obj["body"]["Pax"] = order_details.pax ? order_details.pax.toString() : "";
  }

  if (show_sname == 1) {
    obj["body"]["Staff"] = order_details.sname;
  }

  if (show_uname == 1) {
    obj["body"]["Name"] = order_details.name ? order_details.name : "";
  }
  obj["body"]["Mob"] = order_details["phone"] && order_details["phone"].length < 14 ? order_details["phone"] : "";

  obj["order"] = {};
  obj["order"]["currency"] = "RM";
  obj["order"]["allergic_items"] = order_details["allergic_items"];

  obj["order"]["items"] = [];

  let noOfItems = 0;
  for (const original_item of order_details["items"]) {
    const item = { ...original_item };
    if (item["item_status"] != 5 && item["item_status"] != 6) {
      if ((show_item_code & 8) == 8 && item["item_code"] && item["item_code"].trim() != "") {
        item["item_name"] = `(${item["item_code"]}) ${item["item_name"]}`;
      }
      const item_obj = {
        name: item["item_name"],
        qty: item["item_quantity"],
        price: item["item_price"],
        amount: item["item_price"] * item["item_quantity"],
        addon: item["addons_name"] ? item["addons_name"] : "",
        variant: item["variation_name"] ? item["variation_name"] : "",
      };
      if (item["is_combo_item"]) {
        item_obj["combo_name"] = "";
        for (const combo_item of item["combo_items"]) {
          item_obj["combo_name"] += item_obj["combo_name"] === "" ? `(${combo_item["quantity"]}) ${combo_item["item_name"]}` : `, (${combo_item["quantity"]}) ${combo_item["item_name"]}`;
        }
      }
      obj["order"]["items"].push(item_obj);
    }
  }

  for (const item of obj["order"]["items"]) {
    noOfItems += item["qty"];
  }

  obj["body"]["NUMBER OF ITEMS"] = noOfItems.toString();

  obj["order"]["bill"] = [];
  let subtotal_index = null;
  for (const [key, fee] of Object.entries(bill_details["fees"])) {
    if (fee["id"] === "item_total" && !(order_details["order_by"] === "auto" && order_details["platform"] === "foodpanda")) {
      fee["fee_name"] = "Sub-Total";
    }
    obj["order"]["bill"].push({ name: fee["fee_name"], value: fee["fee"] });

    if (["platform_commision", "platform_commission"].includes(fee["id"])) {
      subtotal_index = key;
    }
  }

  // If subtotal exists, insert it before platform_commission object
  if (order_details["order_by"] === "auto" && order_details["platform"] === "foodpanda" && bill_details["subtotal"]) {
    const subtotal_obj = {
      name: "Sub-Total",
      value: bill_details["subtotal"],
    };
    if (subtotal_index === null) {
      obj["order"]["bill"].push(subtotal_obj);
    } else {
      obj["order"]["bill"].splice(subtotal_index, 0, subtotal_obj);
    }
  }

  obj["order"]["bill"].push({
    name: "Total",
    value: bill_details["bill_total"],
  });

  /* Add Payment Details to Receipt */
  const all_payments = getOnlySuccessfulPayments(bill_details["payments"]);
  const temp = {};
  let pmt_header = "";

  if (all_payments.length > 0 && bill_details["paid"] > 0) {
    const platform = order_details.platform ? order_details.platform.toLowerCase() : "easyeat";

    for (const payment of all_payments) {
      const payment_channel = payment["payment_channel"].toLowerCase();
      temp[payment_channel] = temp[payment_channel] ? temp[payment_channel] : {};

      /* Payment by Cash */
      if (payment_channel === "cash") {
        if (!temp[payment_channel]["Cash Received"]) {
          temp[payment_channel]["Cash Received"] = 0;
          pmt_header += pmt_header ? ", Cash" : "Cash";
        }
        if (!temp[payment_channel]["Cash Returned"]) {
          temp[payment_channel]["Cash Returned"] = 0;
        }

        if (payment["merged_with"]) {
          if (payment["merged_with"] === order_id) {
            const returned_amt = payment["returned_amt"] ? payment["returned_amt"] : 0;
            temp[payment_channel]["Cash Received"] += payment["amount"] + returned_amt;
          } else {
            temp[payment_channel]["Cash Received"] += payment["amount"];
          }
          const balance = bill_details["bill_total"] - temp[payment_channel]["Cash Received"];
          if (balance < 0) {
            temp[payment_channel]["Cash Returned"] = Math.abs(balance);
          }
        } else {
          temp[payment_channel]["Cash Received"] += payment["collected_amt"] ? payment["collected_amt"] : payment["amount"];
          const balance = bill_details["bill_total"] - temp[payment_channel]["Cash Received"];
          if (payment["returned_amt"]) {
            temp[payment_channel]["Cash Returned"] += payment["returned_amt"];
            temp[payment_channel]["Cash Returned"] = temp[payment_channel]["Cash Returned"];
          } else if (balance < 0) {
            temp[payment_channel]["Cash Returned"] = Math.abs(balance);
          }
        }
        temp[payment_channel]["Cash Received"] = temp[payment_channel]["Cash Received"];

        if (payment["transaction_id"]) {
          const transaction_id = payment["transaction_id"].trim();
          if (temp[payment_channel]["Transaction ID"]) {
            temp[payment_channel]["Transaction ID"] += `, ${transaction_id}`;
          } else {
            temp[payment_channel]["Transaction ID"] = transaction_id;
          }
        }
      }

      // Online Wallets
      else if (Object.keys(getPmtMethods([2])).includes(payment_channel) && platform === "easyeat") {
        if (!temp[payment_channel]["Amount Paid"]) {
          temp[payment_channel]["Payment Mode"] = getPmtMethodName(payment_channel);
          temp[payment_channel]["Amount Paid"] = 0;
          pmt_header += pmt_header ? ", " : "";
          pmt_header += temp[payment_channel]["Payment Mode"];
        }
        temp[payment_channel]["Amount Paid"] += payment["amount"];
        temp[payment_channel]["Amount Paid"] = temp[payment_channel]["Amount Paid"];

        if (payment["transaction_id"]) {
          const transaction_id = payment["transaction_id"].trim();
          if (temp[payment_channel]["Transaction ID"]) {
            temp[payment_channel]["Transaction ID"] += `, ${transaction_id}`;
          } else {
            temp[payment_channel]["Transaction ID"] = transaction_id;
          }
        }
      }

      // NetBanking (FPX)
      else if (Object.keys(getPmtMethods([4])).includes(payment_channel) && platform === "easyeat") {
        if (!temp[payment_channel]["Amount Paid"]) {
          const bank_name = getPmtMethodName(payment_channel);
          temp[payment_channel]["Payment Mode"] = "FPX - " + bank_name;
          temp[payment_channel]["Amount Paid"] = 0;
          pmt_header += pmt_header ? ", " : "";
          pmt_header += temp[payment_channel]["Payment Mode"];
        }
        temp[payment_channel]["Amount Paid"] += payment["amount"];
        temp[payment_channel]["Amount Paid"] = temp[payment_channel]["Amount Paid"];

        if (payment["transaction_id"]) {
          const transaction_id = payment["transaction_id"].trim();
          if (temp[payment_channel]["Transaction ID"]) {
            temp[payment_channel]["Transaction ID"] += `, ${transaction_id}`;
          } else {
            temp[payment_channel]["Transaction ID"] = transaction_id;
          }
        }
      }

      // Online and Offline credit cards
      else if ((Object.keys(getPmtMethods([3])).includes(payment_channel) && platform === "easyeat") || Object.keys(getPmtMethods([6])).includes(payment_channel)) {
        delete temp[payment_channel];
        temp["credit_card"] = temp["credit_card"] ? temp["credit_card"] : {};
        if (!temp["credit_card"]["Amount Paid"]) {
          temp["credit_card"]["Payment Mode"] = getPmtMethodName(payment_channel);
          temp["credit_card"]["Amount Paid"] = 0;
          pmt_header += pmt_header ? ", " : "";
          pmt_header += temp["credit_card"]["Payment Mode"];
        }
        temp["credit_card"]["Amount Paid"] += payment["amount"];
        temp["credit_card"]["Amount Paid"] = temp["credit_card"]["Amount Paid"];

        if (payment["transaction_id"]) {
          const transaction_id = payment["transaction_id"].trim();
          if (temp["credit_card"]["Transaction ID"]) {
            temp["credit_card"]["Transaction ID"] += `, ${transaction_id}`;
          } else {
            temp["credit_card"]["Transaction ID"] = transaction_id;
          }
        }
      }

      // Offline Wallets
      else if (Object.keys(getPmtMethods([5])).includes(payment_channel)) {
        if (!temp[payment_channel]["Amount Paid"]) {
          const method_name = getPmtMethodName(payment_channel);
          temp[payment_channel]["Payment Mode"] = method_name.replace("Offline", "");
          temp[payment_channel]["Amount Paid"] = 0;
          pmt_header += pmt_header ? ", " : "";
          pmt_header += temp[payment_channel]["Payment Mode"];
        }
        temp[payment_channel]["Amount Paid"] += payment["amount"];
        temp[payment_channel]["Amount Paid"] = temp[payment_channel]["Amount Paid"];

        if (payment["transaction_id"] && payment["transaction_id"] != null && payment["transaction_id"] != "") {
          const transaction_id = payment["transaction_id"].trim();
          if (temp[payment_channel]["Transaction ID"]) {
            temp[payment_channel]["Transaction ID"] += `, ${transaction_id}`;
          } else {
            temp[payment_channel]["Transaction ID"] = transaction_id;
          }
        }
      }
    }
  } else {
    obj["order"]["bill"].push({ name: "Payment Mode", value: "Unpaid" });
  }

  const temp_keys = Object.keys(temp);
  temp_keys.sort();
  for (const temp_key of temp_keys) {
    for (const [key, value] of Object.entries(temp[temp_key])) {
      obj["order"]["bill"].push({ name: key, value: value });
    }
  }
  const balance = bill_details.balance;

  obj["order"]["bill"].push({ name: "Balance", value: balance });

  obj["footer"] = [];
  try {
    const footer_list = rest_details["settings"]["print"]["footer"];
    if (footer_list && footer_list.length > 0) {
      obj["footer"] = footer_list;
    }
  } catch (e) {}

  return convertReceiptObj(obj, rest_details);
}

function generateCounterReceipt(kitchen_details, rest_details, order_details, itr = 1) {
  const temp_item_obj = {};
  const temp_kitchen_data = {};
  const show_sname = rest_details["settings"]["print"]["sname"];
  const show_uname = rest_details["settings"]["print"]["uname"];
  const pax_enabled = rest_details["settings"]["print"]["pax"];

  order_details["items"] = unMappedItemMapping(order_details["items"]);
  for (const original_item of order_details["items"]) {
    const item = { ...original_item };
    if (item["itr"] === itr && item["kitchen_counter_id"] && item["kitchen_counter_id"].includes(kitchen_details["kitchen_counter_id"])) {
      if (!(item["itr"] + "_" + item["kitchen_counter_id"] in temp_item_obj)) {
        temp_item_obj[item["itr"] + "_" + item["kitchen_counter_id"]] = [];
      }

      if (!(item["itr"] + "_" + item["kitchen_counter_id"] in temp_kitchen_data)) {
        temp_kitchen_data[item["itr"] + "_" + item["kitchen_counter_id"]] = [];
      }
      const item_obj = {};
      /* For case of notmal item, notheing specical is to be done */
      if (!item["is_combo_item"]) {
        item_obj["name"] = item["item_name"];
        item_obj["qty"] = item["item_quantity"];
        item_obj["addon"] = "";
        item_obj["variant"] = item["variation_name"] ? item["variation_name"] : "";
        item_obj["note"] = item["special_note"] ? item["special_note"] : "";
      } else {
        comboPrinting(item_obj, item, kitchen_details["kitchen_counter_id"]);
      }

      item["addons"] = getAddons(item);
      // if (!item["is_copy"]) {
      //   for (const addon of item["addons"]) {
      //     if (addon["printer"] && addon["printer"].trim() != "") {
      //       const printer = addon["printer"].trim();
      //       if (!(item["itr"] + "_" + printer in temp_item_obj)) {
      //         temp_item_obj[item["itr"] + "_" + printer] = [];
      //       }
      //       if (!(item["itr"] + "_" + printer in temp_kitchen_data)) {
      //         temp_kitchen_data[item["itr"] + "_" + printer] = [];
      //       }
      //       temp_item_obj[item["itr"] + "_" + printer].push({
      //         name: addon["name"],
      //         qty: item["item_quantity"] * addon["qty"],
      //         addon: "",
      //         variant: "",
      //         note: "",
      //       });
      //       if (temp_kitchen_data[item["itr"] + "_" + printer].length === 0) {
      //         temp_kitchen_data[item["itr"] + "_" + printer].push({
      //           counterName: printer,
      //           printerName: printer,
      //         });
      //       }
      //     } else {
      //       item_obj["addon"] += item_obj["addon"] === "" ? `${addon["name"]} x(${addon["qty"]})` : `, ${addon["name"]} x(${addon["qty"]})`;
      //     }
      //   }
      // }

      /* I need to insert addon name which do not have a printer assigned or have same printer as item printer
          for the case of copied item object */

      for (const addon of item["addons"]) {
        if (!(addon["printer"] && addon["printer"].trim()) || (addon["printer"] && addon["printer"].trim()) === kitchen_details["printer_name"]) {
          item_obj["addon"] += item_obj["addon"] === "" ? `${addon["name"]} x(${addon["qty"]})` : `, ${addon["name"]} x(${addon["qty"]})`;
        }
      }

      temp_item_obj[item["itr"] + "_" + item["kitchen_counter_id"]].push(item_obj);

      if (temp_kitchen_data[item["itr"] + "_" + item["kitchen_counter_id"]].length === 0) {
        temp_kitchen_data[item["itr"] + "_" + item["kitchen_counter_id"]].push({
          kitchen_counter_id: item["kitchen_counter_id"],
          counterName: kitchen_details["counter_name"] ? kitchen_details["counter_name"] : "Default Counter",
          printerName: kitchen_details["printer_name"] ? kitchen_details["printer_name"] : "Default Printer",
        });
      }
    }
  }

  for (const key of Object.keys(temp_item_obj)) {
    const obj = {};
    obj["type"] = "counter";
    obj["counterName"] = temp_kitchen_data[key][0]["counterName"];
    obj["printerName"] = temp_kitchen_data[key][0]["printerName"];
    obj["note"] = [];

    if (temp_kitchen_data[key][0]["kitchen_counter_id"] === "default") {
      obj["note"].push("Go to Sections & Counters on EasyEat Partner App to map these items to counters");
    } else if (temp_kitchen_data[key][0]["kitchen_counter_id"] === "default_override") {
      obj["note"].push("Counters set for these items are invalid & overriding the counters of their subcategories");
    }
    for (const note of order_details["special_notes"]) {
      if (note["note"].trim() && note["itr"] == key.split("_")[0]) {
        obj["note"].push(note["note"].trim());
      }
    }
    obj["allergic_items"] = order_details["allergic_items"];
    obj["body"] = {};
    obj["body"]["Type"] = getOrderTypeText(order_details["order_type"]);

    /*Exclude takeaway,pickup and null table_no or table_id from counter details*/
    if (!["", null, undefined].includes(order_details["table_no"]) && !["takeaway", "pickup"].includes(order_details["table_id"])) {
      obj["body"]["Table"] = order_details["table_no"].toString();
    }

    obj["body"]["Order"] = order_details["order_no"];
    // const get_date_time = this.getReceiptDataUtils.addDateTime(order_details, rest_details);
    // obj["body"]["Date"] = get_date_time["date"];
    // obj["body"]["Time"] = get_date_time["time"];

    if (pax_enabled === 1) {
      obj["body"]["Pax"] = order_details["pax"] ? order_details["pax"].toString() : "";
    }
    if (show_sname) {
      obj["body"]["Staff"] = order_details["sname"];
    }
    if (show_uname) {
      obj["body"]["Name"] = order_details["name"] ? order_details["name"] : "";
    }

    obj["items"] = temp_item_obj[key];

    let noOfItems = 0;
    for (const item of obj["items"]) {
      noOfItems += item["qty"];
    }
    obj["body"]["NUMBER OF ITEMS"] = noOfItems.toString();
  }

  return convertCounterObj(obj);
}

module.exports = { generateBillReceipt, generateCounterReceipt };

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
