const Film = require('../models/film');

exports.tousLesFilms = (req, res, next) => {
    // console.log("Réception de requête tousLesFilms");
    Film.find()
        .then(films => {res.status(200).json(films)})
        .catch((error) => {
            console.log("erreur : "+error);
            res.status(400).json(error);
        })
};

exports.unFilm = (req, res, next) => {
    Film.findOne({
        _id: req.params.id
    }).then(film => res.status(200).json(film))
        .catch(error => res.status(404).json(error))
};

exports.ajouterUnFilm = (req, res, next) => {
    
    const film = new Film({
        ...req.body
    });
    film.save()
        .then(() => {
            res.status(201).json({ message: film.titre + ' ajouté' });
            console.log(film.titre + ' ajouté');
        })
        .catch(error => {
            res.status(400).json({ error });
            console.log('Erreur');
        })
};
