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

      if(inputVal.length < 1) {
        errorElement.classList.remove("hidden");
        errorElement.value = "Please enter a location! (City, ST)";
      } else {
        //request("/api/reservations", area, );
      }
    },
    handleKeyDown: function handleKeyDown(e) {
      var errorElement = document.getElementById("error-label");
      if(!errorElement.classList.contains("hidden")) errorElement.classList.add("hidden");

      if(e.keyCode === 13) {
        this.submit();
      }
    },
    render: function render() {
      return(
        React.createElement("div", { id: "main" },
          React.createElement("h1", { id: "main-title" }, "Map the Night"),
          React.createElement("span", { id: "main-subtitle" }, "See nightlife activity in your area and RSVP early in the day!"),
          React.createElement("br", {}),
          React.createElement("label", { id: "error-label", className: "hidden" }),
          React.createElement("br", {}),
          React.createElement("input", { id: "area-input", type: "text", placeholder: "Your location...",
            onKeyDown: this.handleKeyDown }),
          React.createElement("input", { id: "area-btn", type:"button", onClick: this.submit, value: "Find" })
        )
      );
    }
  });

  ReactDOM.render(React.createElement(Controller, { yelpURL: yelpURL, appURL: appURL }), document.getElementById("loader"));
})();
