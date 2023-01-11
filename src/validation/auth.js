const Joi = require("joi").extend(require("@joi/date"));
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);
const joiContactNo = Joi.extend(require("joi-phone-number"));

const registerSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().trim().max(20).min(3).required(),
    lastName: Joi.string().trim().allow("", null).max(20).optional(),
    contactNo: joiContactNo.string().min(10).max(12).phoneNumber().required(),
    email: Joi.string().trim().email().required(),
    password: joiPassword
      .string()
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  req.schema = schema;

  next();
};

const verifySchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    token: Joi.string().required(),
  });

  req.schema = schema;

  next();
};

const forgotPasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
  });

  req.schema = schema;

  next();
};

const resetPasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    token: Joi.string().required(),
    password: joiPassword
      .string()
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  req.schema = schema;

  next();
};

const loginSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: joiPassword
      .string()
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  req.schema = schema;

  next();
};

const logoutSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
  logoutSchema,
};
