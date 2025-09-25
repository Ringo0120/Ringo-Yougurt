class Member {
  constructor({
    memberId,
    lineId,
    memberName,
    phone,
    createAt = new Date(),
    remainDelivery = 13,
    remainVolume = 0,
    remainFreeQuota = 0,
    orderType = "",
    paymentStatus = "UNPAID",
    balance = 17160,
    validMember = false,
    bankAccount = "",
  }) {
    this.memberId = memberId;
    this.lineId = lineId;
    this.memberName = memberName;
    this.phone = phone;
    this.createAt = createAt;
    this.remainDelivery = remainDelivery;
    this.remainVolume = remainVolume;
    this.remainFreeQuota = remainFreeQuota;
    this.orderType = orderType;
    this.paymentStatus = paymentStatus;
    this.balance = balance;
    this.validMember = validMember;
    this.bankAccount = bankAccount;
  }
}

module.exports = Member;
