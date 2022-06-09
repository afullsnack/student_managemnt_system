const withTM = require("next-transpile-modules")(["ui"]);
const path = require("path");
require("dotenv").config();

module.exports = withTM({
  reactStrictMode: true,
});
