const path = require('path');

module.exports = {
    eslint: {
      // Allow builds to succeed even if there are ESLint errors
      ignoreDuringBuilds: true,
    },
    webpack: (config) => {
      config.resolve.alias['@'] = path.join(__dirname); // Adjust based on your folder structure
      return config;
    },
  };

