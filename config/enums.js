const ReceiptType = {
  STICKER_PRINTER: 'sticker_printer',
};
const SlipType = {
  BILL: 'bill',
  COUNTER: 'counter',
  MASTER_ORDER_LIST: 'master_order_list',
  MASTER_DOCKET: 'master_docket',
  TABLE_CHANGE: 'table_change',
  CASH_IN_OUT: 'cash_in_out',
  CASH_MGT_REPORT: 'cash_mgt_report',
};
const FormatType = {
  RECEIPT: 'bill_receipt',
  COUNTER: 'counter_receipt',
  VOID_CANCEL_COUNTER: 3,
  TABLE_TRANSFER: 4,
  MASTER: 5,
  VOID_MASTER: 6,
  DECLINE_MASTER: 7,
};
const AddonVariantNameEnum = {
  ADDON: 'ADDON',
  VARIANT: 'VARIANT',
};

const AddonVariantBitEnum = {
  ADDON: 1,
  VARIANT: 2,
};

const AddonVariantReceiptEnum = {
  RECEIPT: 'bill',
  OTHER: 'other',
};

const PrintSection = {
  HEADER: 'h',
  FOOTER: 'f',
};

const ToShow = {
  SHOW: 1,
  HIDE: 0,
};

const ForOrderType = {
  DINEIN: 1,
  DELIVERY: 2,
  TAKEAWAY: 4,
  ALL: 7,
};

const PrintLanguage = {
  DEFAULT: 'en-US',
  INDONESIA: 'id-ID',
};

const FontType = {
  BOLD: 'b',
  NORMAL: 'n',
  ITALIC: 'i',
};

const FontSize = {
  SMALL: 's',
  MEDIUM: 'm',
  LARGE: 'l',
};

const FontAlign = {
  LEFT: 'l',
  RIGHT: 'r',
  CENTER: 'c',
};

const CountryMapping = {
  MALAYSIA: {
    country: 'Malaysia',
    country_code: 'MY',
    currency_code: 'MYR',
    currency_symbol: 'RM',
    locale: 'ms-MY',
    language: 'en-US',
    base_roundoff: 0.05,
  },
  INDONESIA: {
    country: 'Indonesia',
    country_code: 'ID',
    currency_code: 'IDR',
    currency_symbol: 'Rp',
    locale: 'id-ID',
    language: 'id-ID',
    base_roundoff: 100,
  },
};

/* key names in printing */
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

module.exports = {
  ReceiptType,
  SlipType,
  FormatType,
  AddonVariantNameEnum,
  AddonVariantBitEnum,
  AddonVariantReceiptEnum,
  PrintSection,
  ToShow,
  ForOrderType,
  PrintLanguage,
  KeyName,
  FontType,
  FontSize,
  FontAlign,
  CountryMapping,
};
