const bcrypt = require("bcryptjs");
const validator = require("validator");

const CustomError = require("../errors");
const customUtils = require("../utils");

class User {
  constructor(model) {
    this.model = model;
  }

  compareVerificationToken(token) {
    const isMatch = this.model.verificationToken === token;
    if (!isMatch)
      throw new CustomError.UnauthenticatedError("Verification failed");
  }

  checkPasswordTokenValidity() {
    const isExpired = customUtils.checkTimeExpired(
      this.model.passwordTokenExpiration
    );

    if (!isExpired && this.model.passwordToken) {
      throw new CustomError.ConflictError("Password reset link already sent");
    }
  }

  verifyPasswordToken(passwordToken) {
    const isExpired = customUtils.checkTimeExpired(
      this.model.passwordTokenExpiration
    );
    if (isExpired) {
      throw new CustomError.UnauthenticatedError(
        "Password reset link has expired"
      );
    }

    const isMatch = this.model.passwordToken === passwordToken;
    if (!isMatch) {
      throw new CustomError.UnauthenticatedError("Verification failed");
    }
  }

  async comparePassword(password) {
    const isMatch = await bcrypt.compare(password, this.model.password);
    if (!isMatch) {
      throw new CustomError.UnauthenticatedError(
        "Please provide valid credentials"
      );
    }
  }

  async encryptPassword() {
    const isPasswordStrong = validator.isStrongPassword(this.model.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isPasswordStrong) {
      throw new CustomError.BadRequestError("Please provide strong password");
    }

    const salt = await bcrypt.genSalt(10);
    this.model.password = await bcrypt.hash(this.model.password, salt);

    return this.model;
  }

  checkAdmin() {
    if (this.model.role !== "ADMIN") {
      throw new CustomError.UnauthenticatedError(
        "Not an admin, not authorized"
      );
    }

    if (!this.model.authorized) {
      throw new CustomError.UnauthorizedError(
        "Please contact supervisor for login access"
      );
    }
  }

  checkUser() {
    if (this.model.role !== "BASIC") {
      throw new CustomError.UnauthenticatedError("Not a user, not authorized");
    }
  }

  checkAuthorized() {
    if (this.model.status !== "ACTIVE") {
      throw new CustomError.UnauthenticatedError(
        "Account has been locked by admin"
      );
    }
  }
}

module.exports = User;
