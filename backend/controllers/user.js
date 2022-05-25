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
    // On cherche l'utilisateur
    User.findOne({ pseudo: req.body.pseudo })
        .then(user => {
            if (user) {
                // Une fois trouvé, on compare son password crypté à ce qu'il y a dans la DB
                bcrypt.compare(req.body.password, user.password)
                    .then(result => {
                        if (result) {
                            // Si le résultat est positif, alors on renvoie les infos de l'utilisateur
                            res.status(200).json({
                                userId: user.id,
                                pseudo: user.pseudo,
                                isAdmin: user.isAdmin,
                                likedFilmsId: user.likedFilmsId,
                                dislikedFilmsId: user.dislikedFilmsId,
                                noticesFilmsId: user.noticesFilmsId,
                                likedNoticesId: user.likedNoticesId,
                                // Et le JWT
                                token: jwt.sign(
                                    { userId: user.id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h' }
                                )
                            })
                        }
                        else {
                            res.status(401).json({ error: "Mot de passe incorrect" });
                        }
                    })
                    .catch(error => res.status(500).json(error));
            }
            else {
                res.status(404).json({ error: "Utilisateur non trouvé" });
            }
        })
        .catch(error => res.status(500).json(error));
};

exports.filmLiked = (req, res, next) => {
    // Cette fonction est appelée quand l'utilisateur clique sur le pouce en l'air

    // D'abord on récupère l'utilisateur pour voir si l'id de ce film est déjà dans sa liste de films likés
    User.findOne({ _id: req.body.userId })
        .then(user => {
            // On crée la const contenant la nouvelle liste qu'on va passer à la requête d'update
            const newLikedFilmsId = user.likedFilmsId;
            // Et également cette variable qui vaudra +1 si le like va être rajouté, et -1 s'il va être enlevé
            // Cette variable sera envoyée en réponse pour être passée ensuite à la requête du controller Film
            let operationToDo = 0;
            // Si l'id du film est présent dans le tableau, on le supprime, sinon on l'ajoute
            if (!newLikedFilmsId.includes(req.body.filmId)) {
                newLikedFilmsId.push(req.body.filmId);
                operationToDo = 1;
            }
            else {
                const index = newLikedFilmsId.indexOf(req.body.filmId);
                newLikedFilmsId.splice(index, 1);
                operationToDo = -1;
            }
            // Ensuite on met à jour l'utilisateur avec la liste édité selon le besoin
            User.findOneAndUpdate(
                { _id: req.body.userId },
                { likedFilmsId: newLikedFilmsId },
                { new: true }
            ).then(updatedUser => {
                res.status(201).json({ user: updatedUser, operation: operationToDo });
            })
                .catch(error => {
                    console.log('Utilisateur non trouvé');
                    res.status(400).json(error);
                });
        })
        .catch(error => res.status(400).json(error));
};

exports.filmDisliked = (req, res, next) => {
    // D'abord on récupère l'utilisateur pour voir si l'id de ce film est déjà dans sa liste de films likés
    User.findOne({ _id: req.body.userId })
        .then(user => {
            // On crée la const contenant la nouvelle liste qu'on va passer à la requête d'update
            const newDisdislikedFilmsId = user.dislikedFilmsId;
            // Et également cette variable qui vaudra +1 si le dislike va être rajouté, et -1 s'il va être enlevé
            // Cette variable sera envoyée en réponse pour être passée ensuite à la requête du controller film
            let operationToDo = 0;
            // Si l'id du film est présent dans le tableau, on le supprime, sinon on l'ajoute
            if (!newDisdislikedFilmsId.includes(req.body.filmId)) {
                newDisdislikedFilmsId.push(req.body.filmId);
                operationToDo = 1;
            }
            else {
                const index = newDisdislikedFilmsId.indexOf(req.body.filmId);
                newDisdislikedFilmsId.splice(index, 1);
                operationToDo = -1;
            }
            // Ensuite on met à jour l'utilisateur avec la liste édité selon le besoin
            User.findOneAndUpdate(
                { _id: req.body.userId },
                { dislikedFilmsId: newDisdislikedFilmsId },
                { new: true }
            ).then(updatedUser => {
                res.status(201).json({ user: updatedUser, operation: operationToDo });
            })
                .catch(error => {
                    console.log('Utilisateur non trouvé');
                    res.status(400).json(error);
                });
        })
        .catch(error => res.status(400).json(error));
};