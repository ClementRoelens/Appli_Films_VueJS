const film = require('../models/film');
const Film = require('../models/film');
const fs = require('fs');

exports.tousLesFilms = (req, res, next) => {
    // console.log("Réception de requête tousLesFilms");
    Film.find()
        .then(films => { res.status(200).json(films) })
        .catch((error) => {
            console.log("erreur : " + error);
            res.status(400).json(error);
        })
};

exports.unFilm = (req, res, next) => {
    Film.findOne({
        _id: req.params.id
    }).then(film => res.status(200).json(film))
        .catch(error => res.status(404).json(error))
};

exports.ajouter = (req, res, next) => {
    console.log("Entrée dans la fonction 'Ajouter un film'")
    const film = new Film({
        ...req.body,
        //Multer a été passé en middleware de la route et enregistre l'image dans le dossier Images du serveur
        //On passe donc l'URL de l'image 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    film.save()
        .then(() => {
            console.log(film.titre + ' correctement ajouté.');
            res.status(201).json({ message: film.titre + ' ajouté' });
        })
        .catch(error => {
            res.status(400).json({ error });
            console.log('Erreur');
        })
};

exports.supprimer = (req, res, next) => {
    film.findOne({ _id: req.params.id })
        .then(() => {
            film.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json(error));
};

