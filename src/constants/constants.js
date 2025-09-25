const BASIC_PRICE = 110;
const MONTHS = 12;
const BASIC_DELIVERY = MONTHS + 1;
const BASIC_DELIVERY_FEE = 160;
const BASIC_CUPS = 12;
const MINIMUM_CUPS = 6;

const PaymentStatus = {
  UNPAID: "未付款",
  PAID: "已付款",
};

module.exports = {
  BASIC_PRICE,
  MONTHS,
  BASIC_DELIVERY,
  BASIC_DELIVERY_FEE,
  BASIC_CUPS,
  MINIMUM_CUPS,
  PaymentStatus,
};
