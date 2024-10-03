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
    permissions: {
        type: Object,
    }
});

const sessionSchema = new Schema({
    expires: {
        type: String,
        required: true,
    },
    session: {
        type: Object,
        required: true,
    }
});

const myDB = mongoose.connection.useDb('USERS', { useCache: true });

const User = myDB.model('user', userSchema)
const Session = myDB.model('loginsession', sessionSchema)

// module.exports = myDB.model('User', userSchema);
module.exports = { User, Session };

// users
