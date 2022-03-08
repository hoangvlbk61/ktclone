const headerMiddleware = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://mfast.asia");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};
module.exports = headerMiddleware;
