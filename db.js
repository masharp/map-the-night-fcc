/*jshint esnext: true */
"use strict";
const dotenv = require("dotenv").config();
const MONGO_URL = process.env.MONGOLAB_URI;

/* Configure MongoDB */
const MongoClient = require("mongodb").MongoClient;

/* creates a new collection by area, which includes an array of objects
    area: {
      name: "",
      reservations: [
        {
          location: ""
          users: []
        }
      ]
    }
*/
  exports.saveReservation = function saveReservation(area, location, user) {
    MongoClient.connect(MONGO_URL, (error, db) => {
      if(error) return(error);

      db.collection("reservations_by_area", (error, collection) => {
        if(error) return(error);

        collection.find({ area_name: area }, function(error, item) {
          if(error) return(error);

          if(item.area_name !== area) {
            collection.save({
              area_name: area,
              reservations: [
                {
                  "location": location,
                  "users": [user]
                }
              ]
            }, function(error) {
              if(error) return error;
              db.close();
              return "Success";
            });
          }
        });
      });
    });
};

/* returns an array that contains all of current reservations by location in that area group */
exports.returnReservations = function returnReservations(area) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(MONGO_URL, (error, db) => {
      if(error) reject(error);

      db.collection("reservations_by_area", (error, collection) => {
        if(error) reject(error);

        collection.findOne({ area_name: area }, (error, item) => {
          if(error) reject(error);

          db.close();
          resolve(item);
        });
      });
    });
  });
};

/* removes all tests created by Jasmine */
exports.cleanTests = function() {
  MongoClient.connect(MONGO_URL, (error, db) => {
    if(error) return error;

    db.collection("reservations_by_area", (error, collection) => {
      if(error) return error;

      db.close();
    });
  });
};
