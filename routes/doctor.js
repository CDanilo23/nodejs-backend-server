var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Doctor = require('../models/doctor');

//================================
// Get all doctors
//================================

app.get('/', (req, res, next) => {

    Doctor.find({}, 'name img user hospital')
        .exec(
            (err, doctors) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error getting doctors',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    doctors: doctors,
                });

            });

});

//================================
// Create new doctor
//================================

app.post('/', mdAuthentication.verifyToken, (req, res) => {

    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        img: body.img,
        user: body.user,
        hospital: body.hospital
    });

    doctor.save((err, doctorSaved) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving doctor',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: doctorSaved,
            doctorToken: req.doctor
        });
    });


});

//================================
// Update doctor
//================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (err, doctor) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error searching doctor',
                errors: err
            });
        }

        if (!doctor) {
            return res.status(400).json({
                ok: false,
                message: 'The Doctor with the id ' + id + ' not exist',
                errors: err
            })
        }

        doctor.name = body.name;
        doctor.img = body.img;
        doctor.user = body.user;
        doctor.hospital = body.hospital;

        doctor.save((err, doctorSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating the doctor',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                doctor: doctorSaved
            });

        });

    });

});

//================================
// Delete user
//================================
app.delete('/:id', (req, res) => {
    
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, doctorDeleted) => {
       
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting doctor',
                errors: err
            });
        }

        if (!doctorDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'The Doctor with the id ' + id + ' not exist',
                errors: {message: 'The Doctor with the id ' + id + ' not exist' }
            });
        }
        

        res.status(200).json({
            ok: true,
            doctor: doctorDeleted
        });

    });
});

module.exports = app;