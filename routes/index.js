/*jshint esnext: true */
"use strict";

/* HTTP Routing */
var express = require("express");
var router = express.Router();
var db = require("../db");
var dotenv = require("dotenv").config();
var app = require("../app");
var Yelp = require("yelp");

/* Setup Yelp Authentication */
var yelp = new Yelp({
  consumer_key: process.env.YELP_CONS_KEY,
  consumer_secret: process.env.YELP_CONS_SECRET,
  token: process.env.YELP_TOK,
  token_secret: process.env.YELP_TOK_SECRET,
});

router.get("/", function(request, response) {
  response.render("home", { title: "Map the Night | Social Nightlife Tracker" });
});

//return yelp API data plus current user information
router.get("/api/location/:area", function(request, response) {
  var yelpObj = { term: "bar", location: request.params.area };

  yelp.search(yelpObj).then(function(yelpData) {
    var parsedData = yelpData.businesses.map(function(d) {
      return {
        id: d.id,
        name: d.name,
        url: d.url,
        image: d.image_url,
        address: d.location.display_address
      };
    });

    /*
    db.returnReservations().then(function(r) {
      console.log(r);
    }); */

    response.setHeader("Content-Type", "application/json");
    response.json(parsedData);

  }).catch(function(error) {
    console.error("YELP SEARCH ERROR", error);
  });
});

//handle a new reservation
router.post("/api/save", function(request, response) {
  console.log(request.body);
  //console.log(db.saveReservation(area, location, user));
});

module.exports = router;
