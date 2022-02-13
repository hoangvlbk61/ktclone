const Session = require("../persistence/sessions");
const User = require("../persistence/users");

const ByPassUrl = [
  { path: "/verify", method: "post" },
  { path: "", method: "get" },
  { path: "/api/sessions", method: "post" },
  { path: "/api/users", method: "post" },
];

const sessionMiddleware = async (request, response, next) => {
  let ssid = request.headers.ssid || request.session.id;
  if (!ssid) {
    // Bypass default path
    const path = request.path;
    const method = request.method;
    if (
      ByPassUrl.some(
        (bpu) => bpu.path === path && bpu.method === method.toLowerCase()
      )
    ) {
      return next();
    }
    return response.sendStatus(401);
  }

  try {
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const session = await Session.find(ssid);
    let user = null;
    if (!session) {
      // Bypass default path
      const path = request.path;
      const method = request.method;
      if (
        ByPassUrl.some(
          (bpu) => bpu.path === path && bpu.method === method.toLowerCase()
        )
      ) {
        return next();
      }
      ssid = null;
      return response.sendStatus(401);
    } else {
      user = await User.findById(session.userId);
    }
    request.userId = session.userId;
    if(user) request.is_admin = user.is_admin;
    next();
  } catch (error) {
    console.error(`SessionMiddleware(${ssid}) >> Error: ${error.stack}`);
    return response.sendStatus(500);
  }
};

module.exports = sessionMiddleware;
