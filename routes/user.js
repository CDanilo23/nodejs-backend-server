var express = require('express');
var bcrypt = require('bcrypt');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var User = require('../models/user');

//================================
// Get all users
//================================

app.get('/', (req, res, next) => {

    var since = req.query.since || 0;
    since = Number(since);

    User.find({}, 'name email img role')
        .skip(since)
        .limit(5)
        .exec(
            (err, users) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error getting users',
                        errors: err
                    });
                }

                User.count({}, (err, count)=> {
                    
                    res.status(200).json({
                        ok: true,
                        users: users,
                        total: count
                });
                });

            });

});

//================================
// Create new user
//================================

app.post('/', mdAuthentication.verifyToken, (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, userSaved) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving user',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved,
            userToken: req.user
        });
    });


});

//================================
// Update user
//================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error searching user',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'The User with the id ' + id + ' not exist',
                errors: err
            })
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating the user',
                    errors: err
                });
            }
            
            userSaved.password = '';

            res.status(200).json({
                ok: true,
                user: userSaved
            });

        });

    });

});

//================================
// Delete user
//================================
app.delete('/:id', (req, res) => {
    
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
       
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting user',
                errors: err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'The User with the id ' + id + ' not exist',
                errors: {message: 'The User with the id ' + id + ' not exist' }
            });
        }
        

        res.status(200).json({
            ok: true,
            user: userDeleted
        });

    });
});

module.exports = app;