const express = require('express');
const router = express.Router();

const saucesControllers = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* create a sauce */
router.post('/', auth, multer, saucesControllers.createSauce);

/* like a sauce */
router.post('/:id/like', auth, saucesControllers.likeSauce);

/* modify a sauce */
router.put('/:id', auth, multer, saucesControllers.modifySauce);

/* delete a sauce */
router.delete('/:id', auth, saucesControllers.deleteSauce);

/* get one sauce */
router.get('/:id', auth, saucesControllers.getSauce);

/* get all sauces */
router.get('/', auth, saucesControllers.getAllSauces);

module.exports = router;