steal(
    'can',

    function (can) {
        'use strict';

        // Although it's not used by the app, this class registers itself into the global
        // namespace, as 'app.model.Doctor' -- useful for testing via the console.

        return can.Model.extend('app.model.Doctor', {
            // static constructor properties
            id: 'id',

            findAll: 'GET /api/0.1/doctor/',
            findOne: 'GET /api/0.1/doctor/{id}',
            create:  'POST /api/0.1/doctor',
            update:  'PUT /api/0.1/doctor/{id}',
            destroy: 'DELETE /api/0.1/doctor/{id}'
        }, {
            // prototype properties would go here, if we had any
        });
    }
);
