import React, { Component } from "react";
import "./App.css";
// Importing the newly created functional component
import DicomHeader from "./components/DicomHeader";

class App extends Component {
  render() {
    //styling for the header
    const headerStyle = {
      background: "#7D7D7D",
      height: "100px",
      fontSize: "50px",
    };

    //styling for the main section of the application
    const backgroundStyle = {
      background: "#080808",
      height: "100vh",
      color: "#ffffff",
    };

    return (
      <div className="App">
        {/* // Adding a header noting the app is for parsing */}
        <header style={headerStyle}>Dicom Header - Parser</header>
        <div style={backgroundStyle}>
          {/* //DicomHeader component */}
          <DicomHeader />
        </div>
      </div>
    );
  }
}

// Export class component
export default App;
