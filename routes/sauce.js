const express = require('express');
const router = express.Router();
const saucesControllers = require('../controllers/sauce');

/* create a sauce */
router.post('/', saucesControllers.createSauce);

/* like a sauce */
router.post('/:id/like', saucesControllers.likeSauce);

/* modify likes */
router.put('/:id/like', saucesControllers.modifyLike);

/* modify a sauce */
router.put('/:id', saucesControllers.modifySauce);

/* get one sauce */
router.get('/:id', saucesControllers.getSauce);

/* get all sauces */
router.get('/', saucesControllers.getAllSauces);

module.exports = router;