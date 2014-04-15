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
                rawDate: function(value) {
                    var date = value.isComputed ? value() : value;
                    return date.toLocaleDateString();
                    return date.toLocaleString();
                },
                rawTime: function(value) {
                    var date = value.isComputed ? value() : value;
                    return date.toLocaleTimeString();
                },
                // @TODO
                relativeDate: function(value) {
                    var date = value.isComputed ? value() : value;
                    return date.toLocaleDateString();
                }
            },
            events: {
            }
        });
    }
);
