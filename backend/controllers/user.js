const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.inscription = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                pseudo: req.body.pseudo,
                password: hash,
                isAdmin: false
            });
            user.save()
                .then(user => {
                    res.status(201).json('Utilisateur créé!')
                })
                .catch(error => res.status(400).json(error));
        })
        .catch(error => res.status(500).json(error));
};

exports.connexion = (req, res, next) => {
    console.log('Connexion : requête reçue');
    User.findOne({ pseudo: req.body.pseudo })
        .then(user => {
            if (user) {
                console.log('utilisateur trouvé : ' + user.pseudo);
                bcrypt.compare(req.body.password, user.password)
                    .then(result => {
                        if (result) {
                            console.log("Mot de passe correct!");
                            res.status(200).json({
                                userId: user.id,
                                pseudo: user.pseudo,
                                isAdmin: user.isAdmin,
                                likedFilmsId: user.likedFilmsId,
                                noticesFilmsId: user.noticesFilmsId,
                                likedNoticesId: user.likedNoticesId,
                                token: jwt.sign(
                                    { userId: user.id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h' }
                                )
                            });
                        }
                        else {
                            res.status(401).json({ error: "Mot de passe incorrect" })
                        }
                    })
                    .catch(error => res.status(500).json(error));
            }
            else {
                console.log("Utilisateur " + req.body.user + " non trouvé.");
                res.status(404).json({ error: "Utilisateur non trouvé" });
            }
        })
        .catch(error => res.status(500).json(error));
};