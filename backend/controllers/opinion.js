const Opinion = require('../models/opinion');

exports.addOneOpinion = (req, res, next) => {
    console.log("Entrée dans controllerAvis.ajout");
    const newOpinion = new Opinion({
        content: req.body.content,
        likes: 0
    });

    newOpinion.save()
        .then(opinion => {
            console.log("Avis ajouté!");
            res.status(201).json(opinion);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json(error)
        });
};

exports.getOneOpinion = (req, res, next) => {
    Opinion.findOne({ _id: req.params.id })
        .then(opinion => {
            res.status(200).json(opinion);
        })
        .catch(error => {
            console.log("L'avis n'a pas été trouvé");
            res.status(404).json(error);
        });
};

exports.getAllOpinionsInOneFilm = (req, res, next) => {
    Opinion.find({ filmId: req.params.filmId })
        .then(opinion => {
            if (opinion.length > 0) {
                console.log("Avis trouvés : " + opinion);
                res.status(200).json(opinion);
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

