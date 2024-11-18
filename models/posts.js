const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to a User
    createdAt: { type: Date, default: Date.now } // Automatically sets the timestamp
});

module.exports = mongoose.model('Post', postSchema);
