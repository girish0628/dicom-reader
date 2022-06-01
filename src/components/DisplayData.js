import React from "react";

const DisplayData = (props) => {
  // Styling to make the text white
  const textStyle = {
    color: "white",
  };

  // Displaying the DICOM attribute data
  return (
    <div style={textStyle}>
      <p>Parse Error: {props.image.parseError}</p>
      <p>SopInstanceUid: {props.image.SopInstanceUid}</p>
      <p>Patient ID: {props.image.patientId}</p>
      <p>Other Patient ID'S: {props.image.otherPatientIds}</p>
    </div>
  );
};

// Exporting the functional component
export default DisplayData;
