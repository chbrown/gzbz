'use strict'; /*jslint node: true, es5: true, indent: 2 */
var request = require('request');
var fs = require('fs');
var test = require('tap').test;
var gzbz2 = require('..');
var streaming = require('../streaming');

function download(url, filename, callback) {
  console.error('Downloading file: ' + url);
  request(url).pipe(fs.createWriteStream(filename)).on('end', function() {
    callback(null, filename);
  });
}

function lap(name) {
  var started = Date.now();
  console.error(name + ' started at ' + started);
  return function() {
    var elapsed = Date.now() - started;
    console.error(name + ': ' + elapsed);
  };
}

function start(err, filepath) {
  if (err) throw err;

  console.error('Using file: ' + filepath);
  var contents = fs.readFileSync(filepath, {encoding: 'utf8'});

  test('gzip deflation', function (t) {
    var gz_lap = lap('gzip');
    var gz_deflater = new streaming.GzipDeflater();
    var gz_out = fs.createWriteStream(filepath + '.gz');
    fs.createReadStream(filepath).pipe(gz_deflater).pipe(gz_out);

    gz_deflater.on('end', function() {
      gz_lap();
      var gz_in = fs.createReadStream(filepath + '.gz');
      var gz_inflater = new streaming.GzipInflater({encoding: 'utf8'});
      gz_in.pipe(gz_inflater);

      gz_inflater.on('readable', function() {
        var inflated = gz_inflater.read();
        t.equal(inflated, contents);
        t.end();
        gz_lap();
      });
    });
  });

  test('bzip2 deflation', function (t) {
    var bz2_lap = lap('bzip2');
    var bz2_deflater = new streaming.BzipDeflater();
    var bz2_out = fs.createWriteStream(filepath + '.bz2');
    fs.createReadStream(filepath).pipe(bz2_deflater).pipe(bz2_out);

    bz2_deflater.on('end', function() {
      bz2_lap();
      var bz2_in = fs.createReadStream(filepath + '.bz2');
      var bz2_inflater = new streaming.BzipInflater({encoding: 'utf8'});
      bz2_in.pipe(bz2_inflater);

      bz2_inflater.on('readable', function() {
        var inflated = bz2_inflater.read();
        t.equal(inflated, contents);
        t.end();
        bz2_lap();
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
