const Joi = require("joi");

const createSizeSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    value: Joi.number().required(),
  });

  req.schema = schema;

  next();
};

const updateSizeSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    value: Joi.number().required(),
  });

  req.schema = schema;

  next();
};

const deleteSizeSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  createSizeSchema,
  updateSizeSchema,
  deleteSizeSchema,
};
