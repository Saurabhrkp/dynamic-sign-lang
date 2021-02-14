import React from "react";
import Webcam from "react-webcam";
import Head from "next/head";

const WebcamStreamCapture = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [letter, setLetter] = React.useState([]);
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
        type: "video/webm",
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

  const Button = (props) => {
    return (
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md m-2 shadow-lg"
        type="button"
        onClick={props.handler}
      >
        {props.children}
      </button>
    );
  };

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
              <input
                className="border-4 border-blue-600 border-opacity-50 rounded-md m-1 py-1 shadow-lg"
                type="text"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
              />
            </label>
            {capturing ? (
              <Button handler={handleStopCaptureClick}>Stop Capture</Button>
            ) : (
              <Button handler={handleStartCaptureClick}>Start Capture</Button>
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
                key={`video_${i}`}
                className="flex-col mx-auto justify-center my-2"
              >
                <video
                  src={videoURL}
                  autoPlay
                  loop
                  className="rounded-md mx-auto"
                />
                <div>
                  <Button handler={() => deleteVideo(videoURL)}>Delete</Button>
                  <a href={videoURL} download={`${letter}_${i}`}>
                    <Button handler={() => {}}>Download</Button>
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
