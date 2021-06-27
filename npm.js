const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

if(!pkg.publishConfig) pkg.publishConfig = {};
pkg.publishConfig.registry = 'https://registry.npmjs.org';

// Update package.json with the udpated registry
fs.writeFileSync(
  path.join(__dirname, '../package.json'),
  JSON.stringify(pkg, null, 2),
);