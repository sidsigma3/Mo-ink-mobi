// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prevent issues with Hermes + package exports
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
