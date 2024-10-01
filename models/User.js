const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    database: {
        type: String,
    },
    permissions: {
        type: Object,
    }
});

const myDB = mongoose.connection.useDb('USERS');

module.exports = myDB.model('User', userSchema);

// users
