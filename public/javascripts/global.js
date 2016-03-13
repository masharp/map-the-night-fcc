(function() {
  /* define browserify modules to pack */
  var ReactDOM = require("react-dom");
  var React = require("react");
  var Redux = require("redux");
  var Request = require("request");

  /* global script variables */
  var appURL = "http://localhost:3000/api/location/";

  /* Redux Reducer
  var appReducer = function(state, action) {
    if(state === undefined) state = {
      locationData: {}
    };

    switch(action.type) {
      case "NEW_LOCATION":
        state.locationData = action.locationData;
        return state;
      default:
        return state;
    }
    return state;
  };

  /* Redux Dispatchers
  var appDispatches = {
    newLocationData: function newLocationData(data) {
      appStore.dispatch({ type: "NEW_LOCATIOn", locationData: data });
    }
  };

  /* Redux Store
  var appStore = Redux.createStore(appReducer);
  */

  /* React Components */
  var Controller = React.createClass({ displayName: "Controller",
    propTypes: {
      url: React.PropTypes.string.isRequired
      //getState: React.PropTypes.func.isRequired,
      //dispatches: React.PropTypes.object.isRequired
    },
    getInitialState: function getInitialState() {
      return { locationData: [] };
    },
    componentDidMount: function componentDidMount() {
      /* var self = this;
      appStore.subscribe(function() {
        var newState = self.props.getState();
        self.setState(newState);
      }); */
    },
    submit: function submit() {
      var errorElement = document.getElementById("error-label");
      var inputElement = document.getElementById("area-input");
      var inputVal = inputElement.value;
      var self = this;

      if(!inputVal) {
        errorElement.classList.remove("hidden");
        errorElement.innerHTML = "Please enter a location! (City, ST)";
      } else {
        //var searchVal = this.parseInputVal(inputVal);
        //var localAPICall =  this.props.url + searchVal;

        Request(this.props.url + inputVal, function(error, localResponse) {
          if(error) console.error("ERROR RETRIEVING LOCATION DATA");

          self.setState({ locationData: JSON.parse(localResponse.body) });
        });
      }
    },
    parseInputVal: function parseInputVal(input) {
      var t = input.split(" ");
      if(t.length === 1) { return t[0]; }
      else {
        var temp = t[0];

        for(var i = 1; i < t.length; i++) {
          temp += "+" + t[i];
        }
        return temp;
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
      console.log("Reserve clicked" + location);
    },
    tweet: function tweet(location) {
      console.log("Tweet clicked" + location);
    },
    render: function render() {
      console.log(this.state.locationData);
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
          React.createElement(Locations, { locations: this.state.locationData, reserve: this.reserve, tweet: this.tweet })
        )
      );
    }
  });

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
          React.createElement("input", { className: "reserve-btn", type:"button", value: "Check In",
            onClick: this.props.reserve.bind(null, this.props.id) }),
          React.createElement("br", {}),
          React.createElement("input", { className: "tweet-btn", type:"button", value: "Tweet",
            onClick: this.props.tweet.bind(null, this.props.name) }),
          React.createElement("br", {}),
          React.createElement("label", {}, this.props.users + " Going Tonight")
        )
      );
    }
  });

  ReactDOM.render(React.createElement(Controller,
    { url: appURL } /* getState: appStore.getState, dispatches: appDispatches */),
    document.getElementById("loader"));
})();
