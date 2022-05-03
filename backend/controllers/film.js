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

exports.filmsParGenre = (req, res, next) => {
    // On va récupérer tous les films appartenant au moins à un des genres passés en URL
    var genreAchercher = req.params.genre;
    Film.find()
        .then(films => {
            var filmsTransmis = [];
            films.forEach(filmAtrier => {
                var genresAtrier = filmAtrier.genre;
                // Le test est true si au moins un des genres du film itéré est le genre cherché
                if (genresAtrier.includes(genreAchercher)){
                    // Si le test est bon, on ajoute ce film à la liste des films qu'on va retourner
                    var tempFilm = filmAtrier.toJSON();
                    tempFilm.date = tempFilm.date.toLocaleDateString();
                    filmsTransmis.push(tempFilm);
                }
            });
            res.status(200).json(filmsTransmis);
        })
        .catch(error => res.status(404).json(error))
    
};

// Si on veut rechercher plusieurs genres 
// exports.filmsParGenre = (req, res, next) => {
//     // On va récupérer tous les films appartenant au moins à un des genres passés en URL
//     var genresDeTri = req.query.genre;
//     Film.find()
//         .then(films => {
//             var filmsTransmis = [];
//             films.forEach(filmAtrier => {
//                 var genresAtrier = filmAtrier.genre;
//                 // Le test est true si au moins un des genres du film itéré est contenu dans l'array des genres cherchés
//                 var test = genresAtrier.some(genre => genresDeTri.includes(genre));
//                 // Si le test est bon, on ajoute ce film à la liste des films qu'on va retourner
//                 if (test){
//                     filmsTransmis.push(filmAtrier);
//                 }
//             });
//             res.status(200).json(filmsTransmis);
//         })
//         .catch()
    
// };

exports.filmsParReal = (req,res,next) => {
    var real = req.params.real;
    Film.find()
    .then(films=>{
        var filmsTransmis = [];
        films.forEach(filmAtrier => {
            if (filmAtrier.realisateur === real){
                  // Si le test est bon, on ajoute ce film à la liste des films qu'on va retourner
                  var tempFilm = filmAtrier.toJSON();
                  tempFilm.date = tempFilm.date.toLocaleDateString();
                  filmsTransmis.push(tempFilm);
            }
        });
        res.status(200).json(filmsTransmis);
    })
    .catch(error => res.status(404).json(error))
};

exports.unFilm = (req, res, next) => {
    Film.findOne({
        _id: req.params.id
    }).then(filmBrut => {
        // Le format de date n'étant pas désiré, on convertit l'objet en JSON pour pouvoir convertir la propriété au format voulu
        var filmTransmis = filmBrut.toJSON();
        filmTransmis.date = filmTransmis.date.toLocaleDateString();
        res.status(200).json(filmTransmis);
    })
        .catch(error => res.status(404).json(error))
};

exports.ajouter = (req, res, next) => {
    // L'image est passée par Multer et a été enregistrée dans le serveur
    // On recompose l'objet car les genres sont passés en String et on les veut en Array

    // TO DO 
    // TO DO 
    // TO DO 
    // VALIDATION !!!
    // TO DO 
    // TO DO 
    // TO DO 
    var tempFilm = req.body;
    var filmTransmis = new Film({
        titre: tempFilm.titre,
        realisateur: tempFilm.realisateur,
        description: tempFilm.description,
        date: tempFilm.date,
        genre: tempFilm.genres.split(','),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    filmTransmis.save()
        .then(() => res.status(201).json({ message: film.titre + ' correctement ajouté' }))
        .catch(error => res.status(400).json({ error }))
};


// cette requête n'est pas encore utilisée
// exports.supprimer = (req, res, next) => {
//     film.deleteOne({ _id: req.params.id })
//         .then(() => {

//             res.status(200).json({ message: req.params.titre + ' supprimé ' })
//         })
//         .catch(error => res.status(400).json({ error }));
// };
