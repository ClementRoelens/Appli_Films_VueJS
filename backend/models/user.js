const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    pseudo: { type: String, required: true },
    password: { type: String, required: true },
    likedFilmsdId: { type: [String], required: false },
    noticesFilmsId: { type: [String], required: false },
    likedNoticesId: { type: [String], required: false }
});

module.exports = mongoose.model('User', filmSchema);