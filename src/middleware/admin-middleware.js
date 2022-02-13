const Session = require("../persistence/sessions");
const User = require("../persistence/users");

const adminMiddleware = async (request, response, next) => {
  const is_admin = request.is_admin;
  if (is_admin) next();
  else
    return response
      .status(403)
      .json({ message: "This API for admin only, please do not try to acess" });
};

module.exports = adminMiddleware;
