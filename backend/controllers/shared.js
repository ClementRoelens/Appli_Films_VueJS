const User = require("../models/user");
const Opinion = require("../models/opinion");
const Film = require("../models/film");

exports.addOneOpinion = (req, res, next) => {
    console.log("Entrée dans sharedController.createOpinion");
    console.log("Req.body : " + req.body);

    const newOpinion = new Opinion({
        content: req.body.content,
        likes: 0,
        author: req.body.author
    });

    newOpinion.save()
        .then(opinion => {
            console.log("Avis créé. On va mainenant ajouter la référence dans le film et l'user impliqués");
            Film.findOne({ _id: req.body.filmId })
                .then(film => {
                    console.log("Film trouvé");
                    let newOpinionsId = film.opinionsId;
                    newOpinionsId.push(opinion._id);
                    Film.findOneAndUpdate(
                        { _id: film._id },
                        { opinionsId: newOpinionsId },
                        { new: true })
                        .then(updatedFilm => {
                            console.log("Film mis à jour. On va maintenant mettre à jour l'user");
                            User.findOne({ _id: req.body.userId })
                                .then(user => {
                                    console.log("Utilisateur trouvé");
                                    let newOpinionsId = user.opinionsId;
                                    newOpinionsId.push(opinion._id);
                                    User.findOneAndUpdate(
                                        { _id: user._id },
                                        { opinionsId: newOpinionsId },
                                        { new: true })
                                        .then(updatedUser => {
                                            console.log("User mise à jour");
                                            res.status(201).json({
                                                message: "Avis créé, films et users mis à jour",
                                                newOpinion: opinion,
                                                newFilm: updatedFilm,
                                                newUser: updatedUser
                                            });
                                        })
                                        .catch(error => {
                                            console.log("Erreur lors de la mise à jour de l'user");
                                            res.status(400).json({ Erreur: error });
                                        });
                                })
                                .catch(error => {
                                    console.log("Erreur lors de la récupération de l'user : " + error);
                                    res.status(404).json({ Erreur: error });
                                });
                        })
                        .catch(error => {
                            console.log("Erreur lors de la modification du film : " + error);
                            res.status(400).json({ Erreur: error });
                        });
                })
                .catch(error => {
                    console.log("Erreur lors de la récupération du film : " + error);
                    res.status(404).json({ Erreur: error });
                });
        })
        .catch(error => {
            console.log("Erreur lors de la création de l'avis : " + error);
            res.status(400).json({ Erreur: error });
        });
};

