// Requires

var express = require('express');
var mongoose = require('mongoose');


// Initialize variables
var app = express();


//DB connections
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) =>{
    if(err) throw err;

    console.log('Database running: \x1b[32m%s\x1b[0m', 'online')

}); 

// Routes

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Request was correctly'
    })

})

// Listening request
app.listen(3000,  () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});
