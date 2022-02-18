const pmt = {
  cash: "Cash",

  // offline cards
  offline_mastercard: "Offline Master Card",
  offline_visa: "Offline Visa",
  offline_american_express: "Offline American Express",
  offline_debit_card: "Offline Debit Card",

  // offline wallets
  offline_boost: "Offline Boost",
  offline_grabpay: "Offline Grab Pay",
  offline_bigpay: "Offline Big Pay",
  "offline_mb2u_qrpay-push": "Offline Maybank QRPay",
  "offline_tng-ewallet": "Offline Touch n Go",
  offline_fpanda_settle: "FoodPanda Settlement",
  offline_grab_settle: "GrabFood Settlement",
  offline_shopee_pay: "Offline Shopee Pay",
  offline_wct_buddy: "Wct Buddy",
  offline_sunway_pals: "Sunway Pals",
  offline_canton_payment: "Canton2u Payment",
  offline_shopee_food: "Offline Shopee Food",
  offline_staff: "Staff",
  offline_lazada_pay: "Offline Lazada Pay",
  offline_klook_pay: "Offline Klook Pay",
  offline_oddle: "Offline Oddle",
  offline_hungry2u: "Offline Hungry2U",
  offline_online_pay: "Online Banking (FPX)",
  offline_fave_pay: "Offline Fave Pay",
  offline_eatigo: "Offline Eatigo",
  offline_teleport: "Offline Teleport",
  offline_deliver_eat: "DeliverEat Settlement",
  offline_aliments: "Aliments Settlement",
  offline_entertainment: "Entertainment",
  offline_olarme: "OlarMe Settlement",
  offline_snailer: "Snailer Settlement",
  offline_eatmol: "Eatmol Settlement",
  offline_airasia_food: "AirAsia Food Settlement",
  offline_zesty_clickz: "Zesty Clickz Settlement",
  offline_mulaeats: "Mulaeats Settlement",
  offline_meniaga: "Meniaga Settlement",
  offline_easi_eats: "Easi Eats Settlement",
  offline_dine_by_wix: "Dine by Wix Settlement",
  offline_add_to_room: "Add to Room Charges",
  offline_bonuslink: "Offline Bonuslink",
  offline_delivery_partner: "Delivery Partner (Bank Deposit)",
  offline_online_bank_transfer: "Online Bank Transfer",
  offline_no_payment_required: "No Payment Required",
  offline_website_stripe: "Website(Stripe)",
  offline_z_city: "Z-City",
  offline_lazada_voucher: "Lazada Voucher",
  offline_shopee_voucher: "Shopee Voucher",
  offline_klook_voucher: "Klook Voucher",
  offline_fave_voucher: "Fave Voucher",
  offline_setia_voucher: "Setia Voucher",
  offline_beepit: "Beepit Settlement",
  offline_others: "Others",
  offline_voucher: "Voucher",
  offline_union_experience_voucher: "Union Experience",
  offline_revenue_monster: "Revenue Monster",
  offline_ghl: "GHL",
  offline_wct: "WCT",

  // cards
  credit: "Credit Card",
  debit: "Debit Card",

  // wallets
  boost: "Boost",
  grabpay: "Grab Pay",
  shopeepay: "ShopeePay",
  "mb2u_qrpay-push": "Maybank QRPay",
  "tng-ewallet": "Touch n Go",
  user_credits: "User Credits",
  loyalty_cashback: "Loyalty Cashback",

  // net-banking
  fpx_amb: "Am Bank",
  fpx_bimb: "Bank Islam",
  fpx_cimbclicks: "CIMB Bank",
  cimbclicks: "CIMB Bank",
  fpx_hlb: "Hong Leong Bank",
  fpx_mb2u: "Maybank",
  fpx_pbb: " Bank",
  fpx_rhb: "RHB Bank",
  fpx_ocbc: "OCBC Bank",
  fpx_scb: "Standard Chartered Bank",
  fpx_abb: "Affin Bank Berhad",
  fpx_abmb: "Alliance Bank",
  fpx_uob: "United Overseas bank",
  fpx_bsn: "Bank Simpanan Nasional",
  fpx_kfh: "Kuwait Finance House",
  fpx_bkrm: "Kerjasama Rakyat Malaysia",
  fpx_bmmb: "Bank Muamalat",
  fpx_hsbc: "HSBC",
};

class PaymentConfig {
  constructor(pmt) {
    this.pmt = pmt;
  }

