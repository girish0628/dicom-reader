// Import React package...in order to use JSX
import React, { useCallback, useState } from "react";
// Package that will be used to parse the DICOM images
import dicomParser from "dicom-parser";
// Package that will be used to support the document uplaod feature
import { useDropzone } from "react-dropzone";
import DisplayData from "./DisplayData";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
const DicomHeader = () => {
  // State varaibles that will be used to set and store the data
  // that we are parsing from the images
  const [parseError, setParseError] = useState("");
  const [sopInstanceUid, setSopInstanceUid] = useState("");
  const [patientId, setPatientId] = useState("");
  const [otherPatientIds, setOtherPatientIds] = useState("");
  const [folderNameList, setFolderNameList] = useState([]);
  const [dcomFileList, setDcomFileList] = useState({});

  //   const dcomFileList = {};
  // Styling to make the text white
  const textStyle = {
    color: "white",
  };

  // Called when an application is uploaded
  const onDrop = useCallback((acceptedFiles) => {
    const zip = new JSZip();
    let files = acceptedFiles;
    for (let file = 0; file < acceptedFiles.length; file++) {
      // Zip file with the file name.
      zip.file(files[file].name, files[file]);
    }
    zip.generateAsync({ type: "blob" }).then((content) => {
      // saveAs(content, "example.zip");
      var formData = new FormData();
      formData.append("imgCollection", content);
      axios
        .post("http://localhost:4000/api/upload-images", formData, {})
        .then((res) => {
          console.log(res.data);
        });
    });
    // Do something with the files
    clearPage();
    loadFile(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Clears the data in the variables used to store the image data
  const clearPage = () => {
    setParseError("");
    setSopInstanceUid("");
    setPatientId("");
    setOtherPatientIds("");
  };

  // Function used to parse the data
  const parseByteArray = (byteArray) => {
    // We need to setup a try/catch block because parseDicom will throw an exception
    // if you attempt to parse a non dicom part 10 file (or one that is corrupted)
    try {
      // parse byteArray into a DataSet object using the parseDicom library
      var dataSet = dicomParser.parseDicom(byteArray);

      var sopInstanceUid = dataSet.string("x0020000d");
      // Set data to state variable
      setSopInstanceUid(sopInstanceUid);

      var patientId = dataSet.string("x00100010");
      if (patientId !== undefined) {
        // Set data to state variable
        setPatientId(patientId);
        console.log(patientId);
      } else {
        alert("element has no data");
      }
      var otherPatientIds = dataSet.string("x0008103e");
      if (otherPatientIds !== undefined) {
        // Set data to state variable
        setOtherPatientIds(otherPatientIds);
        console.log(otherPatientIds);
      } else {
        // Set data to state variable
        setOtherPatientIds("element not present");
      }
    } catch (err) {
      // we catch the error and display it to the user
      // Set data to state variable
      setParseError(err);
    }
  };

  // load the file dropped on the element and then call parseByteArray with a
  // Uint8Array containing the files contents
  const loadFile = async (acceptedFiles) => {
    // console.log(acceptedFiles);
    const folderList = [];
    // var file = acceptedFiles[0];
    // var reader = new FileReader();
    // reader.onload = function (file) {
    //   var arrayBuffer = reader.result;
    //   // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
    //   // Uint8Array so we create that here
    //   var byteArray = new Uint8Array(arrayBuffer);
    //   parseByteArray(byteArray);
    // };

    // reader.readAsArrayBuffer(file);

    for (var i = 0, len = acceptedFiles.length; i < len; i++) {
      var file = acceptedFiles[i];
      var reader = new FileReader();

      reader.onload = (function (f) {
        return function (e) {
          // Here you can use `e.target.result` or `this.result`
          // and `f.name`.
          var arrayBuffer = e.target.result;
          var byteArray = new Uint8Array(arrayBuffer);
          var dataSet = dicomParser.parseDicom(byteArray);

          var folderName = dataSet.string("x0008103e");
          folderList.push(folderName);
          console.log(folderName);
          setFolderNameList([...new Set(folderList)]);
          //   dcomFileList[folderName] = [dcomFileList[folderName], file];
          if (!dcomFileList[folderName]) {
            dcomFileList[folderName] = [];
          }
          dcomFileList[folderName] = [...dcomFileList[folderName], file];
          setDcomFileList(dcomFileList);
        };
      })(file);

      reader.readAsArrayBuffer(file);
    }
  };
  const folderListDisplay = () => {
    console.log(folderNameList);
    console.log(dcomFileList);
  };
  // Displaying the drop upload feature and the DisplayData component. Passing the image data as a object.
  return (
    <div style={textStyle}>
      <div className="column">
        <div className="col-md-12">
          <div id="dropZone">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag and drop some files here, or click to select files</p>
              )}
            </div>
          </div>
          <DisplayData
            image={{ parseError, sopInstanceUid, patientId, otherPatientIds }}
          />
        </div>
        <button onClick={folderListDisplay}>Submit</button>
      </div>
    </div>
  );
};

// Export functional components
export default DicomHeader;
