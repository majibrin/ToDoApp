import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const requireAuth = async (req, res, next) => {
    // 1. Verify Authentication Header
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    // Header format is 'Bearer <token>'
    const token = authorization.split(' ')[1];

    try {
        // 2. Verify Token and Extract User ID
        const { _id } = jwt.verify(token, process.env.SECRET);
        
        // 3. Attach User ID to the Request
        // Find user by ID and select ONLY the _id property (no password)
        req.user_id = _id; 
        
        // Proceed to the next middleware/controller function (e.g., getTodos)
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized (Invalid token)' });
    }
};

export default requireAuth;