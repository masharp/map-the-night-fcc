(function() {
  /* define browserify modules to pack */
  var ReactDOM = require("react-dom");
  var React = require("react");
  var Redux = require("redux");
  var Request = require("request");

  /* global script variables */
  var yelpURL = "";
  var appURL = "";

  var Controller = React.createClass({ displayName: "Controller",
    propTypes: {
      yelpURL: React.PropTypes.string.isRequired,
      appURL: React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      return { locationData: null, userData: null };
    },
    componentDidMount: function componentDidMount() {

    },
    submit: function submit() {
      var errorElement = document.getElementById("error-label");
      var inputElement = document.getElementById("area-input");
      var inputVal = inputElement.value;

      if(!inputVal) {
        errorElement.classList.remove("hidden");
        errorElement.innerHTML = "Please enter a location! (City, ST)";
      } else {
        var url = "http://localhost:3000/api/location/" + inputVal;

        Request(url, function(error, response) {
          if(error) console.error("ERROR RETRIEVING LOCATION DATA", error);

          //this.setState({ locationData: response });
        });
      }
    },
    handleKeyDown: function handleKeyDown(e) {
      var errorElement = document.getElementById("error-label");
      if(!errorElement.classList.contains("hidden")) errorElement.classList.add("hidden");

      if(e.keyCode === 13) {
        this.submit();
      }
    },
    reserve: function reserve(location) {

    },
    tweet: function tweet(location) {

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
          React.createElement(Locations, { data: {} /*this.state.locationData*/, reserve: this.reserve, tweet: this.tweet })
        )
      );
    }
  });

  var Locations = React.createClass({ displayName: "Locations",
    propTypes: {
      data: React.PropTypes.object.isRequired,
      reserve: React.PropTypes.func.isRequired,
      tweet: React.PropTypes.func.isRequired
    },
    render: function render() {
      return(
        React.createElement("div", { id: "locations" },
          React.createElement(Spot, { spotInfo: {} })
        )
      );
    }
  });

  var Spot = React.createClass({ displayName: "Spot",
    propTypes: {
      spotInfo: React.PropTypes.object.isRequired
    },
    render: function render() {
      return(
        React.createElement("div", { className: "spot" })
      );
    }
  });

  ReactDOM.render(React.createElement(Controller, { yelpURL: yelpURL, appURL: appURL }), document.getElementById("loader"));
})();
