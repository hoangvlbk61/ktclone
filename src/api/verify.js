const {Router} = require('express');
const bcrypt = require('bcrypt');

const User = require('../persistence/users');
const Session = require('../persistence/sessions');

const router = new Router();
const headerMiddleware = require("../middleware/header-middleware"); 
router.use(headerMiddleware);

router.post('/', async (request, response) => {
  try {
console.log("requestData.cookies", request.cookies);    
console.log("request.headers", request.headers);
    console.log("request.session", request.session);
    let ssid = request.headers.ssid || request.session.id; 
    const session = await Session.find(ssid);
    if(!session)  
    return response.status(403).json({});
    const userId = session.userId;
    const user = await User.findById(userId);
    if(user.password) delete user.password;
    response.status(200).json(user);
  } catch (error) {
    console.error(
      `POST verify ({  }) >> ${error.stack})`
    );
    response.status(500).json();
  }
});

module.exports = router;
