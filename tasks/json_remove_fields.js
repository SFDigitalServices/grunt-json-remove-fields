/*
 * grunt-json-remove-fields
 * https://github.com/diepet/grunt-json-remove-fields
 *
 * Copyright (c) 2015 diepet
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('json_remove_fields', 'A Grunt task to remove specified fields in JSON files.', function() {

      // getting source file
      var src = this.data.src;

      if (!src) {
          grunt.log.error('No source specified');
          return false; // abort execution
      }

      if (!grunt.file.exists(src)) {
          grunt.log.error('File ' + src + ' not found');
          return false; // abort execution
      }

      // getting destination file
      var dest = this.data.dest;

      if (!dest) {
          dest = src;
      }

      // tracking which fields were removed
      var fields = [];

      var _ = require('lodash');

      function deleteEmptyValues(test) {
          for (var i in test) {
              if (_.isEmpty(test[i])) {
                  delete test[i];
              } else if (_.isObject(test[i])) {
                  deleteEmptyValues(test[i]);
              }
          }
      }

      // read src file as JSON object
      var srcJSON = grunt.file.readJSON(src);

      deleteEmptyValues(srcJSON);
      // run it twice, make it nice
      deleteEmptyValues(srcJSON);

      srcJSON = _.omitBy(srcJSON, _.isEmpty);

      // getting space option
      var space = this.data.space;

      if (!space) {
          space = 2; // default value to 2
      }

      grunt.file.write(dest, JSON.stringify(srcJSON, null, space)); // serialize JSON to file again

      grunt.log.writeln( src + " updated to remove all empty values.");
  });

};
