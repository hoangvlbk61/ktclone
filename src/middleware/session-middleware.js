const Session = require("../persistence/sessions");

const ByPassUrl = [
  { path: "/verify", method: "post" },
  { path: "", method: "get" },
  { path: "/api/sessions", method: "post" },
  { path: "/api/users", method: "post" },
];

const sessionMiddleware = async (request, response, next) => {
  const ssid = request.session.id || request.headers.ssid;
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
    if (!session) {
      ssid = null;
      return response.sendStatus(401);
    }

    request.userId = session.userId;
    next();
  } catch (error) {
    console.error(`SessionMiddleware(${ssid}) >> Error: ${error.stack}`);
    return response.sendStatus(500);
  }
};

module.exports = sessionMiddleware;
