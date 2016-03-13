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
          users: int
        }
      ]
    }
*/
exports.saveReservation = function saveReservation(location, callback) {
  MongoClient.connect(MONGO_URL, (error, db) => {
    if(error) callback(error);

    db.collection("reservations_by_area", (error, collection) => {
      if(error) callback(error);

      collection.findOne({ "name": location }, (error, item) => {
        if(error) callback(error);

        if(item === null) {
          collection.save({
              createdAt: new Date(),
              name: location,
              users: 1
          }, function(error) {
            if(error) callback(error);
          });
        } else {

          collection.update( { "name": location },
          {
            $inc: { "users": 1 }
          }, function(error) {
            if(error) callback(error);
          });
        }
        callback("Saved");
      });
    });
  });
};

/* returns an array that contains all of current reservations by location in that area group */
exports.returnReservations = function returnReservations() {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(MONGO_URL, (error, db) => {
      if(error) reject(error);

      db.collection("reservations_by_area", (error, collection) => {
        if(error) reject(error);

        collection.find().toArray((error, items) => {
          if(error) reject(error);
          db.close();
          resolve(items);
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
