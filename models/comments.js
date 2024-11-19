const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commenter: { type: String, required: true },
    postID: { type: String, required: true },
    content: { type: String, required: true },
});

module.exports = mongoose.model('Comment', commentSchema);
