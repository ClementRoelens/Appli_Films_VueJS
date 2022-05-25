const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    titre: { type: String, required: true },
    realisateur: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    likes: { type: Number, required: true, default:[] },
    dislikes: { type: Number, required: true, default:[] },
    // Le champ avis désigne en fait les id des avis
    avis: { type: [String], required: false, default:[] },
    genres: { type: [String], required: true },
    imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Film', filmSchema);