var express = require('express');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Doctor = require('../models/doctor');

//================================
// Get all doctors
//================================

app.get('/', (req, res, next) => {

    var since = req.query.since || 0;
    since = Number(since);

    Doctor.find({})
        .skip(since)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
            (err, doctors) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error getting doctors',
                        errors: err
                    });
                }

                Doctor.count({}, (err, count) => {
                    
                    res.status(200).json({
                        ok: true,
                        doctors: doctors,
                        total: count
                    });

                })


            });

});

//================================
// Create new doctor
//================================

app.post('/', mdAuthentication.verifyToken, (req, res) => {

    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
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
        doctor.user = req.user._id;
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
// Delete doctor
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