import express from 'express';
import bodyParser from 'body-parser';
import cheesesController from './controllers/cheeses.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";
import mongoose from 'mongoose';

// Create expess server object
const app = express();
app.use(bodyParser.json());

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

// Controllers
app.use('/api/v1/cheeses', cheesesController);

// Start web server
app.listen(3000, () => {
    console.log('Express API running on port 3000');
});

