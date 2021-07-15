const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const pwSchema = require('../security/password');
const inputValidator = require('node-input-validator');
const mongoose = require('mongoose');

/* input validation, hash received PW, create new user with hashed PW */
exports.createUser = (req, res, next) => {
    const validInput = new inputValidator.Validator(req.body, {
        email: 'required|email|length:100',
        password: 'required'
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            if (pwSchema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const newId = new mongoose.Types.ObjectId();
                    console.log(newId);
                    const user = new User({
                        userId: newId,
                        email: req.body.email,
                        password: hash
                    });
                    console.log(user);
                    user.save()
                    .then(() => res.status(201).json({ message: 'User account created !' }))
                    .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
            } else {
                throw 'Invalid password';
            }
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* input validation, search existing user, compare send PW with saved PW, return user Id and user token */
exports.authentifyUser = (req, res, next) => {
    const validInput = new inputValidator.Validator(req.body, {
        email: 'required|email',
        password: 'required'
    });

    validInput.check()
    .then((matched) => {
        if (!matched) {
            res.status(400).send(validInput.errors);
        } else {
            User.findOne({ email: req.body.email })
            .then( user => {
                if (!user) {
                    const f = resolve => setTimeout(resolve, 5000);
                    Promise.all(f); // limit brute force attack adding a delay
                    return res.status(401).json({ error: "Didn't find user or password is invalid !"}); 
                }
                bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        const f = resolve => setTimeout(resolve, 5000);
                        Promise.all(f); // limit brute force attack adding a delay
                        return res.status(401).json({ error: "Didn't find user or password is invalid !"});
                    }
                    res.status(200).json({ 
                        userId: user._id, 
                        token: jwt.sign(
                            { userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(errors => res.status(400).send(validInput.errors));
};

/* search existing user, check user is the account owner, delete account */  
exports.deleteUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
    .then( user => {
        if (!user) {
            return res.status(401).json({ error: "Didn't find user !"}); 
        } else if ( user._id == res.locals.userId ) {
            user.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'User account deleted !' }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};