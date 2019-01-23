const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  output: {
    filename: "jsdataform.min.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "var",
    library: "dataform"
  }
};
