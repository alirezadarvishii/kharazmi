const Joi = require("joi");
const httpStatus = require("http-status");

const ApiError = require("../errors/ApiError");
const pick = require("../utils/pick");

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body", "files"]);
  const object = pick(req, Object.keys(validSchema));

  const result = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (result.error) {
    const errorMessage = result.error.details
      .map((details) => details.message)
      .join(", ");
    throw new ApiError({
      statusCode: httpStatus.BAD_REQUEST,
      code: httpStatus[400],
      message: errorMessage,
      redirectionPath: "back",
    });
  }
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(req, result.value);
  next();
};

module.exports = validate;
