const Sauce = require('../models/sauce');
const fs = require('fs');
const inputValidator = require('node-input-validator');

/* create a sauce, convert the body request from form-data JS object, set likes and users to 0 */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const validInput = new inputValidator.Validator(req.body.sauce, {
        name: 'required|string|max:100',
        manufacturer: 'required|string|max:100',
        description: 'required|string|max:100',
        mainPepper: 'required|string|max:100',
        heat: 'required|integer|min:0|max:10'
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            sauce = new Sauce ({
                userId: res.locals.userId,
                name: sauceObject.name,
                manufacturer: sauceObject.manufacturer,
                description: sauceObject.description,
                mainPepper: sauceObject.mainPepper,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                heat: sauceObject.heat,
                likes: 0,
                dislikes: 0,
                userLiked: [],
                userDisliked: []
            });
            sauce.save()
            .then(() => res.status(201).json({ message: 'New sauce created !' }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* handles likes and dislikes from a user */
exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id}, { 
            $inc: { likes: 1 },
            $push: { usersLiked: res.locals.userId }
        })
        .then(() => res.status(201).json({ message: 'Preferences saved !' }))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: res.locals.userId }
        })
        .then(() => res.status(201).json({ message: 'Preferences saved !' }))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === 0) {
        const findLiked = Sauce.findOne({
            _id: req.params.id,
            usersLiked: res.locals.userId
        });
        const findDisliked = Sauce.findOne({
            _id: req.params.id,
            usersDisliked: res.locals.userId
        });
        Promise.all([findLiked, findDisliked])
        .then(result => {
            const [alreadyLiked, alreadyDisliked] = result;
            if (alreadyLiked) {
                Sauce.updateOne({ _id: req.params.id}, { 
                    $inc: { likes: -1 },
                    $pull: { usersLiked: res.locals.userId }
                })
                .then(() => res.status(201).json({ message: 'Preferences saved !' }))
                .catch(error => res.status(400).json({ error }));
            } else if (alreadyDisliked) {
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: res.locals.userId }
                })
                .then(() => res.status(201).json({ message: 'Preferences saved !' }))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
    }
};

/* modify a sauce w/ or w/o an image */
exports.modifySauce = (req, res, next) => {
    const validInput = new inputValidator.Validator(req.body.sauce, {
        name: 'required|string|max:100',
        manufacturer: 'required|string|max:100',
        description: 'required|string|max:100',
        mainPepper: 'required|string|max:100',
        heat: 'required|integer|min:0|max:10'
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if ( sauce.userId == res.locals.userId ) {
                    const sauceObject = req.file ?
                    { 
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                    } : { 
                        ...req.body 
                    };
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject })
                    .then(() => res.status(200).json({ message: 'Sauce modified !' }))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* delete a sauce, search the corresponding image and delete it */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if ( sauce.userId == res.locals.userId ) {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce deleted !' }))
                .catch(error => res.status(400).json({ error }));
            }) 
        }
    })
    .catch(error => res.status(500).json({ error }));
};

/* returns a specific sauce for GET requests */
exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

/* returns all sauces for GET requests */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};