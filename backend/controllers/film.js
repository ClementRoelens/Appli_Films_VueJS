const Film = require("../models/film");
const fs = require("fs");
const config = require("config");
const genres = config.get("Genres");

// Fonction prenant un tableau de films pour en retourner 20 au hasard
const recupNfilms = (films) => {
    let filmsTransmis = [];
    // On va créer une nouvelle Array de maximum 20 films pris au hasard (ou moins s'il n'y a pas 20 films)
    for (i = 0, lim = films.length; (i < 20) && (i < lim); i++) {
        const rand = Math.floor(Math.random() * films.length);
        filmsTransmis.push(films[rand]);
        films = films.slice(0, rand).concat(films.slice(rand + 1));
    }
    return filmsTransmis;
};
// Fonction permettant l'affichage de la date et de l'heure
const reqDate = () => {
    const dateBrute = new Date();
    const jour = dateBrute.toLocaleDateString();
    const heure = dateBrute.toLocaleTimeString();

    return jour + " : " + heure + " - ";
};
// Fonction permettant d'appliquer le bon format aux dates envoyées par MongoDB
const formatDate = (filmBrut) => {
    const filmAuBonFormat = filmBrut.toJSON();
    filmAuBonFormat.date = filmAuBonFormat.date.toLocaleDateString();

    return filmAuBonFormat;
};



//#region Récupérer tous les films


exports.tousLesFilms = (req, res, next) => {
    Film.find()
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);
            console.log(reqDate() + "Succès de la récupération de tous les films.Nombre de films récupérés : " + filmsAtransmettre.length);
            res.status(200).json(filmsAtransmettre);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films\n" + error);
            res.status(404).json(error);
        })
};

exports.tousLesFilmsParGenre = (req, res, next) => {
    const genreAchercher = req.params.genre;
    Film.find({ genres: genreAchercher })
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);
            console.log(reqDate() + "Succès de la récupération de tous les films du genre " + genreAchercher + "Nombre de films récupérés : " + filmsAtransmettre.length);
            res.status(200).json(filmsAtransmettre);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films du genre " + genreAchercher + "\n" + error);
            res.status(404).json(error);
        });
};

exports.tousLesFilmsParReal = (req, res, next) => {
    const real = req.params.real;
    Film.find({ realisateur: real })
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);
            console.log(reqDate() + "Succès de la récupération de tous les films réalisés par " + real + "Nombre de films récupérés : " + filmsAtransmettre.length);
            res.status(200).json(filmsAtransmettre);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans la récupération de tous les films réalisés par " + real + "\n" + error);
            res.status(404).json(error);
        })
};

//#endregion



//#region N Films au hasard

exports.filmsAuHasard = (req, res, next) => {
    Film.find()
        .then(films => {
            let filmsAtransmettre = films.map(formatDate);
            const filmsTransmis = recupNfilms(filmsAtransmettre);
            console.log(reqDate() + "Succès de la récupération de 20 films au hasard");
            res.status(200).json(filmsTransmis);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de films au hasard : \n" + error);
            res.status(404).json(error);
        });
};

exports.filmsAuHasardParGenre = (req, res, next) => {
    console.log("Le genre cherché est " + req.params.genre);
    const genreAchercher = req.params.genre;
    Film.find({ genres: genreAchercher })
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);
            const filmsTransmis = recupNfilms(filmsAtransmettre);
            console.log(reqDate() + "Succès de la récupération de 20 films du genre " + genreAchercher + " au hasard");
            res.status(200).json(filmsTransmis);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de films de " + genreAchercher + " au hasard\n" + error);
            res.status(404).json(error);
        });

};

exports.filmsAuHasardParReal = (req, res, next) => {
    const real = req.params.real;
    Film.find({ realisateur: real })
        .then(films => {
            const filmsAtransmettre = films.map(formatDate);
            const filmsTransmis = recupNfilms(filmsAtransmettre);
            console.log(reqDate() + "Succès de la récupération de 20 films réalisés par " + real + " au hasard");
            res.status(200).json(filmsTransmis);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération de films de " + real + " au hasard\n" + error);
            res.status(404).json(error);
        });
};

exports.unFilmAuHasard = (req, res, next) => {
    Film.find()
        .then(films => {
            const rand = Math.round(Math.random() * (films.length - 1));
            const filmTransmis = formatDate(films[rand]);
            console.log(reqDate() + "Succès de la récupération de " + filmTransmis.titre + " au hasard")
            res.status(200).json(filmTransmis);
        })
        .catch((error) => {
            console.log(reqDate() + "Erreur dans la récupération d'un film au hasard\n" + error);
            res.status(404).json(error);
        })
};

