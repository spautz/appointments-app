steal(
    'can',
    'jquery',
    'underscore',

    // Local views
    './appointment-create-form.mustache',

    function (can, $, _, appointmentCreateFormTmpl) {
        'use strict';

        // can.Component is basically Web Components for Mustache templates.
        // This is here mostly for demo purposes: unless we use this in more than one place,
        // it wouldn't make much sense to make a full component for it.

        return can.Component.extend({
            tag: 'appointment-create-form',
            template: appointmentCreateFormTmpl,
            scope: {
                appointmentList: [],
                doctorList: []
            },
            // Note: these events *could* be specified via `can-submit` and `can-reset`
            // attributes, referencing functions defined on the scope above.
            events: {
                submit: function ($form, e) {
                    var appointmentList = this.scope.attr('appointmentList');
                    var doctorList = this.scope.attr('doctorList');

                    // Make a new appointment, if everything's good to go
                    var newAppointmentData = {
                        // autoincrement the id
                        id: _.max(_.pluck(appointmentList, 'id')) + 1,
                        // other fields are used more or less as-is
                        note: $form.find('#note').val(),
                        date: new Date($form.find('#date').val()),
                        doctor: doctorList[ $form.find('#doctor').val() ]
                    };

                    // @TODO: Real models and fixtures
                    appointmentList.push(newAppointmentData);

                    e.preventDefault();
                    e.stopPropagation();
                    window.history.pushState({}, '', '/');
                },

                // We treat the 'reset' event as the form's cancel
                // (We could also just use a link to '/', or an attribute like can-click="goHome",
                // but this keeps our form's 'reset' code next to its 'submit' code.
                reset: function ($form, e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.history.pushState({}, '', '/');
                }
            }
        });
    }
);
