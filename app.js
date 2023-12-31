const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// connection to Mongo database
mongoose.connect('mongodb+srv://jamiepham:'+ process.env.MONGO_ATLAS_PW +'@node-rest-shop.osmdcrr.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).then(() => console.log('connection provided...'))
.catch(err =>console.log(err));

// depracation warning fix
mongoose.Promise = global.Promise;

// Middleware
app.use(morgan('dev'));
// body parsing
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS handling Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
})

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// error message if routes not found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// fatal error message
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;