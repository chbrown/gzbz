'use strict'; /*jslint node: true, es5: true, indent: 2 */
var util = require('util');
var stream = require('stream');
var gzbz2 = require('./');

var _Deflater = function(opts) {
  stream.Transform.call(this, opts);
  this.z.init(opts);
};
util.inherits(_Deflater, stream.Transform);
_Deflater.prototype._transform = function(chunk, encoding, callback) {
  try {
    var deflated = this.z.deflate(chunk, encoding);
    this.push(deflated);
  } catch (err) {
    this.emit('error', err);
  }
  callback();
};
_Deflater.prototype._flush = function(callback) {
  try {
    var deflated = this.z.end();
    this.push(deflated);
  } catch (err) {
    this.emit('error', err);
  }
  callback();
};

var _Inflater = function(opts) {
  stream.Transform.call(this, opts);
  this.z.init(opts);
};
util.inherits(_Inflater, stream.Transform);
_Inflater.prototype._transform = function(chunk, encoding, callback) {
  try {
    var inflated = this.z.inflate(chunk, encoding);
    this.push(inflated);
  } catch (err) {
    this.emit('error', err);
  }
  callback();
};
_Inflater.prototype._flush = function(callback) {
  try {
    var inflated = this.z.end();
    this.push(inflated);
  } catch (err) {
    this.emit('error', err);
  }
  callback();
};

// Gzip
var GzipDeflater = exports.GzipDeflater = function(opts) {
  if (opts === undefined) opts = {}; // e.g., {encoding: 'utf8', level: 1}
  this.z = new gzbz2.Gzip();
  _Deflater.call(this, opts);
};
util.inherits(GzipDeflater, _Deflater);

var GzipInflater = exports.GzipInflater = function(opts) {
  if (opts === undefined) opts = {};
  this.z = new gzbz2.Gunzip();
  _Inflater.call(this, opts);
};
util.inherits(GzipInflater, _Inflater);


// Bzip2
var BzipDeflater = exports.BzipDeflater = function(opts) {
  if (opts === undefined) opts = {}; // e.g., {encoding: 'utf8', level: 1}
  this.z = new gzbz2.Bzip();
  _Deflater.call(this, opts);
};
util.inherits(BzipDeflater, _Deflater);

var BzipInflater = exports.BzipInflater = function(opts) {
  if (opts === undefined) opts = {};
  this.z = new gzbz2.Bunzip();
  _Inflater.call(this, opts);
};
util.inherits(BzipInflater, _Inflater);
