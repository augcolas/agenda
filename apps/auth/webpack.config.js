const nodeExternals = require('webpack-node-externals');

module.exports = {
  externals: [nodeExternals({ allowlist: [/^@agenda\//] })],
};
