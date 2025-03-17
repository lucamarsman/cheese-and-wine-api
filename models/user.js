import mongoose from "mongoose";
// This model should inherit from passport-local-mongoose
// It's a special model for user mgmt NOT a regular model
import passportLocalMongoose from 'passport-local-mongoose';

// Passport handles password vlaidation - OMIT from schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 8
    },
    password: {
        type: String
    }
});

// Inherit from / extend passport local mongoose to get all properties and methods (e.g. register())
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
export default User;