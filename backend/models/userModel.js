// backend/models/userModel.js (ES Module Syntax)

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator'; // Import the default export
// If validator/bcrypt were giving trouble, sometimes we need to import specific parts:
// import * as bcrypt from 'bcrypt'; 
// import validator from 'validator'; 


const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// --- Static Signup Method ---
userSchema.statics.signup = async function(email, password) {
    
    // Validation
    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    
    // Check if email is valid using the validator library
    if (!validator.isEmail(email)) { 
        throw Error('Email is not valid');
    }
    
    // Check if user already exists
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const user = await this.create({ email, password: hashedPassword });
    return user;
};

// --- Static Login Method ---
userSchema.statics.login = async function(email, password) {
    
    // Validation
    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect credentials'); 
    }

    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect credentials'); 
    }

    return user;
};


// Use export default for ES Module export
export default mongoose.model('User', userSchema);