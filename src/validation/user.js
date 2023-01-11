const Joi = require("joi").extend(require("@joi/date"));
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);
const joiContactNo = Joi.extend(require("joi-phone-number"));

const uploadProfileImageSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

const removeProfileImageSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

const updateUserSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().trim().max(20).min(3).required(),
    lastName: Joi.string().trim().allow("", null).max(20).optional(),
    contactNo: joiContactNo.string().min(10).max(12).phoneNumber().required(),
    gender: Joi.string().valid("MALE", "FEMALE").allow(null).optional(),
    dob: Joi.date().allow(null).optional(),
  });

  req.schema = schema;

  next();
};

const deleteUserSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

const updateUserStatusSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    status: Joi.string().valid("ACTIVE", "LOCKED").optional(),
    authorized: Joi.boolean().optional(),
  });

  req.schema = schema;

  next();
};

module.exports = {
  uploadProfileImageSchema,
  removeProfileImageSchema,
  updateUserSchema,
  deleteUserSchema,
  updateUserStatusSchema,
};