  getOnlineWalletList() {
    return ["boost", "grabpay", "shopeepay", "tng-ewallet", "mb2u_qrpay-push", "loyalty_cashback", "user_credits"];
  }

  getNetbankingList() {
    return [
      "fpx_amb",
      "fpx_bimb",
      "fpx_cimbclicks",
      // 'cimbclicks',
      "fpx_hlb",
      "fpx_mb2u",
      "fpx_pbb",
      "fpx_rhb",
      "fpx_ocbc",
      "fpx_scb",
      "fpx_abb",
      "fpx_abmb",
      "fpx_uob",
      "fpx_bsn",
      "fpx_kfh",
      "fpx_bkrm",
      "fpx_bmmb",
      "fpx_hsbc",
    ];
  }

  getCreditCardList() {
    return ["credit"];
  }

  getOfflineWalletList() {
    return [
      "offline_boost",
      "offline_grabpay",
      "offline_bigpay",
      "offline_mb2u_qrpay-push",
      "offline_tng-ewallet",
      "offline_fpanda_settle",
      "offline_grab_settle",
      "offline_shopee_pay",
      "offline_wct_buddy",
      "offline_sunway_pals",
      "offline_canton_payment",
      "offline_lazada_pay",
      "offline_klook_pay",
      "offline_oddle",
      "offline_hungry2u",
      "offline_online_pay",
      "offline_fave_pay",
      "offline_eatigo",
      "offline_teleport",
      "offline_deliver_eat",
      "offline_aliments",
      "offline_entertainment",
      "offline_olarme",
      "offline_snailer",
      "offline_eatmol",
      "offline_airasia_food",
      "offline_zesty_clickz",
      "offline_mulaeats",
      "offline_meniaga",
      "offline_easi_eats",
      "offline_dine_by_wix",
      "offline_add_to_room",
      "offline_bonuslink",
      "offline_delivery_partner",
      "offline_online_bank_transfer",
      "offline_no_payment_required",
      "offline_website_stripe",
      "offline_z_city",
      "offline_lazada_voucher",
      "offline_shopee_voucher",
      "offline_klook_voucher",
      "offline_fave_voucher",
      "offline_setia_voucher",
      "offline_beepit",
      "offline_others",
      "offline_voucher",
      "offline_union_experience_voucher",
      "offline_revenue_monster",
      "offline_ghl",
      "offline_wct",
    ];
  }

  getOfflineCreditCardList() {
    return ["offline_mastercard", "offline_visa", "offline_american_express", "offline_debit_card"];
  }

  /* Get online payment methods excluding netbanking */
  getOnlinePmtMethods() {
    return [...this.getOnlineWalletList(), ...this.getCreditCardList()];
  }

  /* Get all online payment methods */
  getAllOnlinePmtMethods() {
    return [...this.getNetbankingList(), ...this.getOnlineWalletList(), ...this.getCreditCardList()];
  }

  /* Get all offline payment methods */
  getOfflinePmtMethods() {
    return ["cash", ...this.getOfflineCreditCardList(), ...this.getOfflineWalletList()];
  }
}

/* Get payment_method from payment_channel */
const getPmtMethodName = (pmt_channel) => {
  return pmt[pmt_channel] ? pmt[pmt_channel] : pmt_channel;
};

/* Get payment_channel-payment_method mapping obj */
const getPmtMethods = (type) => {
  const pmtConfig = new PaymentConfig(pmt);
  const obj = {};
  const pmt_obj = pmtConfig.pmt;
  let pmt_channels = [];

  // 1:cash
  if (type.includes(1)) {
    pmt_channels.push("cash");
  }
  // 2:wallets
  if (type.includes(2)) {
    pmt_channels = pmt_channels.concat(pmtConfig.getOnlineWalletList());
  }
  // 3:cards
  if (type.includes(3)) {
    pmt_channels = pmt_channels.concat(pmtConfig.getCreditCardList());
  }
  // 4:Netbanking
  if (type.includes(4)) {
    pmt_channels = pmt_channels.concat(pmtConfig.getNetbankingList());
  }
  // 5:offline wallets
  if (type.includes(5)) {
    pmt_channels = pmt_channels.concat(pmtConfig.getOfflineWalletList());
  }
  // 6:offline cards
  if (type.includes(6)) {
    pmt_channels = pmt_channels.concat(pmtConfig.getOfflineCreditCardList());
  }
  for (const channel of pmt_channels) {
    obj[channel] = pmt_obj[channel];
  }
  return obj;
};

module.exports = {
  getPmtMethodName,
  getPmtMethods,
  PaymentConfig,
};
