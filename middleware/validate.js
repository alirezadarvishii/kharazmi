const Joi = require("joi");

const ErrorResponse = require("../utils/ErrorResponse");
const pick = require("../utils/pick");

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));

  const result = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (result.error) {
    const errorMessage = result.error.details
      .map((details) => details.message)
      .join(", ");
    throw new ErrorResponse(422, errorMessage, "back");
  }
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(req, result.value);
  next();
};

module.exports = validate;
