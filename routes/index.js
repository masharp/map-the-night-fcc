/*jshint esnext: true */
"use strict";

/* HTTP Routing */
const express = require("express");
const router = express.Router();
const db = require("../db");
const dotenv = require("dotenv").config();
const app = require("../app");
const Yelp = require("yelp");

/* Setup Yelp Authentication */
var yelp = new Yelp({
  consumer_key: process.env.YELP_CONS_KEY,
  consumer_secret: process.env.YELP_CONS_SECRET,
  token: process.env.YELP_TOK,
  token_secret: process.env.YELP_TOK_SECRET,
});

/* Home Page */
router.get("/", function(request, response) {
  response.render("home", { title: "Map the Night | Social Nightlife Tracker" });
});

//return yelp API data plus current user information
router.get("/api/location/:area", function(request, response) {
  let areaInput = request.params.area;
  let yelpObj = { term: "bar", location: areaInput };

  db.returnReservations().then(function(userData) {
    yelp.search(yelpObj).then(function(yelpData) {
      
      //parse location data into an object and then add user data
      let parsedData = yelpData.businesses.map(function(d) {
        let users = 0;

        // adds the user information to the yelp data
        if(userData) {
          for(let i = 0; i < userData.length; i++) {
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
  let data = request.body;
  db.saveReservation(data.location, function(result) {
    if(result !== "Saved") { console.error("ERROR SAVING RESERVATION", result); }
    response.end("Success");
  });
});


module.exports = router;
