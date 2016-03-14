/* Many thanks to James Barnett for the loading animation code, referenced from:
    http://codepen.io/jamesbarnett/pen/DxLrw */

(function() {
  /* define browserify modules to pack */
  var ReactDOM = require("react-dom");
  var React = require("react");
  var Redux = require("redux");
  var Request = require("request");

  /* ------------------------ React Components -------------------------- */
  /* central controller for the app - contains main UI and user input elements */
  var Controller = React.createClass({ displayName: "Controller",
    getInitialState: function getInitialState() {
      return { locationData: [] };
    },
    /* submits query to the local api, which calls the yelp api based on search results */
    submit: function submit() {
      this.setLoader(); //display loader
      var errorElement = document.getElementById("error-label");
      var inputElement = document.getElementById("area-input");
      var inputVal = inputElement.value;
      var self = this;

      /* display an error text if nothing was entered */
      if(!inputVal) {
        errorElement.classList.remove("hidden");
        errorElement.innerHTML = "Please enter a location! (City, ST)";
      } else {
        var localAPICall = "https://map-the-night.herokuapp.com/api/location/" + inputVal;

        Request(localAPICall, function(error, httpResponse, body) {
          if(error) console.error("ERROR RETRIEVING LOCATION DATA", error);

          /* remove loader and display result */
          document.getElementById("locations").classList.remove("hidden");
          document.getElementById("loader-label").classList.add("hidden");

          self.setState({ locationData: JSON.parse(body) });
        });
      }
    },
    /* sets the loader by displaying it and then setting an interval for the animation */
    setLoader: function setLoader() {
      var loaderElement = document.getElementById("loader-label");
      loaderElement.classList.remove("hidden");
      document.getElementById("locations").classList.add("hidden");

      var i = 0;
      var loader = setInterval(function() {
        i = ++i % 4;
        loaderElement.innerHTML = "Loading" + Array(i + 1).join(".");
      }, 500);
    },
    /* allows the user to hit enter inside of the textbox */
    handleKeyDown: function handleKeyDown(e) {
      var errorElement = document.getElementById("error-label");
      if(!errorElement.classList.contains("hidden")) errorElement.classList.add("hidden");

      if(e.keyCode === 13) {
        this.submit();
      }
    },
    /* component function that allows the user to indicate they will be at a location
        that evening. passed to each "spot" element as a prop */
    reserve: function reserve(location, users) {
      var localAPIURL = "https://map-the-night.herokuapp.com/api/save";

      if(confirm("Are you sure you'll be stopping by?")) {
        Request.post(localAPIURL, {form: { location: location }}, function(error, httpResponse, body) {
          if(body === "Success") {
            users++;
            document.getElementById(location).innerHTML = users + " Going Tonight";
          }
        });
      }
    },
    /* allows the user to send a tweet to the Twitter URI that will then authenticate them
      and permit a tweet. Passed to all "spot" elements as a prop */
    tweet: function tweet(location, address) {
      address = address[1].split(",")[0];

      /* format and endcode tweet text via native encoding function */
      var tweetText = "I'll be at " + location + " in " + address + " tonight!" +
        " See you there?\nsent from http://www.map-the-night.herokuapp.com";
      var tweetLink = "http://twitter.com/home?status=" + encodeURIComponent(tweetText);

      window.open(tweetLink, "_blank");
    },
    render: function render() {
      return(
        React.createElement("div", { id: "main" },
          React.createElement("h1", { id: "main-title" }, "Map the Night"),
          React.createElement("span", { id: "main-subtitle" }, "See nightlife in your area and let your friends know where you'll be!"),
          React.createElement("br", {}),
          React.createElement("label", { id: "error-label", className: "hidden" }),
          React.createElement("br", {}),
          React.createElement("input", { id: "area-input", type: "text", placeholder: "Your location...",
            onKeyDown: this.handleKeyDown }),
          React.createElement("input", { id: "area-btn", type:"button", onClick: this.submit, value: "Find" }),
          React.createElement("br", {}),
          React.createElement("label", { id: "loader-label", className: "hidden" }),
          React.createElement(Locations, { locations: this.state.locationData, reserve: this.reserve, tweet: this.tweet })
        )
      );
    }
  });

  /* Loction Component that parses the yelp data and creates individual "spot" elements */
  var Locations = React.createClass({ displayName: "Locations",
    propTypes: {
      locations: React.PropTypes.array.isRequired,
      reserve: React.PropTypes.func.isRequired,
      tweet: React.PropTypes.func.isRequired
    },
    render: function render() {
      /* create a React node for each bar */
      var self = this;
      var spotNodes = this.props.locations.map(function mapData(spot, index) {
        //check if there is an image. if not - include a generic one from yelp
        spot.image = spot.image ? spot.image : "https://s3-media4.fl.yelpcdn.com/bphoto/J0fwr9-7M_JKlMpTuIoZYw/ms.jpg";
        return(
          React.createElement(Spot, { key: index, name: spot.name, url: spot.url, image: spot.image, address: spot.address,
            id: spot.id, users: spot.users, reserve: self.props.reserve, tweet: self.props.tweet })
        );
      });

      return(
        React.createElement("div", { id: "locations" }, spotNodes)
      );
    }
  });

  /* an individual nightlife location */
  var Spot = React.createClass({ displayName: "Spot",
    propTypes: {
      id: React.PropTypes.string,
      name: React.PropTypes.string,
      url: React.PropTypes.string,
      image: React.PropTypes.string,
      address: React.PropTypes.array,
      users: React.PropTypes.number,
      reserve: React.PropTypes.func.isRequired,
      tweet: React.PropTypes.func.isRequired
    },
    render: function render() {
      return(
        React.createElement("div", { className: "spot" },
          React.createElement("a", { href: this.props.url, target: "_blank" },
            React.createElement("img", { src: this.props.image }),
            React.createElement("h2", {}, this.props.name)
          ),
          React.createElement("span", {}, this.props.address[0]),
          React.createElement("br", {}),
          React.createElement("span", {}, this.props.address[this.props.address.length - 1]),
          React.createElement("br", {}),
          React.createElement("input", { className: "reserve-btn", type:"button", value: "Drop In",
            onClick: this.props.reserve.bind(null, this.props.id, this.props.users) }),
          React.createElement("br", {}),
          React.createElement("input", { className: "tweet-btn", type:"button", value: "Tweet",
            onClick: this.props.tweet.bind(null, this.props.name, this.props.address) }),
          React.createElement("br", {}),
          React.createElement("label", { id: this.props.id }, this.props.users + " Going Tonight")
        )
      );
    }
  });

  ReactDOM.render(React.createElement(Controller, { }), document.getElementById("loader"));
})();
