const mongoose = require('mongoose');

const ancienfilm = mongoose.Schema({
    titre: { type: String, required: true },
    realisateur: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    likes: { type: Number, required: true, default:[] },
    dislikes: { type: Number, required: true, default:[] },
    avis: { type: [String], required: false, default:[] },
    genres: { type: [String], required: true },
    imageUrl: { type: String, required: true }
});


module.exports = mongoose.model('Ancienfilm',ancienfilm);