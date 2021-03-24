const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    string: String,
    date: String,
    isPublished: Boolean
});

const Messages = mongoose.model("messages", MessagesSchema);

module.exports = Messages;