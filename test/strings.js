'use strict'; /*jslint node: true, es5: true, indent: 2 */
var fs = require('fs');
var test = require('tap').test;
var gzbz2 = require('..');
var streaming = require('../streaming');

// Read in our test file
var filepath = process.argv[2] || 'strings.js';
fs.readFile(filepath, 'utf8', function(err, contents) {
  // var contents = fs.readFileSync(filepath, {encoding: 'utf8'});
  if (err) throw err;

  // compress it first.
  var gzip = new gzbz2.Gzip();
  gzip.init({level: 3});
  var gzipped = gzip.deflate(contents, 'utf8');
  var gzipped_end = gzip.end();
  gzipped = Buffer.concat([gzipped, gzipped_end]);
  // console.error(gzipped);
  // console.error(gzipped_end);

  // then uncompress it
  var gunzip = new gzbz2.Gunzip();
  gunzip.init({encoding: 'utf8'});
  var inflated = gunzip.inflate(gzipped, 'binary');
  gunzip.end(); // no return value

  test('gzip inflation/deflation', function (t) {
    t.equal(inflated, contents);
    t.end();
  });

});
