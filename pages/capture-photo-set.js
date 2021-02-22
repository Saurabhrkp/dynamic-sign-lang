import React from "react";
import Webcam from "react-webcam";
import Head from "next/head";
import JSZip from "jszip";

import { options } from "../constants";

const videoConstraints = {
  width: 280,
  height: 280,
  mirrored: true,
};

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
    }, 300);
  }, [captureSet, setCapturing]);

  return (
    <>
      <Head>
        <title>Capture Photo for dataset</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen min-w-min flex-container flex-col bg-gray-100 p-10">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="my-4 w-auto h-auto lg:h-1/4 rounded-md shadow-lg"
        />
        <div className="flex-container">
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
        </div>
        <div className="flex-container flex-col">
          {capturing ? (
            <>
              <button className="rounded-full h-16 w-16 btn btn-red animate-pulse" />
              <h1 className="font-semibold font-mono text-xl text-center text-red-500">
                Capturing Set
              </h1>
            </>
          ) : (
            <>
              <button
                className="rounded-full h-16 w-16 btn btn-blue"
                onClick={startCapturingSet}
              />
              <h1 className="font-semibold font-mono text-xl text-center text-blue-500">
                Start Capture
              </h1>
            </>
          )}
        </div>
        <div className="flex-container flex-row">
          <h2 className="font-semibold text-lg md:text-3xl text-center p-4">
            Captured photos:
          </h2>
          {!photos.length ? (
            <h3 className="font-semibold text-lg md:text-2xl text-center p-4">
              Start capturing to get dataset
            </h3>
          ) : (
            <div className="text-center">
              <button
                className="btn btn-green px-5 py-2"
                onClick={saveAllPhotos}
              >
                Save All
              </button>
            </div>
          )}
        </div>
        <div className="grid-container m-8">
          {photos.map((photoSrc, i) => {
            let filename = `${letter}_${i + parseInt(index)}`;
            return (
              <div key={filename} className="flex-container flex-col space-y-2">
                <img src={photoSrc} className="rounded-md shadow-lg" />
                <div className="flex-container">
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
    </>
  );
};

export default WebcamStreamCapture;
