class Order {
  constructor({
    orderId,
    memberId,
    orders,
    paymentMethod,
    recipient,
    address,
    desiredDate,
    deliveryFee = 0,
    tax = 0,
    totalFee = 0,
    invoice = 0,
    orderDate = new Date(),
    status = "待確認",
    deliverStatus = "備貨中"
  }) {
    this.orderId = orderId;
    this.memberId = memberId;
    this.orders = orders;
    this.paymentMethod = paymentMethod;
    this.recipient = recipient;
    this.address = address;
    this.desiredDate = desiredDate;
    this.deliveryFee = deliveryFee;
    this.tax = tax;
    this.totalFee = totalFee;
    this.invoice = invoice;
    this.orderDate = orderDate;
    this.status = status;
    this.deliverStatus = deliverStatus;
  }
}
module.exports = Order;
