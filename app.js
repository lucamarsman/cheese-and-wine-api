import express from 'express';
import cheesesController from './controllers/cheeses.js';

// Create expess server object
const app = express();

// Controllers
app.use('/cheeses', cheesesController);

// Start web server
app.listen(3000, () => {
    console.log('Express API running on port 3000');
});

