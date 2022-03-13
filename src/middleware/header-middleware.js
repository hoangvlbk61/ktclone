const headerMiddleware = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN || "http://localhost:3002");
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
