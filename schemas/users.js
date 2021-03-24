const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    id: Number,
    first_name: String,
    last_name: String,
    username: String,
    type: String,
    status: String,
    latecomer: Boolean,
    authDate: String,
    photo: Object
});

const Users = mongoose.model("users", UsersSchema);

module.exports = Users;