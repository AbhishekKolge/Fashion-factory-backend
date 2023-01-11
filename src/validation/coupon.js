const Joi = require("joi").extend(require("@joi/date"));

const createCouponSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    type: Joi.string().valid("PERCENTAGE", "FIXED").optional(),
    amount: Joi.number().required(),
    code: Joi.string().min(3).max(10).required(),
    startTime: Joi.date()
      .greater(Date.now())
      .optional()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code === "date.greater") {
            err.message = "Start time already passed";
          }
        });
        return errors;
      }),
    expiryTime: Joi.date()
      .greater(Date.now())
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code === "date.greater") {
            err.message = "Expiry time already passed";
          }
        });
        return errors;
      }),
    valid: Joi.boolean().optional(),
    maxRedemptions: Joi.number().integer().min(1).required(),
  });

  req.schema = schema;

  next();
};

const updateCouponSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    expiryTime: Joi.date()
      .greater(Date.now())
      .optional()
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code === "date.greater") {
            err.message = "Expiry time already passed";
          }
        });
        return errors;
      }),
    valid: Joi.boolean().optional(),
    maxRedemptions: Joi.number().integer().min(1).optional(),
  });

  req.schema = schema;

  next();
};

const deleteCouponSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  deleteCouponSchema,
};
