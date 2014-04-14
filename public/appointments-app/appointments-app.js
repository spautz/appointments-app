steal(
    'can',
    'jquery',
    'underscore',

    // Local views
    './appointments-app.mustache',

    // Some useful canjs plugins
    'can/construct/super',
    'can/route/pushstate',

    function (can, $, _, layoutTmpl) {
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


        ///////////////////////////////////////////////////////////////////
        // Local data/scope: normally we'd never have these floating around outside a component,
        // but it's cheap and easy for this demo.
        // @TODO: Real models and fixtures
        var appointmentList = new can.List([
            {
                id: 1,
                datetime: new Date('2009'),
                doctor: 'Dr. Alice'
            }, {
                id: 2,
                datetime: new Date('2012'),
                doctor: 'Dr. Bob'
            }
        ]);
        // This tracks the appointment we're viewing details for, if any
        var appointmentSelected = can.compute(null);
        // This tracks whether or not the "Request Appointment" form is displayed
        var showAppointmentCreateForm = can.compute(false);

        return can.Control.extend({
            // static properties would go here, if we had any
        }, {
            // prototype properties

            init: function() {
                console.info('AppointmentsApp.init()', arguments, this);

                // Manual rendering is awkward and weird. Let's do it anyway.
                this.element.html(
                    layoutTmpl({
                        appointmentsList: appointmentList,
                        appointmentSelected: appointmentSelected,
                        showAppointmentCreateForm: showAppointmentCreateForm
                    })
                );

                // This will fire one of the 'route' events below
                can.route.ready();
            },

            /**
             * Everything is driven by the app state, which (usually) comes from the route.
             * The route gets translated to a params object (which we treat as the app state)
             * then this function's job is to do the lower-level work to update our observables
             * to match and reflect that app state: translating data into semantics.
             *
             * @param Object
             */
            setAppState: function(state) {
                state = state || {};

                // @TODO

                console.info('setAppState: ', state);
            },

            ///////////////////////////////////////////////////////////////////
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
