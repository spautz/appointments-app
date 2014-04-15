steal(
    'can',
    'jquery',
    'underscore',

    // Local views
    './appointment-list.mustache',

    function (can, $, _, listTmpl) {
        'use strict';

        // can.Component is basically Web Components for Mustache templates.
        // This is here mostly for demo purposes.

        return can.Component.extend({
            tag: 'appointment-list',
            template: listTmpl,
            scope: {
                appointments: []
            },
            events: {
            }
        });
    }
);