exports.eraseOneOpinion = (req, res, next) => {
    console.log("Entrée dans sharedController.eraseOpinion");
    Opinion.findOne({ _id: req.params.opinionId })
        .then(opinion => {
            Opinion.deleteOne({ _id: req.params.opinionId })
                .then(() => {
                    console.log("Avis bien supprimé, on va maintenant modifier le film");
                    Film.findOne({ _id: opinion.filmId })
                        .then(film => {
                            console.log("Film trouvé : " + film.titre);
                            console.log("Liste actuelle : " + film.opinionsId);
                            const index = film.opinionsId.indexOf(opinion._id);
                            console.log("Index à supprimer : " + index);
                            let newOpinionsId = film.opinionsId;
                            newOpinionsId.splice(index, 1);
                            console.log("Nouvelle liste : " + newOpinionsId);
                            Film.findOneAndUpdate(
                                { _id: req.params.opinionId },
                                { opinionsId: newOpinionsId },
                                { new: true })
                                .then(updatedFilm => {
                                    console.log("Film correctement modifié, on va maintenant modifier l'user");
                                    User.find({ _id: opinion.userId })
                                        .then(user => {
                                            console.log("User trouvé : " + user.nickname);
                                            console.log("Liste actuelle : " + user.opinionsId);
                                            const index = user.opinionsId.indexOf(opinion._id);
                                            console.log("Index à supprimer : " + index);
                                            let newOpinionsId = user.opinionsId;
                                            newOpinionsId.splice(index, 1);
                                            console.log("Nouvelle liste : " + newOpinionsId);
                                            User.findOneAndUpdate(
                                                { _id: opinion.userId },
                                                { opinionsId: newOpinionsId },
                                                { new: true })
                                                .then(updatedUser => {
                                                    console.log("User correctement modifié\nRécapitulatif : ");
                                                    console.log("id de l'avis à supprimer : " + req.params.opinionId);
                                                    console.log("avis émis par " + user.nickname + " à propos du film " + film.titre);
                                                    console.log("Liste des avis du film : " + updatedFilm.opinionsId);
                                                    console.log("Liste des avis par l'user : " + updatedUser.opinionsId);
                                                    res.status(200).json({
                                                        message: "Avis bien supprimé de la liste des avis, du film et de l'utilisateur",
                                                        user: updatedUser,
                                                        film: updatedFilm
                                                    });
                                                })
                                                .catch(error => {
                                                    console.log("Erreur lors de la modification de l'user");
                                                    res.status(400).json({
                                                        message: "Erreur lors de la modification de l'user",
                                                        erreur: error
                                                    });
                                                })
                                        })
                                        .catch(error => {
                                            console.log("Erreur lors de la récupération de l'user");
                                            res.status(404).json({
                                                message: "Erreur lors de la récupération de l'user",
                                                erreur: error
                                            });
                                        });
                                })
                                .catch(error => {
                                    console.log("Erreur lors de la modification du film");
                                    res.status(400).json({
                                        message: "Erreur lors de la modification du film",
                                        erreur: error
                                    });
                                });
                        })
                        .catch(error => {
                            console.log("Erreur lors de la récupération du film");
                            res.status(404).json({
                                message: "Erreur lors de la récupération du film",
                                erreur: error
                            });
                        });
                })
                .catch(error => {
                    console.log("Erreur lors de la suppression de l'avis");
                    res.status(400).json({
                        message: "Erreur lors de la suppression de l'avis",
                        erreur: error
                    });
                });
        })
        .catch(error => {
            console.log("Erreur lors de la récupération de l'avis");
            res.status(404).json({
                message: "Erreur lors de la récupération de l'avis",
                erreur: error
            });
        });
};

exports.likeOpinion = (req, res, next) => {
    console.log("Entrée dans sharedController.likeOpinion");
    User.findOne({ _id: req.body.userId })
        .then(user => {
            let newLikedOpinionsId = user.likedOpinionsId;
            console.log("opinionId : " + req.body.opinionId);
            console.log("likedOpinionsId initiales : " + newLikedOpinionsId);
            let operation = 0;
            if (user.likedOpinionsId.includes(req.body.opinionId)) {
                operation = -1;
                const index = newLikedOpinionsId.indexOf(req.body.opinionId);
                newLikedOpinionsId.splice(index, 1);
            }
            else {
                operation = 1;
                newLikedOpinionsId.push(req.body.opinionId);
            }
            console.log("nouvelle likedOPinionsId : "+newLikedOpinionsId);
            User.findOneAndUpdate(
                { _id: req.body.userId },
                { likedOpinionsId: newLikedOpinionsId },
                { new: true })
                .then(updatedUser => {
                    Opinion.findOne({ _id: req.body.opinionId })
                        .then(opinion => {
                            Opinion.findOneAndUpdate(
                                { _id: req.body.opinionId },
                                { likes: opinion.likes + operation },
                                { new: true })
                                .then(updatedOpinion => {
                                    console.log("Succès de la requête");
                                    res.status(201).json({
                                        user: updatedUser,
                                        opinion: updatedOpinion
                                    });
                                })
                                .catch(error => {
                                    console.log("Erreur dans l'update de l'avis" + error);
                                    res.status(400).json(error);
                                });
                        })
                        .catch(error => {
                            console.log("Erreur dans la récupération de l'avis" + error);
                            res.status(404).json(error);
                        });
                })
                .catch(error => {
                    console.log("Erreur dans l'update de l'user" + error);
                    res.status(400).json(error);
                });
        })
        .catch(error => {
            console.log("Erreur dans la récupération de l'user" + error);
            res.status(404).json(error);
        });
};

