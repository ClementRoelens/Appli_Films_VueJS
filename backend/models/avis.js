const mongoose = require('mongoose');

const avisSchema = mongoose.Schema({
    filmId: { type: String, required: true },
    userId: { type: String, required: true },
    contenu: { type: String, required: true },
    likes: { type: Number, required: true }
});

module.exports = mongoose.model('Avis', avisSchema);