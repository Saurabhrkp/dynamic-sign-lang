import React from "react";
import Webcam from "react-webcam";
import Meta from "../components/Meta";

const StaticSign = () => {
  const webcamRef = React.useRef(null);
  const [status, setStatus] = React.useState(true);

  const detect = async () => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
    }
  };

  const stopDetection = React.useCallback(() => {
    setStatus(false);
  });

  const startDetection = React.useCallback(async () => {
    try {
      setStatus(false);
      // Load network
      // Loop and detect hands
      const interval = setInterval(async () => {
        if (status) {
        } else {
          return () => clearInterval(interval);
        }
      }, 100); // long interval for development
    } catch (error) {
      console.log(error);
    }
  }, [status]);

  return (
    <>
      <Meta title={"Static Sign Language Recognition"} />
      <Webcam
        audio={false}
        ref={webcamRef}
        className="w-auto h-auto mx-auto my-8 rounded-md lg:h-1/4"
      />
      <div className="flex-col flex-container">
        <button
          className="w-16 h-16 rounded-full btn btn-blue"
          onClick={status ? startDetection : stopDetection}
        />
        <h1 className="font-mono text-xl font-semibold text-center text-blue-500">
          {status ? "Start Detection" : "Stop Detection"}
        </h1>
      </div>
    </>
  );
};

export default StaticSign;
