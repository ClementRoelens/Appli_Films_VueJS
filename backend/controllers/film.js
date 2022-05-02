const film = require('../models/film');
const Film = require('../models/film');
const fs = require('fs');

exports.tousLesFilms = (req, res, next) => {
    Film.find()
        .then(films => { 
            var filmsTransmis = [];
            films.forEach(film => {
                var tempFilm = film.toJSON();
                tempFilm.date = tempFilm.date.toLocaleDateString();  
                filmsTransmis.push(tempFilm);  
            });
            
            res.status(200).json(filmsTransmis) 
        })
        .catch((error) => {
            console.log("erreur : " + error);
            res.status(400).json(error);
        })
};

exports.unFilm = (req, res, next) => {
    Film.findOne({
        _id: req.params.id
    }).then(filmBrut => {
        // Le format de date n'étant pas désiré, on convertit l'objet en JSON pour pouvoir convertir la propriété au format voulu
        var film = filmBrut.toJSON();
        film.date = film.date.toLocaleDateString();
        res.status(200).json(film);
    })
        .catch(error => res.status(404).json(error))
};

exports.ajouter = (req, res, next) => {
    // L'image est passée par Multer et a été enregistrée dans le serveur
    // On recompose l'objet car les genres sont passés en String et on les veut en Array

    // ET VALIDATION
    var tempFilm = req.body;
    var film = new Film({
        titre: tempFilm.titre,
        realisateur: tempFilm.realisateur,
        description: tempFilm.description,
        date: tempFilm.date,
        genre: tempFilm.genres.split(','),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    film.save()
        .then(() => res.status(201).json({ message: film.titre + ' correctement ajouté' }))
        .catch(error => res.status(400).json({ error }))
};

exports.supprimer = (req, res, next) => {
    film.deleteOne({ _id: req.params.id })
        .then(() => {

            res.status(200).json({ message: req.params.titre + ' supprimé ' })
        })
        .catch(error => res.status(400).json({ error }));
};
