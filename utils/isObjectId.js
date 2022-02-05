const mongoose = require("mongoose");

module.exports = (id) => mongoose.isValidObjectId(id);
