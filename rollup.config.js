export default [
  {
    input: './server.js',
    output: {
      file: './dist/server.csj.js',
      format: 'cjs',
    },
    external: ['express', 'body-parser'],
  },
  {
    input: './client.js',
    output: {
      file: './dist/client.umd.js',
      name: 'squorum',
      format: 'umd',
    },
  },
];
