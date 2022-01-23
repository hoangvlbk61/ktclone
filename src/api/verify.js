const {Router} = require('express');
const bcrypt = require('bcrypt');

const User = require('../persistence/users');

const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {email, password} = request.body;
    const user = await User.find(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(403).json({});
    }
    response.status(200).json();
  } catch (error) {
    console.error(
      `POST verify ({ email: ${request.body.email} }) >> ${error.stack})`
    );
    response.status(500).json();
  }
});

module.exports = router;
