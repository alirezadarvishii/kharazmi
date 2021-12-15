module.exports = (req, res, next) => {
    const { query } = req;
    const queryKeys = Object.keys(query);
    queryKeys.forEach((key) => {
      if (query[key] === "all" || query[key] === "") delete query[key];
    });
    next();
  };
  