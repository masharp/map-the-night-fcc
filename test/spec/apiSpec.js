/* Jasmine Spec tests the api */

var request = require("request");
var baseURL = "http://localhost:3000/api";

/* TEST API */
describe("API Testing", function() {

  describe("New Reservation API", function() {
    it("Returns Success", function(done) {

      request.post(baseURL + "/save", { form: { location: "test-bar-0" }}, function(error, httpResponse, body) {
        expect(httpResponse.statusCode).toBe(200);
        expect(body).toEqual("Success");
        console.log("[API SAVE] PASS");
        done();
      });

    });
  });

  describe("Get Reservations API", function() {
    it("Returns Data", function(done) {

      request.get(baseURL + "/location/chicago", function(error, httpResponse, body) {
        expect(httpResponse.statusCode).toBe(200);
        expect(body.length).toBeGreaterThan(0);
        console.log("[API RETURN] PASS");
        done();
      });

    });
  });

});
