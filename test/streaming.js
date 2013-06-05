'use strict'; /*jslint node: true, es5: true, indent: 2 */
var request = require('request');
var fs = require('fs');
var test = require('tap').test;
var gzbz2 = require('..');
var streaming = require('../streaming');

function download(url, filename, callback) {
  request(url).pipe(fs.createWriteStream(filename)).on('end', function() {
    callback(null, filename);
  });
}

function start(err, filepath) {
  if (err) throw err;

  console.error('Loading: ' + filepath);
  var contents = fs.readFileSync(filepath, {encoding: 'utf8'});

  console.time('gzip');
  var gz_in = fs.createReadStream(filepath);
  var gz_out = fs.createWriteStream(filepath + '.gz');
  gz_in.pipe(new streaming.GzipDeflater()).pipe(gz_out).on('end', function() {
    console.timeEnd('gzip');
    gz_in = fs.createReadStream(filepath + '.gz');
    var inflater = gz_in.pipe(new streaming.GzipInflater());
    // gz_out = fs.createWriteStream(filepath);
    test('gzip deflation', function (t) {
      t.bufferStream(inflater, function (s) {
        t.equal(s, contents);
        t.end();
      });
    });
  });

  console.time('bzip2');
  var bz2_in = fs.createReadStream(filepath);
  var bz2_out = fs.createWriteStream(filepath + '.bz2');
  bz2_in.pipe(new streaming.BzipDeflater()).pipe(bz2_out).on('end', function() {
    console.timeEnd('bzip2');
    bz2_in = fs.createReadStream(filepath + '.bz2');
    var inflater = bz2_in.pipe(new streaming.BzipInflater());
    test('bzip2 deflation', function (t) {
      t.bufferStream(inflater, function (s) {
        t.equal(s, contents);
        t.end();
      });
    });
  });
}

var shakespeare_filepath = 'shakespeare.txt';
fs.exists(shakespeare_filepath, function (exists) {
  if (!exists) {
    download('http://norvig.com/ngrams/shakespeare.txt', shakespeare_filepath, start);
  }
  else {
    start(null, shakespeare_filepath);
  }
});
