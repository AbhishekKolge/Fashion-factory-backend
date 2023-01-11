const Joi = require("joi");

const createProductSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    price: Joi.number().min(100).required(),
    discount: Joi.string().valid("PERCENTAGE", "FIXED").optional(),
    discountAmount: Joi.number().optional(),
    sizes: Joi.string().required(),
    categoryId: Joi.string().required(),
    featured: Joi.boolean().optional(),
    color: Joi.string().required(),
    description: Joi.string().max(500).required(),
    inventory: Joi.number().integer().optional(),
  });

  req.schema = schema;

  next();
};

const updateProductSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(50).optional(),
    price: Joi.number().min(100).optional(),
    discount: Joi.string().valid("PERCENTAGE", "FIXED").optional(),
    discountAmount: Joi.number().optional(),
    sizes: Joi.string().optional(),
    categoryId: Joi.string().optional(),
    featured: Joi.boolean().optional(),
    color: Joi.string().optional(),
    description: Joi.string().max(500).optional(),
    inventory: Joi.number().integer().optional(),
  });

  req.schema = schema;

  next();
};

const deleteProductSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
};
