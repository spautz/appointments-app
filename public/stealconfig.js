// IFF we're in a browser environment (i.e., not building), use a cachebuster
if (typeof window !== 'undefined') {
    steal.config(
        'suffix',
        (window.appConfig && window.appConfig.cachebuster) ||
            (Date.now && Date.now()) || new Date().getTime()
    );
}

steal.config({
    // This is a mapping from *module id to file*
    map: {
        '*': {
            'can/util/util.js': 'can/util/jquery/jquery.js'
        }
    },
    // This is a mapping from *module path to directory*
    paths: {
        'bootstrap/': 'bower_components/bootstrap/',
        'can/': 'bower_components/canjs/steal/canjs/',
        'jquery/': 'bower_components/jquery/dist/',
        'moment/': 'bower_components/moment/',
        'underscore/': 'bower_components/underscore/'
    },
    // 3rd party libraries which put their stuff into the global namespace
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'moment': {
            exports: 'moment'
        },
        'underscore/underscore.js': {
            exports: '_'
        }
    },
    ext: {
        js: 'js',
        css: 'css',
        less: 'steal/less/less.js',
        coffee: 'steal/coffee/coffee.js',
        ejs: 'can/view/ejs/ejs.js',
        mustache: 'can/view/mustache/mustache.js'
    }
});
