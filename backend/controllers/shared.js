const User = require("../models/user");
const Opinion = require("../models/opinion");
const Film = require("../models/film");

exports.addOneOpinion = (req,res,next) => {
    // Besoin de contenu , filmId , userId
    console.log("Entrée dans sharedController.createOpinion");
    console.log("Req.body : " + req.body);
    
    const newOpinion = new Opinion({
        contenu : req.body.contenu,
        likes : 0
    });

    newOpinion.save()
    .then(opinion=>{
        console.log("Avis créé. On va mainenant ajouter la référence dans le film et l'user impliqués");
        Film.findOne({_id:req.body.filmId})
        .then(film => {
            console.log("Film trouvé");
            let newOpinionsId = film.opinionsId;
            newOpinionsId.push(opinion._id);
            Film.findOneAndUpdate(
                {_id:film._id},
                {opinionsId:newOpinionsId},
                {new:true})
                .then(updatedFilm => {
                    console.log("Film mis à jour. On va maintenant mettre à jour l'user");
                    User.findOne({_id:req.body.userId})
                    .then(user => {
                        console.log("Utilisateur trouvé");
                        let newOpinionsId = user.opinionsId;
                        newOpinionsId.push(opinion._id);
                        User.findOneAndUpdate(
                            {_id:user._id},
                            {opinionsId:newOpinionsId},
                            {new:true})
                            .then(updatedUser => {
                                console.log("User mise à jour");
                                res.status(201).json({
                                    message : "Avis créé, films et users mis à jour",
                                    newOpinion : opinion,
                                    newFilm : updatedFilm,
                                    newUser:updatedUser
                                });
                            })
                            .catch(error => {
                                console.log("Erreur lors de la mise à jour de l'user");
                                res.status(400).json({Erreur:error});
                            });
                    })
                    .catch(error => {
                        console.log("Erreur lors de la récupération de l'user : " + error);
                        res.status(404).json({Erreur:error});
                    });
                })
                .catch(error => {
                    console.log("Erreur lors de la modification du film : "+error);
                    res.status(400).json({Erreur : error});
                });
        })
        .catch(error => {
            console.log("Erreur lors de la récupération du film : "+error);
            res.status(404).json({Erreur : error});
        });
    })
    .catch(error=>{
        console.log("Erreur lors de la création de l'avis : "+error);
        res.status(400).json({Erreur : error});        
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
                                            console.log("User trouvé : " + user.pseudo);
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
                                                    console.log("avis émis par " + user.pseudo + " à propos du film " + film.titre);
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