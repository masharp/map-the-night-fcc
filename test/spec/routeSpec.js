/* Jasmine Spec tests for HTTP routing */

var request = require("request");
var server = require("../../bin/www");
var baseURL = "http://localhost:3000/";

/*TEST HTTP ROUTING */
describe("HTTP Route GET Testing", function() {
  //Home view
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(baseURL, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns proper view", function(done) {
      request.get(baseURL, function(error, response, body) {
        expect(body).toContain("<title>Map the Night | Social Nightlife Tracker</title>");
        done();
      });
    });
  });
});
