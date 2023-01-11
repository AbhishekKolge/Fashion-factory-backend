const Joi = require("joi");

const createReturnReasonSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().max(50).min(5).required(),
  });

  req.schema = schema;

  next();
};

const updateReturnReasonSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().max(50).min(5).required(),
  });

  req.schema = schema;

  next();
};

const deleteReturnReasonSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  createReturnReasonSchema,
  updateReturnReasonSchema,
  deleteReturnReasonSchema,
};
