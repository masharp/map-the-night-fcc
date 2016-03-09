/*jshint esnext: true */
"use strict";

/* HTTP Routing */
var express = require("express");
var router = express.Router();
var db = require("../db");
var dotenv = require("dotenv").config();
var app = require("../app");

router.get("/", function(request, response) {
  response.render("home", { title: "Map the Night | Social Nightlife Tracker" });
});

module.exports = router;
