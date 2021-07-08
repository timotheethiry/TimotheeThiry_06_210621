const Sauce = require('../models/sauce');
const fs = require('fs');

/* create a sauce, convert the body request from form-data JS object, set likes and users to 0 */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    sauce = new Sauce ({
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
};

/* handles likes and dislikes from a user */
exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id}, { 
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId }
        })
        .then(() => res.status(201).json({ message: 'Preferences saved !' }))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId }
        })
        .then(() => res.status(201).json({ message: 'Preferences saved !' }))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === 0) {
        const findLiked = Sauce.findOne({
            _id: req.params.id,
            usersLiked: req.body.userId
        });
        const findDisliked = Sauce.findOne({
            _id: req.params.id,
            usersDisliked: req.body.userId
        });
        Promise.all([findLiked, findDisliked])
        .then(result => {
            const [alreadyLiked, alreadyDisliked] = result;
            if (alreadyLiked) {
                Sauce.updateOne({ _id: req.params.id}, { 
                    $inc: { likes: -1 },
                    $pull: { usersLiked: req.body.userId }
                })
                .then(() => res.status(201).json({ message: 'Preferences saved !' }))
                .catch(error => res.status(400).json({ error }));
            } else if (alreadyDisliked) {
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: req.body.userId }
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
};

/* delete a sauce, search the corresponding image and delete it */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce deleted !' }))
            .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.staus(500).json({ error }));
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