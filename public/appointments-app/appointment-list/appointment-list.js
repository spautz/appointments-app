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
            helpers: {
                // In practice, these would probably be *global* template helpers,
                // not local as they are here.
                rawDate: function(value) {
                    var date = value.isComputed ? value() : value;
                    return date.format('M/D/YYYY');
                },
                rawTime: function(value) {
                    var date = value.isComputed ? value() : value;
                    return date.format('h:mm a');
                },
                // @TODO
                relativeDate: function(value) {
                    var date = value.isComputed ? value() : value;
                    return date.calendar();
                }
            },
            events: {
            }
        });
    }
);
