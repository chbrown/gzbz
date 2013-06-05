# gzbz

Streaming `gzip` (zlib) and `bzip2` (bzlib).

    npm install gzbz

# Examples

* bzip.init
  * encoding (the output encoding, undefined/null means Buffers)
  * level [1-9], 1 fastest (least memory), 9 slowest (most memory), default = 1
  * workfactor [0-250], read libbz2 docs, default = 30
* bunzip.init
  * encoding (the output encoding, undefined/null means Buffers)
  * small (boolean[false]) deflate in slow but small memory mode, default = false

* inflate accepts a buffer or binary string[+encoding[default = 'binary']],
  output will be a buffer or a string encoded according to init options
* deflate accepts a buffer or string[+encoding[default = 'utf8']],
  output will be a buffer or a string encoded according to init options

## Gzip example

    var gzbz = require("gzbz");

    var gzip = new gzbz.Gzip();
    gzip.init({encoding: 'binary', level: 5}); // 0 < level < 9

    // Pump data to be compressed
    var gzdata1 = gzip.deflate("My data that needs ", "ascii");
    sys.puts("Compressed size : "+gzdata1.length);

    // treat string as binary encoded
    var gzdata2 = gzip.deflate("to be compressed. 01234567890.");
    sys.puts("Compressed size : "+gzdata2.length);

    var gzdata3 = gzip.end(); // important to capture end data
    sys.puts("Last bit : "+gzdata3.length);

    // Normally stream this out as its generated, but just print here
    var gzdata = gzdata1+gzdata2+gzdata3;
    sys.puts("Total compressed size : "+gzdata.length);

# Gunzip example

    var gzbz = require("gzbz");
    var sys = require("sys");
    var fs = require("fs");

    var gunzip = new gzbz.Gunzip;
    gunzip.init({encoding: "utf8"});

    var gzdata = fs.readFileSync("somefile.gz", "binary");
    var inflated = gunzip.inflate(testdata, "binary");
    gunzip.end(); // returns nothing

## Prerequisites:

The `zlib` and `bzlib` libraries must be installed normally, i.e., `/usr/lib` or `/usr/local/lib`.
If the build process fails, you'll most likely need to change the `include_dirs` setting in [`binding.gyp`](binding.gyp).

# Credits:

* [node-gzbz2](https://github.com/Woodya/node-gzbz2), a.k.a., woody.anderson@gmail.com.
  - Big thanks for the `compress.cc` code!
* [wave.to/node-compress](https://github.com/waveto/node-compress).
  - Credited by node-gzbz2.

## License

Copyright © 2013 Christopher Brown. [MIT Licensed](LICENSE).
