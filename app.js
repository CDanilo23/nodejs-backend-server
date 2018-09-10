// Requires

var express = require('express');
var mongoose = require('mongoose');


// Initialize variables
var app = express();

// Import Routes
var appRoutes = require ('./routes/app');
var userRoutes = require('./routes/user');

//DB connections
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;

    console.log('Database running: \x1b[32m%s\x1b[0m', 'online')

}); 

//Routes
app.use('/user', userRoutes);
app.use('/', appRoutes);

// Listening request
app.listen(3000,  () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});
