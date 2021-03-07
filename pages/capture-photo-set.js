import React from "react";
import Webcam from "react-webcam";
import JSZip from "jszip";
import Contents from "../components/Contents";
import Meta from "../components/Meta";

import { options } from "../constants";

const CapturePhotoSet = () => {
  const webcamRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [letter, setLetter] = React.useState("A");
  const [captureSet, setCaptureSet] = React.useState(10);
  const [index, setIndex] = React.useState(0);
  const [photos, setPhotos] = React.useState([]);
  // Default size 640 x 480
  const videoConstraints = {
    width: 512,
    height: 384,
    mirrored: true,
  };

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

  const deletePhoto = React.useCallback(
    (photoSrc) => {
      setPhotos((prevState) => {
        return prevState.filter((photo) => photo !== photoSrc);
      });
    },
    [photos]
  );

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
      <Meta title={"Capture Photo for dataset"} />
      <Webcam
        width={512}
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="w-auto h-auto my-4 rounded-md shadow-lg lg:h-1/4"
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
      <div className="flex-col flex-container">
        {capturing ? (
          <>
            <button className="w-16 h-16 rounded-full btn btn-red animate-pulse" />
            <h1 className="text-xl font-semibold text-center text-red-500">
              Capturing Set
            </h1>
          </>
        ) : (
          <>
            <button
              className="w-16 h-16 rounded-full btn btn-blue"
              onClick={startCapturingSet}
            />
            <h1 className="text-xl font-semibold text-center text-blue-500">
              Start Capture
            </h1>
          </>
        )}
      </div>
      <div className="flex-row flex-container">
        <h2 className="p-4 text-lg font-semibold text-center md:text-3xl">
          Captured photos:
        </h2>
        {!photos.length ? (
          <h3 className="p-4 text-lg font-semibold text-center md:text-2xl">
            Start capturing to get dataset
          </h3>
        ) : (
          <div className="text-center">
            <button className="px-5 py-2 btn btn-green" onClick={saveAllPhotos}>
              Save All
            </button>
          </div>
        )}
      </div>
      <Contents
        items={photos}
        deleteItem={deletePhoto}
        letter={letter}
        index={index}
      />
    </>
  );
};

export default CapturePhotoSet;
