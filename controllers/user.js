exports.signup = (req, res, next) => {

};

exports.login = (req, res, next) => {

};

const user = require('../models/user');

/* hash received PW, create new user with hashed PW */
exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'User account created !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error}));   
};

/* search existing user, compare send PW with saved PW, return user Id and user token */
exports.authentifyUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then( user => {
        if (!user) {
            return res.status(401).json({ error: "Didn't find user !"}); 
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: "Invalid password !"});
            }
            res.status(200).json({ userId: user._id, token: 'TOKEN'});
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};