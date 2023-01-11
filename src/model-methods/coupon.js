const CustomError = require("../errors");
const customUtils = require("../utils");

class Coupon {
  constructor(model) {
    this.model = model;
  }

  checkCouponExpired() {
    if (new Date(this.model.expiryTime).getTime() < Date.now()) {
      throw new CustomError.BadRequestError("Coupon expired");
    }
  }

  canUpdateMaxRedemption(maxRedemptions) {
    if (maxRedemptions < this.model.totalRedemptions) {
      throw new CustomError.BadRequestError(
        `Total redemptions already passed ${maxRedemptions} redemptions`
      );
    }
  }
}

module.exports = Coupon;
