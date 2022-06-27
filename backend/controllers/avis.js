const Avis = require('../models/avis');

exports.ajout = (req, res, next) => {
    console.log("Entrée dans controllerAvis.ajout");
    const newAvis = new Avis({
        filmId: req.body.filmId,
        userId: req.body.userId,
        contenu: req.body.contenu,
        likes: 0
    });

    newAvis.save()
        .then(avis => {
            console.log("Avis ajouté!");
            res.status(201).json(avis);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json(error)
        });
};

exports.recevoirUnAvis = (req, res, next) => {
    Avis.findOne({ _id: req.params.id })
        .then(avis => {
            res.status(200).json(avis);
        })
        .catch(error => {
            console.log("L'avis n'a pas été trouvé");
            res.status(404).json(error);
        });
};

exports.tousLesAvisDunFilm = (req, res, next) => {
    Avis.find({ filmId: req.params.filmId })
        .then(avis => {
            if (avis.length > 0) {
                console.log("Avis trouvés : " + avis);
                res.status(200).json(avis);
            }
            else {
                console.log("Aucun avis n'a été écrit");
                res.status(404).json("Aucun avis existant");
            }
        })
        .catch(error => {
            console.log('Avis non trouvés');
            res.status(404).json(error)
        });
};

