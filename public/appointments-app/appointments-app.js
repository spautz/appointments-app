steal(
    'can',
    'jquery',
    'underscore',

    // Local views
    './appointments-app.mustache',
    './appointment-create-form.mustache',

    // Some useful canjs plugins
    'can/construct/super',
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
        var appointmentList = new can.List([
            {
                id: 1,
                note: 'Annual checkup',
                date: new Date(2011, 1, 10, 1, 0),
                doctor: 'Dr. Charlotte'
            }, {
                id: 2,
                note: 'Annual checkup',
                date: new Date(2012, 2, 15, 12, 0),
                doctor: 'Dr. Bob'
            }, {
                id: 3,
                note: 'Annual checkup',
                date: new Date(2013, 4, 5, 8, 0),
                doctor: 'Dr. Bob'
            }, {
                id: 4,
                note: 'Interview',
                date: new Date(2014, 3, 9, 12, 15),
                doctor: 'Dr. Alice'
            }
        ]);
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
                        appointmentsList: appointmentList,
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
                        appointmentList,
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
                var formFields = $form.serializeArray();
                var newAppointmentData = {};

                // this snippet just gives us an autoincremented id
                newAppointmentData.id = _.max(_.pluck(appointmentList, 'id')) + 1;

                _.each(formFields, function(field) {
                    newAppointmentData[field.name] = field.value;
                });

                // @TODO: Real models and fixtures
                appointmentList.push(newAppointmentData);

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
