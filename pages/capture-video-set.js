import React from "react";
import Webcam from "react-webcam";
import JSZip from "jszip";
import Contents from "../components/Contents";
import Meta from "../components/Meta";

import { options } from "../constants";

const CaptureVideoStream = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [letter, setLetter] = React.useState("A");
  const [captureSet, setCaptureSet] = React.useState(10);
  const [index, setIndex] = React.useState(0);
  const [videos, setVideos] = React.useState([]);
  // Default size 640 x 480
  const videoConstraints = {
    width: 512,
    height: 384,
    mirrored: true,
  };

  const startCapture = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    setTimeout(stopCaptureClick, 5000);
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const stopCaptureClick = React.useCallback(async () => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const saveVideo = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);
      setVideos((prevState) => {
        return [...prevState, url];
      });
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const blobToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    await new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return reader.result.replace(/^data:.+;base64,/, "");
  };

  const saveAllRecordings = React.useCallback(async () => {
    let zip = new JSZip();
    await Promise.all(
      videos.map(async (url, i) => {
        let filename = `${i + parseInt(index)}.mp4`;
        let base64 = await blobToBase64(url);
        zip.file(filename, base64, { base64: true });
      })
    );
    let content = await zip.generateAsync({ type: "base64" });
    const a = document.createElement("a");
    a.href = "data:application/zip;base64," + content;
    a.download = letter + ".zip";
    a.click();
  }, [videos, letter, index]);

  const clearAllVideos = React.useCallback(() => {
    setVideos([]);
    setCapturing(false);
    setIndex(0);
  }, [videos, capturing, index]);

  const deleteVideo = (videoURL) => {
    setVideos((prevState) => {
      return prevState.filter((v) => v !== videoURL);
    });
  };

  const startRecordingSet = React.useCallback(() => {
    let set = 1;
    startCapture();
    const interval = setInterval(() => {
      if (set < captureSet) {
        startCapture();
        set++;
      } else {
        return () => clearInterval(interval);
      }
    }, 8000);
  }, [captureSet]);

  return (
    <>
      <Meta title={"Capture Video for dataset"} />
      <Webcam
        width={512}
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        className="w-auto h-auto my-4 rounded-md shadow-lg lg:h-1/4"
      />
      <div className="flex-container">
        <label className="label">
          Record for:
          <select
            className="w-20 input"
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
              Recording Set
            </h1>
          </>
        ) : (
          <>
            <button
              className="w-16 h-16 rounded-full btn btn-blue"
              onClick={startRecordingSet}
            />
            <h1 className="text-xl font-semibold text-center text-blue-500">
              Start Capture
            </h1>
          </>
        )}
        {recordedChunks.length > 0 && saveVideo()}
      </div>
      <div className="flex-row flex-container">
        <h2 className="p-4 text-lg font-semibold text-center md:text-3xl">
          Recorded videos:
        </h2>
        {!videos.length ? (
          <h3 className="p-4 text-lg font-semibold text-center md:text-2xl">
            Start recording to get dataset
          </h3>
        ) : (
          <div className="text-center">
            <button
              className="px-5 py-2 btn btn-green"
              onClick={saveAllRecordings}
            >
              Save All
            </button>
            <button className="px-5 py-2 btn btn-red" onClick={clearAllVideos}>
              Clear All
            </button>
          </div>
        )}
      </div>
      <Contents
        items={videos}
        deleteItem={deleteVideo}
        letter={letter}
        index={index}
      />
    </>
  );
};

export default CaptureVideoStream;
