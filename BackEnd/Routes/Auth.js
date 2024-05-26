const express = require('express');
const router = express.Router();
const AuthService = require('../services/Auth'); 
const verifyToken = require('../Middleware/veryfyToken');



router.post('/signup', async (req, res) => {
    try { 
        const result = await AuthService.signup(req.body.user);
        res.status(201).json(result);
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'Error signing up user' });
    }
});


router.post('/signin', async (req, res) => {
    console.log('here'); 
    const { username, password, isInstructor } = req.body;

    try {
        const result = await AuthService.authenticate(username, password, isInstructor);
        if (result.success) {
            res.json(result);
        } else {
            res.status(401).json({ success: false, message: 'Authentication failed' });
        }
    } catch (err) {
        console.error('Sign-in error:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// User profile endpoint

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const { userId, userType } = req.user; // Extract both userId and userType from the JWT payload

        const userData = await AuthService.getUserProfile(userId, userType);

        // The check should correctly validate if userData is not empty.
        if (userData) {
            // Send back the successful response with the user's data.
            const { student_id, username, first_name, last_name, email } = userData;
            res.json({
                success: true,
                profileData: {
                    student_id,
                    username,
                    first_name,
                    last_name,
                    email
                }
            });
        } else {
            // If no user data is found, send a 'User not found' response.
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        // Log and return any server errors.
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;
