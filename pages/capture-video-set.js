import React from "react";
import Webcam from "react-webcam";
import Head from "next/head";
import JSZip from "jszip";

import { options } from "../constants";

const WebcamStreamCapture = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [letter, setLetter] = React.useState("A");
  const [captureSet, setCaptureSet] = React.useState(10);
  const [index, setIndex] = React.useState(0);
  const [videos, setVideos] = React.useState([]);

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
      <Head>
        <title>Capture Video for dataset</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto p-0 md:p-6 lg:p-10">
        <div className="bg-gray-100 p-6 rounded-md shadow-lg">
          <Webcam
            audio={false}
            ref={webcamRef}
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
              <button className="btn btn-red animate-pulse">
                Recording Set
              </button>
            ) : (
              <button className="btn btn-blue" onClick={startRecordingSet}>
                Start Capture
              </button>
            )}
            {recordedChunks.length > 0 && saveVideo()}
          </div>
          <h2 className="font-bold text-3xl text-center p-4">
            Recorded videos:
          </h2>
          {!videos.length && (
            <h3 className="font-bold text-2xl text-center p-4">
              Start recording to get dataset
            </h3>
          )}
          {videos.length > 2 && (
            <div className="text-center">
              <button
                className="btn btn-green px-7 py-3"
                onClick={saveAllRecordings}
              >
                Save All
              </button>
            </div>
          )}
          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {videos.map((videoURL, i) => {
              let filename = `${letter}_${i + parseInt(index)}`;
              return (
                <div
                  key={filename}
                  className="flex-col mx-auto justify-center my-2"
                >
                  <h4 className="font-bold text-lg text-center p-2">
                    {filename}
                  </h4>
                  <video
                    src={videoURL}
                    autoPlay
                    loop
                    className="rounded-md mx-auto my-2"
                  />
                  <div className="flex justify-center">
                    <button
                      className="btn btn-red"
                      onClick={() => deleteVideo(videoURL)}
                    >
                      Delete
                    </button>
                    <a href={videoURL} download={filename}>
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
