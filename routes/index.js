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
  var areaInput = request.params.area;
  var yelpObj = { term: "bar", location: areaInput };

  db.returnReservations().then(function(userData) {
    yelp.search(yelpObj).then(function(yelpData) {
      //parse location data into an object and then add user data
      var parsedData = yelpData.businesses.map(function(d) {
        var users = 0;

        if(userData) {
          for(var i = 0; i < userData.length; i++) {
            if(d.id === userData[i].name) {
              users = userData[i].users;
              break;
            }
          }
        }
        return {
          id: d.id,
          name: d.name,
          url: d.url,
          image: d.image_url,
          address: d.location.display_address,
          users: users
        };
      });
      response.setHeader("Content-Type", "application/json");
      response.json(parsedData);

    }).catch(function(error) {
      console.error("YELP SEARCH ERROR", error);
    });
  }, function(error) {
    console.error("MONGO USER FETCHING FAILED", error);
  });
});

//handle a new reservation
router.post("/api/save", function(request, response) {
  var data = request.body;
  db.saveReservation(data.location, function(result) {
    if(result !== "Saved") { console.error("ERROR SAVING RESERVATION", result); }
    response.end("Success");
  });
});

module.exports = router;
