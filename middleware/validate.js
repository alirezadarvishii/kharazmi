const pick = require("../utils/pick");

module.exports = (schema) => (req, res, next) => {
  const validate = schema.validate(req);
  const validFields = pick(validate.value, ["body", "params", "query"]);
  Object.assign(req, validFields.query);
  if (!validate.error) {
    next();
  } else {
    res.redirect("/");
  }
};
