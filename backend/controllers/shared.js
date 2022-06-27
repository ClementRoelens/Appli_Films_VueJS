const User = require("../models/user");
const Avis = require("../models/avis");
const Film = require("../models/film");
const Avis = require("../models/avis");

exports.eraseNotice = (req, res, next) => {
    console.log("Entrée dans sharedController.eraseNotice");
    Avis.findOne({ _id: req.params.avisId })
        .then(avis => {
            Avis.deleteOne({ _id: req.params.avisId })
                .then(() => {
                    console.log("Avis bien supprimé, on va maintenant modifier le film");
                    Film.findOne({ _id: avis.filmId })
                        .then(film => {
                            console.log("Film trouvé : " + film.titre);
                            console.log("Liste actuelle : " + film.avis);
                            const index = film.avis.indexOf(avis._id);
                            console.log("Index à supprimer : " + index);
                            let newNoticeList = film.avis;
                            newNoticeList.splice(index, 1);
                            console.log("Nouvelle liste : " + newNoticeList);
                            Film.findOneAndUpdate(
                                { _id: req.params.avisId },
                                { avis: newNoticeList },
                                { new: true })
                                .then(updatedFilm => {
                                    console.log("Film correctement modifié, on va maintenant modifier l'user");
                                    User.find({ _id: avis.userId })
                                        .then(user => {
                                            console.log("User trouvé : " + user.pseudo);
                                            console.log("Liste actuelle : " + user.noticesFilmsId);
                                            const index = user.noticesFilmsId.indexOf(avis._id);
                                            console.log("Index à supprimer : " + index);
                                            let newNoticeList = user.noticesFilmsId;
                                            newNoticeList.splice(index, 1);
                                            console.log("Nouvelle liste : " + newNoticeList);
                                            User.findOneAndUpdate(
                                                { _id: avis.userId },
                                                { noticesFilmsId: newNoticeList },
                                                { new: true })
                                                .then(updatedUser => {
                                                    console.log("User correctement modifié\nRécapitulatif : ");
                                                    console.log("id de l'avis à supprimer : " + req.params.avisId);
                                                    console.log("avis émis par " + user.pseudo + " à propos du film " + film.titre);
                                                    console.log("Liste des avis du film : " + updatedFilm.avis);
                                                    console.log("Liste des avis par l'user : " + updatedUser.noticesFilmsId);
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