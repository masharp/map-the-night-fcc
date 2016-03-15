/* Jasmine Spec to test Database functinality */
  var dotenv = require("dotenv").config();
  var server = require("../../bin/www");
  var db = require("../../db");

  /*TEST MONGO GET / SAVE */
  describe("Save / Retrieve MongoDB", function() {

    describe("Save Reservation", function() {
      it("returns success", function(done) {

        db.saveReservation("test-bar", function(result) {
          expect(result).toBe("Saved");
          console.log("[DB - SAVE] PASS");
          done();
        });

      });
    });

    describe("Get Reservation", function() {
      it("returns proper objects", function(done) {

        db.returnReservations().then(function(response) {
          expect(response.length).toBeGreaterThan(0);
          console.log("[DB - RETURN] PASS");
          done();
        });
      });
    });
  });
