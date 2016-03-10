(function() {
  /* define browserify modules to pack */
  var ReactDOM = require("react-dom");
  var React = require("react");
  var Redux = require("redux");

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
    render: function render() {
      return(
        React.createElement("div", { id: "main" },
          React.createElement("h1", { id: "main-title" }, "Map the Night"),
          React.createElement("span", { id: "main-subtitle" }, "See nightlife activity in your area and RSVP early in the day!")
        )
      );
    }
  });

  ReactDOM.render(React.createElement(Controller, { yelpURL: yelpURL, appURL: appURL }), document.body);
})();
