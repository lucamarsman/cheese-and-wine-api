import express from 'express';
import bodyParser from 'body-parser';
import cheesesController from './controllers/cheeses.js';

// Create expess server object
const app = express();
app.use(bodyParser.json());

// Controllers
app.use('/api/v1/cheeses', cheesesController);

// Start web server
app.listen(3000, () => {
    console.log('Express API running on port 3000');
});

