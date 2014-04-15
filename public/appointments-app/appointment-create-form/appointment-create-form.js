steal(
    'can',
    'moment',
    'jquery',
    'underscore',

    // Local views
    './appointment-create-form.mustache',

    function (can, moment, $, _, appointmentCreateFormTmpl) {
        'use strict';

        // can.Component is basically Web Components for Mustache templates.
        // This is here mostly for demo purposes: unless we use this in more than one place,
        // it wouldn't make much sense to make a full component for it.

        return can.Component.extend({
            tag: 'appointment-create-form',
            template: appointmentCreateFormTmpl,
            scope: {
                appointmentList: [],
                doctorList: [],
                errorMessage: null
            },
            // Note: these events *could* be specified via `can-submit` and `can-reset`
            // attributes, referencing functions defined on the scope above.
            events: {
                submit: function ($form, e) {
                    var appointmentList = this.scope.attr('appointmentList');
                    var doctorList = this.scope.attr('doctorList');
                    var errorMessage;

                    // Make a new appointment, if everything's good to go.
                    // Normally we'd just use a jquery plugin or something to get the
                    // form fields as a single object: doing a bunch of .find() and .val()
                    // lookups is awful for anything but a proof-of-concept.
                    var newAppointmentData = {
                        // autoincrement the id
                        id: _.max(_.pluck(appointmentList, 'id')) + 1,
                        // other fields are used more or less as-is
                        note: $form.find('#note').val(),
                        date: moment(
                            $form.find('#date').val() + ' ' + $form.find('#time').val()
                        ),
                        doctor: doctorList[ $form.find('#doctor').val() ]
                    };

                    // Silly pretend validation: inline but not *too* terrible.
                    // This really belongs on the model, though.
                    if (!newAppointmentData.note) {
                        errorMessage = 'Please enter a note for this appointment';
                    } else if (!newAppointmentData.date.isValid()) {
                        errorMessage = 'Please enter a valid date';
                        // @TODO: Maybe make sure it's at a reasonable hour
                    } else if (!newAppointmentData.doctor) {
                        errorMessage = 'Please select a doctor';
                    }

                    e.preventDefault();
                    e.stopPropagation();

                    if (errorMessage) {
                        this.scope.attr('errorMessage', errorMessage);
                    } else {
                        // @TODO: Real models and fixtures
                        this.scope.attr('errorMessage', null);
                        appointmentList.push(newAppointmentData);
                        window.history.pushState({}, '', '/');
                    }
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
