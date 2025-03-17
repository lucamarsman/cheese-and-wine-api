import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

// Createexpress router
const router = express.Router();

router.post('/register', async (req, res) => {
    // Use passport-local-mongoose inherited methods in user model to try creating new user
    // Create user first, then add pw second so it gets salted and hashed
    try{
        const user = new User({ username: req.body.username });
        await user.setPassword(req.body.password);
        await user.save();
        return res.status(201).json(user);
    }catch(err){
        return res.status(400).json(err);
    }
});

// Make public
export default router;