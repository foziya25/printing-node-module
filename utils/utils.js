const { getPmtMethodName } = require("../classes/payment");

//Separate address to different lines
function separateAddress(orig_array, str, max_length = 30) {
  const string_array = str.split(",");
  let temp = "";
  for (let i = 0; i < string_array.length; i++) {
    if ((string_array[i] + temp).length < max_length) {
      if (temp == "") {
        temp = temp + "" + string_array[i];
      } else {
        temp = temp + "," + string_array[i];
      }
    } else {
      if (temp.substr(0, 1) == " ") {
        temp = temp.substr(1);
      }
      orig_array.push(temp);
      temp = string_array[i];
    }
  }
  if (temp != "") {
    if (temp.substr(0, 1) == " ") {
      temp = temp.substr(1);
    }
    orig_array.push(temp);
  }
  return orig_array;
}

// Get addons list
function getAddons(item) {
  const addons = item.addons && Array.isArray(item.addons) ? item.addons : [];
  if (addons.length == 0 && item.addons_name && item.addons_name != "") {
    const addons_list = item.addons_name.split(",").filter((e) => e.trim());
    addons_list.forEach((addon) => addons.push({ name: addon.trim() }));
  }
  return addons;
}

/* Return an array of only successful payments with payment channel name */
function getOnlySuccessfulPayments(payments_list) {
  const payments = [];
  for (const item of payments_list) {
    if (item["status"] === 1) {
      if (item["payment_channel"]) {
        item["payment_method"] = getPmtMethodName(item["payment_channel"]);
      } else {
        item["payment_channel"] = getPmtMethodName(item["payment_method"]);
        item["payment_method"] = item["payment_channel"];
      }
      payments.push(item);
    }
  }
  return payments;
}

/* Get order_type text */
const getOrderTypeText = (order_type) => {
  order_type = Number(order_type);
  const txt = order_type === 0 ? "Dine In" : order_type === 1 ? "Delivery" : order_type === 2 ? "Pickup" : "NA";
  return txt;
};

function unMappedItemMapping(items_list) {
  items_list.forEach((item) => {
    if (!item["kitchen_counter_id"] || !(item["kitchen_counter_id"] && item["kitchen_counter_id"].trim())) {
      item["kitchen_counter_id"] = "default";
    }
  });
  return items_list;
}

/* Code logic for combo items printing (counter objects)*/
function comboPrinting(item_obj, item, kc_id) {
  if (item["kitchen_counter_id"] && item["kitchen_counter_id"].includes(kc_id)) {
    item_obj["name"] = item["item_name"];
    item_obj["combo_name"] = "";
    item_obj["qty"] = item["item_quantity"];
    item_obj["addon"] = "";
    item_obj["variant"] = item["variation_name"] ? item["variation_name"] : "";
    item_obj["note"] = item["special_note"] ? item["special_note"] : "";
    for (const combo_item of item["combo_items"]) {
      if (!combo_item["kitchen_counter_id"] || (combo_item["kitchen_counter_id"] && combo_item["kitchen_counter_id"].includes(kc_id))) {
        item_obj["combo_name"] += item_obj["combo_name"] === "" ? `(${combo_item["quantity"]}) ${combo_item["item_name"]}` : `, (${combo_item["quantity"]}) ${combo_item["item_name"]}`;
      }
    }
  } else {
    item_obj["combo_name"] = "";
    for (const combo_item of item["combo_items"]) {
      if (!combo_item["kitchen_counter_id"] || (combo_item["kitchen_counter_id"] && combo_item["kitchen_counter_id"].includes(kc_id))) {
        item_obj["combo_name"] += item_obj["combo_name"] === "" ? `(${combo_item["quantity"]}) ${combo_item["item_name"]}` : `, (${combo_item["quantity"]}) ${combo_item["item_name"]}`;
      }
    }
    if (item_obj["combo_name"].trim()) {
      item_obj["name"] = "";
      item_obj["qty"] = item["item_quantity"];
      item_obj["addon"] = "";
      item_obj["variant"] = item["variation_name"] ? item["variation_name"] : "";
      item_obj["note"] = item["special_note"] ? item["special_note"] : "";
    }
  }
}

module.exports = {
  getOnlySuccessfulPayments,
  getAddons,
  separateAddress,
  getOrderTypeText,
  unMappedItemMapping,
  comboPrinting,
};

//console.log(formatv2("", [{ name: "saurabh" }]));
