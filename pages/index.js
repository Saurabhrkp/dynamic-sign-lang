import React from "react";
import Webcam from "react-webcam";
import Head from "next/head";
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

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    setTimeout(handleStopCaptureClick, 5000);
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(async () => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleSaveVideo = React.useCallback(() => {
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

  const deleteVideo = (videoURL) => {
    setVideos((prevState) => {
      return prevState.filter((v) => v !== videoURL);
    });
  };

  const startRecordingSet = React.useCallback(() => {
    let set = 1;
    handleStartCaptureClick();
    const interval = setInterval(() => {
      if (set < captureSet) {
        handleStartCaptureClick();
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
            <label className="text-xl">
              Record for:
              <select
                className="border-4 border-blue-500 border-opacity-50 rounded-md m-2 py-1 shadow-lg focus:outline-none focus:ring-indigo-500 focus:border-blue-600 "
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
            <label className="text-xl">
              Starting index:
              <input
                className="border-4 border-blue-500 border-opacity-50 rounded-md m-2 py-1 shadow-lg w-20 focus:outline-none focus:ring-indigo-500 focus:border-blue-600"
                type="number"
                min="0"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                placeholder="0"
              />
            </label>
            <label className="text-xl">
              Capture Set of:
              <input
                className="border-4 border-blue-500 border-opacity-50 rounded-md m-2 py-1 shadow-lg w-20 focus:outline-none focus:ring-indigo-500 focus:border-blue-600"
                type="number"
                min="4"
                value={captureSet}
                onChange={(e) => setCaptureSet(e.target.value)}
              />
            </label>
            {capturing ? (
              <button
                type="button"
                className="bg-red-500 text-white px-3 py-2 rounded-md m-2 shadow-lg hover:bg-red-600 animate-pulse"
              >
                Recording Set
              </button>
            ) : (
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-2 rounded-md m-2 shadow-lg hover:bg-blue-600"
                onClick={startRecordingSet}
              >
                Start Capture
              </button>
            )}
            {recordedChunks.length > 0 && handleSaveVideo()}
          </div>
          <h2 className="font-bold text-3xl text-center p-4">
            Recorded videos:
          </h2>
          {!videos.length && (
            <h3 className="font-bold text-2xl text-center p-4">
              Start recording to get dataset
            </h3>
          )}
          <div className="grid grid-flow-row grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {videos.map((videoURL, i) => (
              <div
                key={`${letter}_${i + parseInt(index)}`}
                className="flex-col mx-auto justify-center my-2"
              >
                <h4 className="font-bold text-lg text-center p-2">
                  {`${letter}_${i + parseInt(index)}`}
                </h4>
                <video
                  src={videoURL}
                  autoPlay
                  loop
                  className="rounded-md mx-auto my-2"
                />
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="bg-red-400 text-white px-3 py-2 rounded-md m-2 shadow-lg hover:bg-red-500"
                    onClick={() => deleteVideo(videoURL)}
                  >
                    Delete
                  </button>
                  <a
                    href={videoURL}
                    download={`${letter}_${i + parseInt(index)}`}
                  >
                    <button
                      type="button"
                      className="bg-green-500 text-white px-3 py-2 rounded-md m-2 shadow-lg hover:bg-green-600"
                    >
                      Download
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WebcamStreamCapture;
