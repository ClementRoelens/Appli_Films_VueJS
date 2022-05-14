const mongoose = require('mongoose');

const avisSchema = mongoose.Schema({
    contenu: { type: String, required: true },
    likes: { type: Number, required: true }
});

module.exports = mongoose.model('Avis', avisSchema);