// Si on veut rechercher plusieurs genres 
// exports.filmsParGenre = (req, res, next) => {
//     // On va récupérer tous les films appartenant au moins à un des genres passés en URL
//     const genresDeTri = req.query.genre;
//     Film.find()
//         .then(films => {
//             const filmsTransmis = [];
//             films.forEach(filmAtrier => {
//                 const genresAtrier = filmAtrier.genre;
//                 // Le test est true si au moins un des genres du film itéré est contenu dans l'array des genres cherchés
//                 const test = genresAtrier.some(genre => genresDeTri.includes(genre));
//                 // Si le test est bon, on ajoute ce film à la liste des films qu'on va retourner
//                 if (test){
//                     filmsTransmis.push(filmAtrier);
//                 }
//             });
//             res.status(200).json(filmsTransmis);
//         })
//         .catch()

// };

//#endregion


exports.unFilm = (req, res, next) => {
    Film.findOne({ _id: req.params.id })
        .then(filmBrut => {
            const filmTransmis = formatDate(filmBrut);
            console.log(reqDate() + "Succès de la récupération du film " + filmTransmis.titre);
            res.status(200).json(filmTransmis);
        })
        .catch(error => {
            console.log(reqDate() + "Erreur de la récupération du film " + filmTransmis.titre + "\n" + error)
            res.status(404).json(error);
        })
};


//#region Post


exports.ajouterFilm = (req, res, next) => {
    // Les données sont d'abord passés par le validateur et par Multer
    const tempFilm = req.body;
    // Les genres sont espacés par des virgules dans un seul objet string, donc on va en faire une array
    const genresArray = tempFilm.genres.split(",");
    console.log('Film controller : genres :' + genresArray);
    const filmTransmis = new Film({
        titre: tempFilm.titre,
        realisateur: tempFilm.realisateur,
        description: tempFilm.description,
        date: tempFilm.date,
        genres: genresArray,
        // L'URL pouvant varier, on récupérera le domaine de base depuis le front, et on ajoutera juste ça
        imageUrl: "images/" + req.file.filename,
        // On ajoute également les likes, dislikes et avis vierges
        likes: 0,
        dislikes: 0,
        avis: []
    });

    console.log("Fin de la fonction film à ajouter");

    filmTransmis.save()
        .then(film => {
            console.log(reqDate() + "Succès de l'ajout de " + filmTransmis.titre);
            res.status(201).json(formatDate(film));
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans l'ajout de " + filmTransmis.titre + "\n" + error)
            res.status(400).json(error);
        });
};

exports.like = (req, res, next) => {
    // On update le film en question en changeant seulement le nombre de like
    // La clé "operation" est créé par le controller User et transmise par le front, et dépend de si l'utilisateur ajouter ou enlève un like
    Film.findOneAndUpdate(
        { _id: req.params.id },
        { likes: req.body.likes + req.body.operation },
        { new: true }
    ).then(updatedFilm => {
        console.log(reqDate() + "Succès de l'ajout d'un like à " + updatedFilm.titre + " les portant à " + updatedFilm.likes);
        res.status(201).json(formatDate(updatedFilm));
    }).catch(error => {
        console.log(reqDate() + "Erreur dans l'ajout d'un like au film d'id " + req.params.id + "\n" + error);
        res.status(400).json(error);
    });
};

exports.dislike = (req, res, next) => {
    Film.findOneAndUpdate(
        { _id: req.params.id },
        { dislikes: req.body.dislikes + req.body.operation },
        { new: true }
    ).then(updatedFilm => {
        console.log(reqDate() + "Succès de l'ajout d'un dislike à " + updatedFilm.titre + " les portant à " + updatedFilm.dislikes);
        res.status(201).json(formatDate(updatedFilm));
    }).catch(error => {
        console.log(reqDate() + "Erreur dans l'ajout d'un dislike au film d'id " + req.params.id + "\n" + error);
        res.status(400).json(error);
    });
};

exports.ajouterAvis = (req, res, next) => {

};

//#endregion



exports.modifierFilm = (req, res, next) => {
    Film.findOneAndUpdate(
        { _id: req.params.id }, req.body)
        .then(updatedFilm => {
            console.log(reqDate() + "Succès de la de mise à jour du film d'id " + req.params.id + "");
            res.status(200).json(formatDate(updatedFilm));
        })
        .catch(error => {
            console.log(reqDate() + "Erreur dans la mise à jour film d'id " + req.params.id + "" + error + "");
            res.status(400).json(error);
        })
};

// cette requête n'est pas encore utilisée
// exports.supprimer = (req, res, next) => {
//     film.deleteOne({ _id: req.params.id })
//         .then(() => {

//             res.status(200).json({ message: req.params.titre + ' supprimé ' })
//         })
//         .catch(error => res.status(400).json({ error }));
// };


//Test

