const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    pseudo: { type: String, required: true },
    password: { type: String, required: true },
    likedFilmsId: { type: [String], required: true, default: [] },
    dislikedFilmsId: { type: [String], required: true, default: [] },
    noticesFilmsId: { type: [String], required: true, default: [] },
    likedNoticesId: { type: [String], required: true, default: [] },
    isAdmin: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('User', filmSchema);