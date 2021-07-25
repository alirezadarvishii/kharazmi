const fs = require("fs");
module.exports = (path) => fs.unlinkSync(path);
