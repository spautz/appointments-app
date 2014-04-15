steal(
    'can',
    'jquery',
    'underscore',

    // Local views
    './appointments-app.mustache',
    './appointment-create-form.mustache',

    // Components
    'appointments-app/appointment-list',

    // Some useful canjs plugins
    'can/construct/super',
    'can/map/sort',
    'can/route/pushstate',

    function (can, $, _, layoutTmpl, appointmentCreateFormTmpl) {
        'use strict';

        // This is the top-level control for the app: it handles routing and the initial
        // scaffolding for the page. Normally it would do authentication and other prerequisite
        // checks, then kick off routing and render the appropriate control(s) for the route,
        // which would in turn handle their own data/interactions.
        //
        // Since this is such a tiny app, however, we're actually handling data and interactions
        // *here*. It's a bit weird, and it wouldn't be an appropriate place in any non-tiny app,
        // but it's good enough for a demo.

        // Also, since there are only 3 routes in total, they're defined directly on this control,
        // instead of offloaded to a routes.js. They're at the very bottom of this file.


        ///////////////////////////////////////////////////////////////////////////////////////////
        // Local data/scope
        // Normally we'd never have these floating around outside a component, but it's cheap
        // and easy for this demo.

        // @TODO: Real models and fixtures
        var doctorList = new can.List([
            {
                id: 1,
                name: 'Dr. Alice Adams'
            }, {
                id: 2,
                name: 'Dr. Bob Brown'
            }, {
                id: 3,
                name: 'Dr. Charlotte Carpenter'
            }
        ]);

        // @TODO: Real models and fixtures, and nice references to doctors (instead of hardcoded
        // array indices)
        var rawAppointmentList = new can.List([
            {
                id: 1,
                note: 'Annual checkup',
                date: new Date(2011, 1, 10, 1, 0),
                doctor: doctorList[2]
            }, {
                id: 2,
                note: 'Annual checkup',
                date: new Date(2012, 2, 15, 12, 0),
                doctor: doctorList[1]
            }, {
                id: 3,
                note: 'Annual checkup',
                date: new Date(2013, 4, 5, 8, 0),
                doctor: doctorList[1]
            }, {
                id: 4,
                note: 'Interview',
                date: new Date(2014, 3, 16, 12, 15),
                doctor: doctorList[0]
            }
        ]);

        // appointmentList is the raw data source; these two lists are derived from it
        var futureAppointmentList = can.compute(function() {
            var now = (Date.now && Date.now()) || new Date().getTime();

            return rawAppointmentList.filter(function(appointment) {
                return appointment.attr('date') >= now;
            }).sort(function(appointment1, appointment2) {
                // newest first
                return appointment1.date < appointment2.date;
            });
        });
        var pastAppointmentList = can.compute(function() {
            var now = (Date.now && Date.now()) || new Date().getTime();

            return rawAppointmentList.filter(function(appointment) {
                return appointment.attr('date') < now;
            }).sort(function(appointment1, appointment2) {
                // newest first
                return appointment1.date < appointment2.date;
            });
        });

        // This tracks the appointment we're viewing details for, if any.
        // This gets called as a setter only; it basically just ensures we only have one
        // appointment selected at a given time.
        var appointmentSelected = can.compute(null, function(newVal, oldVal) {
            // deselect the old, select the new
            console.log('appointmentSelected()', arguments, this);
            if (oldVal) {
                oldVal.attr('selected', false);
            }
            if (newVal) {
                newVal.attr('selected', true);
            }
            return newVal;
        });
        // This tracks whether or not the "Request Appointment" form is displayed
        var showAppointmentCreateForm = can.compute(false);


        ///////////////////////////////////////////////////////////////////////////////////////////
        // Control definition

        return can.Control.extend({
            // static properties would go here, if we had any
        }, {
            // prototype properties

            init: function() {
                // Manual rendering is awkward and weird. Let's do it anyway.
                this.element.html(
                    layoutTmpl({
                        rawAppointmentList: rawAppointmentList,
                        futureAppointmentList: futureAppointmentList,
                        pastAppointmentList: pastAppointmentList,
                        doctorList: doctorList,
                        appointmentSelected: appointmentSelected,
                        showAppointmentCreateForm: showAppointmentCreateForm
                    }, {
                        partials: {
                            appointmentCreateForm: appointmentCreateFormTmpl
                        }
                    })
                );

                // This will fire one of the 'route' events below
                can.route.ready();
            },

            /**
             * This is just sugar for returning to the App's default view.
             * We update the route, which triggers setAppState.
             */
            goHome: function() {
                window.history.pushState({}, '', '/');
            },

            /**
             * Everything is driven by the app state, which (usually) comes from the route.
             * The route gets translated to a params object (which we treat as the app state)
             * then this function's job is to do the lower-level work to update our observables
             * to match and reflect that app state: translating data into semantics.
             *
             * To set app state, it's (usually) better to use window.location.pushState()
             * instead of calling this function.
             *
             * @param Object
             */
            setAppState: function(state) {
                state = state || {};
                can.batch.start();

                // select a new appointment (if any), or deselect the old
                if (state.id) {
                    appointmentSelected(_.findWhere(
                        rawAppointmentList,
                        { id: parseInt(state.id, 10) }
                    ));
                } else {
                    appointmentSelected(null);
                }

                // This toggles the "new appointment" form
                showAppointmentCreateForm(!!state.appointmentCreate);

                can.batch.stop();
            },

            ///////////////////////////////////////////////////////////////////////////////////////
            // Events

            '.appointment-create-form submit': function($form, e) {
                // Make a new appointment, if everything's good to go
                var newAppointmentData = {
                    // autoincrement the id
                    id: _.max(_.pluck(rawAppointmentList, 'id')) + 1,
                    // other fields are used more or less as-is
                    note: $form.find('#note').val(),
                    date: new Date( $form.find('#date').val() ),
                    doctor: doctorList[ $form.find('#doctor').val() ]
                };

                // @TODO: Real models and fixtures
                rawAppointmentList.push(newAppointmentData);

                this.goHome();
                e.preventDefault();
                e.stopPropagation();
            },

            // We treat the 'reset' event as the form's cancel
            // (We could also just use a link to '/', or an attribute like can-click="goHome",
            // but this keeps our form's 'reset' code next to its 'submit' code.
            '.appointment-create-form reset': function($form, e) {
                this.goHome();
                e.preventDefault();
                e.stopPropagation();
            },

            ///////////////////////////////////////////////////////////////////////////////////////
            // Routes

            // Routes with special params come first
            'appointment/new route': function() {
                this.setAppState({
                    appointmentCreate: true
                });
            },

            // Most routes don't need any defaults or special handling:
            // the route data already represents the full config
            '/ route': 'setAppState',
            'appointment/:id route': 'setAppState'
        });
    }
);
