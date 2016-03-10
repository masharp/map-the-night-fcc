/* Jasmine Spec to test Database functinality */
  var request = require("request");
  var dotenv = require("dotenv").config();
  var server = require("../../bin/www");
  var db = require("../../db");

  /*TEST MONGO GET / SAVE */
  describe("Save / Retrieve MongoDB", function() {

    describe("Save Reservation", function() {
      it("returns success", function(done) {
        var area = "test";
        var location = "Test Bar";
        var user = "test_user";

        expect(db.saveReservation(area, location, user)).toBe("Success");
        done();
      });
    });

    describe("Get Reservation", function() {
      it("returns proper objects", function(done) {
        var obj = {
          area_name: "test",
          reservations: [{
            location: "Test Bar",
            users: ["test_user"]
          }]
        };
        var initiate = db.returnReservations("test");

        initiate.then(function(r) {
          expect(r).toBe(obj);
          done();
        });
      });
    });
  });
