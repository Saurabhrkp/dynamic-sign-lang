import React from "react";
import Webcam from "react-webcam";
import Head from "next/head";
import { options } from "../constants";
import JSZip from "jszip";

const WebcamStreamCapture = () => {
  const webcamRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [letter, setLetter] = React.useState("A");
  const [captureSet, setCaptureSet] = React.useState(10);
  const [index, setIndex] = React.useState(0);
  const [photos, setPhotos] = React.useState([]);

  const capture = React.useCallback(() => {
    const photoSrc = webcamRef.current.getScreenshot();
    setPhotos((prevState) => {
      return [...prevState, photoSrc];
    });
  }, [webcamRef]);

  const saveAllPhotos = React.useCallback(async () => {
    let zip = new JSZip();
    photos.map((photoSrc, i) => {
      let filename = `${i + parseInt(index)}.jpeg`;
      let base64 = photoSrc.split(",")[1];
      zip.file(filename, base64, { base64: true });
    });
    let content = await zip.generateAsync({ type: "base64" });
    const a = document.createElement("a");
    a.href = "data:application/zip;base64," + content;
    a.download = letter + ".zip";
    a.click();
  }, [photos, letter, index]);

  const deletePhoto = (photoSrc) => {
    setPhotos((prevState) => {
      return prevState.filter((photo) => photo !== photoSrc);
    });
  };

  const startCapturingSet = React.useCallback(() => {
    let set = 1;
    setCapturing(true);
    capture();
    const interval = setInterval(() => {
      if (set < captureSet) {
        capture();
        set++;
      } else {
        setCapturing(false);
        return () => clearInterval(interval);
      }
    }, 3000);
  }, [captureSet, setCapturing]);

  return (
    <>
      <Head>
        <title>Capture Photo for dataset</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto p-0 md:p-6 lg:p-10">
        <div className="bg-gray-100 p-6 rounded-md shadow-lg">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="mx-auto my-8 w-auto h-auto lg:h-1/4 rounded-md"
          />
          <div className="flex justify-center">
            <label className="label">
              Record for:
              <select
                className="input"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
              >
                {options.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Starting index:
              <input
                className="input"
                type="number"
                min="0"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                placeholder="0"
              />
            </label>
            <label className="label">
              Capture Set of:
              <input
                className="input"
                type="number"
                min="4"
                value={captureSet}
                onChange={(e) => setCaptureSet(e.target.value)}
              />
            </label>
            {capturing ? (
              <button className="btn btn-red animate-pulse" disabled>
                Capturing Set
              </button>
            ) : (
              <button className="btn btn-blue" onClick={startCapturingSet}>
                Start Capture
              </button>
            )}
          </div>
          <h2 className="font-bold text-3xl text-center p-4">
            Captured photos:
          </h2>
          {!photos.length && (
            <h3 className="font-bold text-2xl text-center p-4">
              Start capturing to get dataset
            </h3>
          )}
          {photos.length > 2 && (
            <div className="text-center">
              <button
                className="btn btn-green px-7 py-3"
                onClick={saveAllPhotos}
              >
                Save All
              </button>
            </div>
          )}
          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {photos.map((photoSrc, i) => {
              let filename = `${letter}_${i + parseInt(index)}`;
              return (
                <div
                  key={filename}
                  className="flex-col mx-auto justify-center my-2"
                >
                  <h4 className="font-bold text-lg text-center p-2">
                    {filename}
                  </h4>
                  <img src={photoSrc} className="rounded-md mx-auto my-2" />
                  <div className="flex justify-center">
                    <button
                      className="btn btn-red"
                      onClick={() => deletePhoto(photoSrc)}
                    >
                      Delete
                    </button>
                    <a href={photoSrc} download={filename}>
                      <button className="btn btn-green">Download</button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WebcamStreamCapture;
