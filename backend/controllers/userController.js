// backend/controllers/userController.js
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Helper function to create a JWT token
const createToken = (_id) => {
    // The SECRET key is imported from the .env file
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// --- Login User Controller ---
// backend/controllers/userController.js (Inside loginUser)

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // This 'login' function is defined statically in your userModel
        const user = await User.login(email, password); 

        // If successful, create a token
        const token = createToken(user._id);

        res.status(200).json({ email, token });
    } catch (error) {
        // This is where the error from User.login() is caught and sent to the frontend
        res.status(400).json({ error: error.message }); 
    }
};

// --- Signup User Controller ---
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);
        
        // Create a token
        const token = createToken(user._id);

        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { loginUser, signupUser };