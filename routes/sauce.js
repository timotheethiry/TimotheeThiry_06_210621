const express = require('express');
const router = express.Router();
const saucesControllers = require('../controllers/sauce');
const auth = require('../middleware/auth');

/* create a sauce */
router.post('/', auth, saucesControllers.createSauce);

/* like a sauce */
router.post('/:id/like', auth, saucesControllers.likeSauce);

/* modify likes */
router.put('/:id/like', auth, saucesControllers.modifyLike);

/* modify a sauce */
router.put('/:id', auth, saucesControllers.modifySauce);

/* get one sauce */
router.get('/:id', auth, saucesControllers.getSauce);

/* get all sauces */
router.get('/', auth, saucesControllers.getAllSauces);

module.exports = router;