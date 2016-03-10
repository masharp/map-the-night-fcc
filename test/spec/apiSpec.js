/* Jasmine Spec tests the api */

var request = require("request");
var server = require("../../bin/www");
var baseURL = "http://localhost:3000/api";

/* TEST SHORESIDE APIS */
describe("API Testing", function() {

  //Timestamp API - tested with a unix timestamp
  describe("Timestamp API", function() {
    it("returns status code 200", function(done) {
      request.get(baseURL, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        expect(body).toBe();
        done();
      });
    });
  });
});
