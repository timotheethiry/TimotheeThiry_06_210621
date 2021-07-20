const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user');
const auth = require('../middleware/auth');
const mongoMask = require('mongo-mask');

/* create a user account */
router.post('/signup', userControllers.createUser);

/* authentify a user */
router.post('/login', userControllers.authentifyUser);

/* delete a user account */
router.delete('/users/:id', auth, userControllers.deleteUser);

/* get all users */
router.get('/users', userControllers.getAllUsers)

/* get one user */
router.get('/users/:id', userControllers.getUser)

module.exports = router;