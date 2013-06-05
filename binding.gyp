{
  'targets': [
    {
      'target_name': 'gzbz',
      'defines': ['WITH_GZIP', 'WITH_BZIP'],
      'include_dirs': ['/usr/include', '/usr/local/include'],
      'sources': [ 'compress.cc' ],
      'cflags': [
        '-D_FILE_OFFSET_BITS=64',
        '-D_LARGEFILE_SOURCE',
        '-Wall'
      ],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'conditions': [
        ['OS=="mac"', {
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
          }
        }]
      ],
    }
  ]
}
