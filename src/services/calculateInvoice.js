function calculateInvoiceAmount(remainingBalance, orderAmount, freeQuota) {
  if (remainingBalance < 0) return orderAmount;

  let start = remainingBalance;
  let end = remainingBalance - orderAmount + 1;

  let invoiceAmount = 0;

  let paidStart = Math.max(end, freeQuota + 1);
  let paidEnd = Math.min(start, Infinity);

  if (paidStart <= paidEnd) {
    invoiceAmount += paidEnd - paidStart + 1;
  }

  if (end < 1) {
    invoiceAmount += 1 - end;
  }

  return invoiceAmount;
}
module.exports = { calculateInvoiceAmount };
