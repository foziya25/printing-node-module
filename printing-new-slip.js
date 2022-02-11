const { FontAlign, FontSize, FontType, SlipType, changeFontSize, powered_by, formatv2, line_break, insertOrderSequence, insertHeaders, addItems } = require("./utils/printing-v2-utils.js");

function convertReceiptObj(obj, rest_details) {
  const is_unpaid = obj["order"]["bill"].some((e) => e["name"] === "Payment Mode" && e["value"] === "Unpaid");
  const pmt_status = is_unpaid ? "* UNPAID *" : "* PAID *";
  //const split_addon_variant = getReceiptDataUtils.getSettingVal(rest_details, "split_addon_variant");
  const data = {};
  data["type"] = obj["type"];
  data["ptr_name"] = obj["printerName"];
  data["p_width"] = "72";
  data["data"] = [];
  if (obj["logo"]) {
    data["data"].push(formatv2("_img_", obj["logo"]));
  }
  if (obj["header"].length > 0) {
    for (const item of obj["header"]) {
      data["data"].push(formatv2("", [{ name: item.toUpperCase() }], undefined, FontType.BOLD, FontAlign.CENTER));
    }
  }
  data["data"].push(line_break());
  data["data"].push(formatv2("", [{ name: pmt_status }], undefined, FontType.BOLD, FontAlign.CENTER));
  data["data"].push(line_break());
  if (obj["body"]["Order_seq"]) {
    data["data"].push(insertOrderSequence(obj["body"]["Order_seq"]));
    data["data"].push(line_break());
  }
  const keys = ["Invoice", "NUMBER OF ITEMS", "Date", "Time", "Table", "Payment Type"];
  insertHeaders(obj, keys).forEach((value) => {
    data["data"].push(value);
  });

  data["data"].push(line_break());
  console.log(obj["body"]["Type"]);
  data["data"].push(
    formatv2(
      "",
      [
        {
          name: obj["body"]["Type"].toUpperCase(),
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER
    )
  );
  data["data"].push(line_break());
  const cust_detail_keys = ["Name", "Mob"];
  insertHeaders(obj, cust_detail_keys).forEach((value) => {
    data["data"].push(value);
  });

  data["data"].push(line_break());
  data["data"].push(
    formatv2("", [
      { name: "QTY", fw: 6, fa: FontAlign.LEFT },
      { name: "ITEM NAME", fa: FontAlign.LEFT },
      { name: "AMOUNT", fw: 10, fa: FontAlign.RIGHT },
    ])
  );
  data["data"].push(line_break());
  for (const item of obj["order"]["items"]) {
    data["data"].push(
      formatv2("", [
        { name: item["qty"].toString(), fw: 6, fa: FontAlign.LEFT },
        { name: item["name"].toUpperCase(), fa: FontAlign.LEFT },
        { name: "RM " + Number(item["amount"]).toFixed(2), fw: 10, fa: FontAlign.RIGHT },
      ])
    );
    if (item["combo_name"] && item["combo_name"].trim()) {
      data["data"].push(formatv2("", [{ name: "", fw: 6, fa: FontAlign.LEFT }, { name: `${item["combo_name"].toUpperCase()}` }, { name: "", fw: 10, fa: FontAlign.RIGHT }]));
    }
    if (item["addon"] && item["addon"].trim()) {
      data["data"].push(formatv2("", [{ name: "", fw: 6, fa: FontAlign.LEFT }, { name: `ADDON: ${item["addon"].toUpperCase()}` }, { name: "", fw: 10, fa: FontAlign.RIGHT }]));
    }

    if (item["variant"] && item["variant"].trim()) {
      data["data"].push(formatv2("", [{ name: "", fw: 6, fa: FontAlign.LEFT }, { name: `VARIANT: ${item["variant"].toUpperCase()}` }, { name: "", fw: 10, fa: FontAlign.RIGHT }]));
    }
    if (item["note"] && item["note"].trim()) {
      data["data"].push(formatv2("", [{ name: "", fw: 6, fa: FontAlign.LEFT }, { name: `NOTE: ${item["note"].toUpperCase()}` }, { name: "", fw: 10, fa: FontAlign.RIGHT }]));
    }
    if (item["item_discount"]) {
      data["data"].push(formatv2("", [{ name: "", fw: 6, fa: FontAlign.LEFT }, { name: `ITEM DISCOUNT: RM ${item["item_discount"].toFixed(2)}` }, { name: "", fw: 10, fa: FontAlign.RIGHT }]));
    }
  }
  data["data"].push(line_break());
  for (const bill of obj["order"]["bill"]) {
    if (bill["name"] == "Total") {
      data["data"].push(line_break());
      data["data"].push(
        formatv2("", [
          { name: bill["name"].toUpperCase() + ": ", ft: FontType.BOLD },
          {
            name: bill["name"] != "Transaction ID" && (Number(bill["value"]) || Number(bill["value"]) == 0) ? obj["order"]["currency"] + " " + Number(bill["value"]).toFixed(2) : bill["value"],
            fw: bill["name"] != "Transaction ID" && (Number(bill["value"]) || Number(bill["value"]) == 0) ? 11 : bill["value"].length,
            ft: FontType.BOLD,
            fa: FontAlign.RIGHT,
          },
        ])
      );
      data["data"].push(line_break());
    } else if (bill["name"] == "Transaction ID") {
      data["data"].push(
        formatv2("", [
          { name: "TXN ID" + ": ", ft: FontType.BOLD },
          {
            name: bill["name"] != "Transaction ID" && (Number(bill["value"]) || Number(bill["value"]) == 0) ? obj["order"]["currency"] + " " + Number(bill["value"]).toFixed(2) : bill["value"],
            fw: bill["name"] != "Transaction ID" && (Number(bill["value"]) || Number(bill["value"]) == 0) ? 11 : bill["value"].length,
            ft: FontType.BOLD,
            fa: FontAlign.RIGHT,
          },
        ])
      );
    } else {
      data["data"].push(
        formatv2("", [
          { name: bill["name"].toUpperCase() + ": " },
          {
            name: bill["name"] != "Transaction ID" && (Number(bill["value"]) || Number(bill["value"]) == 0) ? obj["order"]["currency"] + " " + Number(bill["value"]).toFixed(2) : bill["value"],
            fw: bill["name"] != "Transaction ID" && (Number(bill["value"]) || Number(bill["value"]) == 0) ? 11 : bill["value"].length,
            ft: FontType.BOLD,
            fa: FontAlign.RIGHT,
          },
        ])
      );
    }
  }

  if (obj["footer"]) {
    data["data"].push(line_break());
    data["data"].push(formatv2("", [{ name: obj["footer"].toString() }]));
  }

  data["data"].push(line_break());
  data["data"].push(powered_by());
  const slip_font = rest_details["settings"]["print"]["slip_font"] ? rest_details["settings"]["print"]["slip_font"] : {};
  const options = { slip_font: null };
  options.slip_font = slip_font[SlipType.BILL];
  return changeFontSize(data, options);
}
// Convert old counter format to new format
function convertCounterObj(obj, options) {
  const data = {};

  data["type"] = obj["type"];
  data["ptr_name"] = obj["printerName"];
  data["p_width"] = "72";
  data["data"] = [];
  data["data"].push(
    formatv2(
      "",
      [
        {
          name: obj["counterName"].toUpperCase(),
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER
    )
  );
  data["data"].push(line_break());
  data["data"].push(
    formatv2(
      "",
      [
        {
          name: obj["body"]["Type"].toUpperCase(),
        },
      ],
      undefined,
      FontType.BOLD,
      FontAlign.CENTER
    )
  );
  data["data"].push(line_break());
  if (obj["body"]["Order_seq"]) {
    data["data"].push(insertOrderSequence(obj["body"]["Order_seq"]));
    data["data"].push(line_break());
  }
  const keys = ["Invoice", "Date", "Time", "Pax", "Staff", "Name", "Table", "Old Table", "NUMBER OF ITEMS"];
  insertHeaders(obj, keys).forEach((value) => {
    data["data"].push(value);
  });

  data["data"].push(line_break());
  const item_arr = addItems(obj["items"]);

  for (const item of item_arr) {
    data["data"].push(item);
  }
  if (obj["note"] && obj["note"].length > 0) {
    data["data"].push(line_break());
    data["data"].push(
      formatv2(
        "",
        [
          {
            name: "NOTES",
          },
        ],
        undefined,
        FontType.BOLD,
        FontAlign.CENTER
      )
    );
    data["data"].push(line_break());
    for (const note of obj["note"]) {
      if (note && note.trim()) {
        data["data"].push(formatv2("", [{ name: note.toUpperCase() }]));
      }
    }
  }

  if (obj["allergic_items"].length > 0) {
    data["data"].push(line_break());
    data["data"].push(
      formatv2(
        "",
        [
          {
            name: "ALLERGIES",
          },
        ],
        undefined,
        FontType.BOLD,
        FontAlign.CENTER
      )
    );
    data["data"].push(line_break());
    data["data"].push(
      formatv2("", [
        {
          name: obj["allergic_items"].join(", ").toUpperCase(),
          ft: FontType.BOLD,
          fa: FontAlign.CENTER,
        },
      ])
    );
  }

  data["data"].push(line_break());
  data["data"].push(powered_by());
  return changeFontSize(data, options);
}
module.exports = {
  convertReceiptObj,
};
