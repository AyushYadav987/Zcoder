const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Contest', ContestSchema);