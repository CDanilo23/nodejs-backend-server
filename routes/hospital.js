var express = require('express');

var mdAuthentication = require('../middlewares/authentication');

var app = express();

var Hospital = require('../models/hospital');

//================================
// Get all hospitals
//================================

app.get('/', (req, res, next) => {

    var since = req.query.since || 0;
    since = Number(since);

    Hospital.find({})
        .skip(since)
        .limit(5)
        .populate('user', 'name email')
        .exec(
            (err, hospitals) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error getting hospitals',
                        errors: err
                    });
                }

                Hospital.count({}, (err, count) => {
                    
                    res.status(200).json({
                        ok: true,
                        hospitals: hospitals,
                        total: count
                    });

                })


            });

});

//================================
// Create new hospital
//================================

app.post('/', mdAuthentication.verifyToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save((err, hospitalSaved) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved,
        });
    });


});

//================================
// Update hospital
//================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error searching hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'The Hospital with the id ' + id + ' not exist',
                errors: err
            })
        }

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save((err, hospitalSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating the hospital',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                hospital: hospitalSaved
            });

        });

    });

});

//================================
// Delete hospital
//================================
app.delete('/:id', (req, res) => {
    
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {
       
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting hospital',
                errors: err
            });
        }

        if (!hospitalDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'The Hospital with the id ' + id + ' not exist',
                errors: {message: 'The Hospital with the id ' + id + ' not exist' }
            });
        }
        

        res.status(200).json({
            ok: true,
            hospital: hospitalDeleted
        });

    });
});

module.exports = app;