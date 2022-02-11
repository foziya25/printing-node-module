const SlipType = {
  BILL: "bill",
  COUNTER: "counter",
  MASTER_ORDER_LIST: "master_order_list",
  MASTER_DOCKET: "master_docket",
  TABLE_CHANGE: "table_change",
  CASH_IN_OUT: "cash_in_out",
  CASH_MGT_REPORT: "cash_mgt_report",
};

const FontSize = {
  SMALL: "s",
  MEDIUM: "m",
  LARGE: "l",
};

const FontType = {
  BOLD: "b",
  NORMAL: "n",
  ITALIC: "i",
};

const FontAlign = {
  LEFT: "l",
  RIGHT: "r",
  CENTER: "c",
};

// To format old next in new format
const formatv2 = (key = "", value, fs = FontSize.SMALL, ft = FontType.NORMAL, fa = FontAlign.LEFT) => {
  return {
    key: key,
    value: value,
    fs: fs,
    ft: ft,
    fa: fa,
  };
};
// Use to insert line break
function line_break(value = "-") {
  return { key: "_line_", value: value };
}

/* Function to insert order sequence in all receipts  */
const insertOrderSequence = (order_seq) => {
  return formatv2("", [{ name: `ORDER: #${order_seq}` }], undefined, FontType.BOLD, FontAlign.CENTER);
};

const powered_by = () => {
  return {
    key: "",
    value: "POWERED BY - EASYEAT.AI",
    fs: FontSize.SMALL,
    ft: FontType.BOLD,
    fa: FontAlign.CENTER,
  };
};

/* Set font size for entire slip */
function changeFontSize(obj, options) {
  const slip_font = options && options.slip_font ? options.slip_font : null;
  if (slip_font === FontSize.MEDIUM) {
    for (const item of obj["data"]) {
      if (item.fs) {
        item.fs = item.fs === FontSize.SMALL ? FontSize.MEDIUM : item.fs === FontSize.MEDIUM ? FontSize.LARGE : item.fs;
      }
    }
  } else if (slip_font === FontSize.LARGE) {
    for (const item of obj["data"]) {
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
    if (Object.keys(obj["body"]).includes(key) && obj["body"][key] && obj["body"][key].toString().trim()) {
      toInsert.push(formatv2("", [{ name: `${key.toUpperCase()}: ${obj["body"][key].toString().toUpperCase()}` }]));
    }
  });
  return toInsert;
}

// Function to add items in printing config v2
function addItems(items) {
  const temp_arr = [];
  temp_arr.push(formatv2("", [{ name: "ITEM NAME" }, { name: "QTY", fw: 6, fa: FontAlign.RIGHT }]));
  temp_arr.push(line_break());
  for (const item of items) {
    const strike = item["strike"] && item["strike"] === 1 ? 1 : 0;
    if (item["name"] && item["name"].trim()) {
      temp_arr.push(
        formatv2("", [
          { name: item["name"].toUpperCase(), strike: strike },
          { name: item["qty"].toString(), fw: 6, fa: FontAlign.RIGHT, strike: strike },
        ])
      );
    }
    if (item["combo_name"] && item["combo_name"].trim()) {
      temp_arr.push(
        formatv2("", [
          { name: `${item["combo_name"].toUpperCase()}`, strike: strike },
          { name: "", fw: 6 },
        ])
      );
    }
    if (item["addon"] && item["addon"].trim()) {
      temp_arr.push(
        formatv2("", [
          { name: `${item["addon"].toUpperCase()}`, strike: strike },
          { name: "", fw: 6 },
        ])
      );
    }
    if (item["variant"] && item["variant"].trim()) {
      temp_arr.push(
        formatv2("", [
          { name: `${item["variant"].toUpperCase()}`, strike: strike },
          { name: "", fw: 6 },
        ])
      );
    }
    if (item["note"] && item["note"].trim()) {
      temp_arr.push(formatv2("", [{ name: `NOTE: ${item["note"].toUpperCase()}` }, { name: "", fw: 6 }]));
    }
  }
  return temp_arr;
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
};
