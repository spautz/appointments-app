/*global __dirname, console, process, require*/
/**
 * This is just a minimal server that delivers static files (if found) and public/index.html for
 * everything else.
 * It's useful for single-page apps with pushstate-based routing.
 */

var express = require('express');
var fs = require('fs');

var app = express();

var publicDirPath = __dirname + '/../public';
var staticFileRegex = /\.(js|css|less|png|gif|jpg|bmp|ico)$/i;

// @TODO: Config should live here
var port = 8080;

app.configure(function() {
    'use strict';

    app.use(express.static(publicDirPath));

    app.use(express.logger('dev'));

    // requesting any non-css/js/image page will return index.html.
    // This is evil but quick.
    app.use(function(req, res, next) {
        if (req.accepts('html') && !staticFileRegex.test(req.url)) {
            fs.readFile(publicDirPath + '/index.html', 'utf8', function(err, text) {
                res.send(text);
            });
        } else {
            res.status(404).send('Not found');
        }
    });
});

app.listen(port);
console.log('Server started at: http://127.0.0.1:' + port + '/');