exports.likeFilm = (req, res, next) => {
    // Cette fonction est appelée quand l'utilisateur clique sur le pouce en l'air

    // On va devoir modifier l'utilisateur (pour sa liste de films likés) et le film (pour son nombre de likes)
    let newLikedFilmsId = req.body.likedFilmsId;
    let newLikes = req.body.likes;
    // Si l'id du film est présent dans la liste de l'utilisateur, on le supprime et on désincrémente le nombre de likes, sinon on l'ajoute et on incrémente
    if (!newLikedFilmsId.includes(req.body.filmId)) {
        newLikedFilmsId.push(req.body.filmId);
        newLikes += 1;
    }
    else {
        const index = newLikedFilmsId.indexOf(req.body.filmId);
        newLikedFilmsId.splice(index, 1);
        newLikes -= 1;
    }
    User.findOneAndUpdate(
        { _id: req.body.userId },
        { likedFilmsId: newLikedFilmsId },
        { new: true })
        .then(updatedUser => {
            Film.findOneAndUpdate(
                { _id: req.body.filmId },
                { likes: newLikes },
                { new: true })
                .then(updatedFilm => {
                    const message = ("L'utilisateur " + updatedUser.nickname + " a bien liké le film " + updatedFilm.title + ".\nIl a été liké " + updatedFilm.likes + "fois");
                    console.log(message);
                    res.status(201).json({
                        message: message,
                        user: updatedUser,
                        film: updatedFilm
                    });
                })
                .catch(error => {
                    console.log("Erreur dans l'ajout d'un like au film d'id " + req.params.id + "\n" + error);
                    res.status(400).json(error);
                });
        })
        .catch(error => {
            console.log("Erreur dans la modification de l'utilisateur pour ajouter le film liké à sa liste");
            res.status(400).json(error);
        });
};

exports.dislikeFilm = (req, res, next) => {
    // Cette fonction est appelée quand l'utilisateur clique sur le pouce en l'air

    // On va devoir modifier l'utilisateur (pour sa liste de films dislikés) et le film (pour son nombre de dislikes)
    let newDislikedFilmsId = req.body.dislikedFilmsId;
    let newDislikes = req.body.dislikes;
    // Si l'id du film est présent dans la liste de l'utilisateur, on le supprime et on désincrémente le nombre de dislikes, sinon on l'ajoute et on incrémente
    if (!newDislikedFilmsId.includes(req.body.filmId)) {
        newDislikedFilmsId.push(req.body.filmId);
        newDislikes += 1;
    }
    else {
        const index = newDislikedFilmsId.indexOf(req.body.filmId);
        newDislikedFilmsId.splice(index, 1);
        newDislikes -= 1;
    }
    User.findOneAndUpdate(
        { _id: req.body.userId },
        { dislikedFilmsId: newDislikedFilmsId },
        { new: true })
        .then(updatedUser => {
            Film.findOneAndUpdate(
                { _id: req.body.filmId },
                { dislikes: newDislikes },
                { new: true })
                .then(updatedFilm => {
                    const message = ("L'utilisateur " + updatedUser.nickname + " a bien liké le film " + updatedFilm.title + ".\nIl a été liké " + updatedFilm.dislikes + "fois");
                    // console.log(message);
                    res.status(201).json({
                        message: message,
                        user: updatedUser,
                        film: updatedFilm
                    });
                })
                .catch(error => {
                    console.log("Erreur dans l'ajout d'un dislike au film d'id " + req.params.id + "\n" + error);
                    res.status(400).json(error);
                });
        })
        .catch(error => {
            console.log("Erreur dans la modification de l'utilisateur pour ajouter le film liké à sa liste");
            res.status(400).json(error);
        });
};