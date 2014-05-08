var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var fs = require('fs');
var path = require('path');
var chonmage = require('chonmage');

// Consts
const PLUGIN_NAME = 'gulp-chonmage';

// Plugin level function(dealing with files)
function gulpChonmage(config) {
    config = config || {};

    // Creating a stream through which each file will pass
    return through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            this.push(file); // Do nothing if no contents
            return callback();
        }

        if (file.isBuffer()) {
            var rootPath = config.rootPath || path.dirname(templatePath);
            var templateKey = config.tempateKey ? config.templateKey(file.path) : path.basename(file.path);
            var tsFile = chonmage.createTsFileForBrowser(
                chonmage.compile(file.contents, rootPath),
                templateKey
            )
            file.contents = new Buffer(tsFile);
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return callback();
        }
    });
};

// Exporting the plugin main function
module.exports = gulpChonmage;
