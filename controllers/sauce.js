const sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
    sauce = new Sauce ({
        ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'New sauce created !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
    .then(() => res.status(201).json({ message: 'Preferences saved !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifyLike = (req, res, next) => {
    sauce.updateOne({ _id: req.params.id }, { userLiked: req.body.userId, userDisliked: req.body.userId, likes: req.body.likes })
    .then(() => res.status(200).json({ message: 'Preferences updated !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    sauce.updateOne({ _id: req.params.id }, { ...req.body })
    .then(() => res.status(200).json({ message: 'Sauce modified !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};