const Joi = require("joi");

const createCategorySchema = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().max(20).min(3).required(),
  });

  req.schema = schema;

  next();
};

const updateCategorySchema = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().max(20).min(3).required(),
  });

  req.schema = schema;

  next();
};

const deleteCategorySchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
};
