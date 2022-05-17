const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    pseudo: { type: String, required: true },
    password: { type: String, required: true },
    likedFilmsId: { type: [String], required: false },
    noticesFilmsId: { type: [String], required: false },
    likedNoticesId: { type: [String], required: false },
    isAdmin: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', filmSchema);