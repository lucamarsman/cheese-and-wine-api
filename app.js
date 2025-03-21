import express from 'express';
import bodyParser from 'body-parser';
import cheesesController from './controllers/cheeses.js';
import usersController from './controllers/users.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";
import mongoose from 'mongoose';
import path from 'path';
import dotenv from "dotenv";
dotenv.config();

import cors from 'cors'


// Passport auth
import passport from 'passport';
import User from './models/user.js';

// JWT auth
import cookieParser from 'cookie-parser';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// Create expess server object
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Get public path for angular client app
const __dirname = path.resolve();
app.use(express.static(`${__dirname}/public`));

// swagger config
const docOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cheese API',
            version: '1.0.0'
        }
    },
    apis: ['./controllers/*.js'] // where to find api methods (controllers)
};
const openapiSpecification = swaggerJSDoc(docOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// db connect
mongoose.connect(process.env.DB, {})
    .then((res) => console.log("Connected to MongoDb"))
    .catch((err) => console.log(`Connection failure ${err}`))

// cors: allow angular client http access
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE,HEAD,OPTIONS'
}));

// passport auth config
app.use(passport.initialize());

// Passport-local is the default
passport.use(User.createStrategy())

// Jwt config
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PASSPORT_SECRET
}

// Jwt strategy
let strategy = new JwtStrategy(jwtOptions, async (jwt_payload, callback) => {
    try{
        const user = await User.findById(jwt_payload.id);
        if(user){
            // User exists, send back no error plus the user object
            return callback(null, user);
        }
        // User not found
        return callback(null, false);
    }catch(err){
        return callback(err, false);
    }
});

passport.use(strategy);

// Controllers
app.use('/api/v1/cheeses', cheesesController);
app.use('/api/v1/users', usersController);
app.use('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

// Start web server
app.listen(3000, () => {
    console.log('Express API running on port 3000');
});

