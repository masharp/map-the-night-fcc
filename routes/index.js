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

//return yelp API data
router.get("/api/location/:area", function(request, response) {
    console.log(request.params.area);
});

//return reservation JSON
router.get("/api/reservations", function(request, response) {
  db.returnReservations().then(function(r) {
    console.log(r);
  });
});

//handle a new reservation
router.post("/api/save", function(request, response) {
  console.log(request.body);
  //console.log(db.saveReservation(area, location, user));
});

module.exports = router;
