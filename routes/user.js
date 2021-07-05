const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user');

/* create a user account */
router.post('/signup', userControllers.createUser);

/* authentify a user */
router.post('/login', userControllers.authentifyUser);

module.exports = router;