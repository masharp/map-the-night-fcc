/* TODO:
    Testing:
      - expect for asserts
      - Jasmine
    Isomporphic React:
      - React in node
      - Redux with React
      - Redux devTools
*/
/*jshint esnext: true */

(function() {
  "use strict";

  /* Module Dependencies */
  var express = require("express");
  var path = require("path");
  var favicon = require("serve-favicon");
  var logger = require("morgan");
  var bodyParser = require("body-parser");
  var compression = require("compression");

  /* Route Controllers */
  var index = require("./routes/index.js");

  /* Express Application */
  var app = express();

  /* View Engine setup */
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");

  app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(compression());

  /* HTTP page routing */
  app.use("/", index);

  /* Catch 404 error and forward to error handler */
  app.use(function(request, response, next) {
    let error = new Error("Not Found");
    error.status = 404;
    next(error);
  });

  /*
   * Error Handlers
   */
  /* Development error handler that prints a stack trace */
  if (app.get("env") === "development") {
    app.use(function(error, request, response, next) {
      response.status(error.status || 500);
      response.render("error", {
        message: error.message,
        error: error
      });
    });
  }

  /* Production error handler without stacktraces leaking to user */
  app.use(function(error, request, response, next) {
    response.status(error.status || 500);
    response.render("error", {
      message: error.message,
      error: {}
    });
  });

  //export app.environment helper function in order to disallow certain database actions
  exports.appEnvironment = function() {
    return app.get("env");
  };

  module.exports = app;
})();
