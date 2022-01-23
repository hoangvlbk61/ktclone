const express = require('express');

const {Router} = express;
const router = new Router();

const user = require('./user');
const session = require('./session');
const task = require('./task');
const verify = require('./verify');

router.use('/api/users', user);
router.use('/api/sessions', session);
router.use('/api/tasks', task);
router.use('/verify', verify);

module.exports = router;
