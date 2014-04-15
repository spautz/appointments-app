steal(
    'can',
    'appointments-app/models/doctor',

    function (can, DoctorModel) {
        'use strict';

        // Although it's not used by the app, this class registers itself into the global
        // namespace, as 'app.model.Appointment' -- useful for testing via the console.

        return can.Model.extend('app.model.Appointment', {
            // static constructor properties
            id: 'id',

            findAll: 'GET /api/0.1/appointment/',
            findOne: 'GET /api/0.1/appointment/{id}',
            create:  'POST /api/0.1/appointment',
            update:  'PUT /api/0.1/appointment/{id}',
            destroy: 'DELETE /api/0.1/appointment/{id}',

            attributes: {
                // appointment has_a doctor
                doctor: DoctorModel.models
            }
        }, {
            // prototype properties would go here, if we had any
        });
    }
);
