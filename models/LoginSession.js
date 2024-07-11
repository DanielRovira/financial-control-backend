const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loginSessionSchema = new Schema({
    _id: String,
    expires: Date,
    session: Object
});

module.exports = mongoose.model('LoginSessions', loginSessionSchema, 'LoginSessions');
