const Joi = require("joi");

const createReviewSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(100).optional(),
  });

  req.schema = schema;

  next();
};

const updateReviewSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    rating: Joi.number().integer().min(1).max(5).optional(),
    comment: Joi.string().max(100).optional(),
  });

  req.schema = schema;

  next();
};

const deleteReviewSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
};
