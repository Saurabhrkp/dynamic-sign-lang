import React from "react";
import Webcam from "react-webcam";
import Meta from "../components/Meta";
import * as tf from "@tensorflow/tfjs";

const StaticSign = () => {
  const webcamRef = React.useRef(null);
  const [status, setStatus] = React.useState(true);

  const detect = async (net) => {
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
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [null, 128, 128, 1]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.predict(expanded);
      console.log(obj);

      const boxes = await obj[1].array();
      const classes = await obj[2].array();
      const scores = await obj[4].array();

      console.log(boxes[0], classes[0], scores[0], 0.8);

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  const stopDetection = React.useCallback(() => {
    setStatus(false);
  });

  const startDetection = React.useCallback(async () => {
    try {
      setStatus(false);
      // Load network
      const net = await tf.loadLayersModel("/model/model.json");
      console.log({ net });
      // Loop and detect hands
      console.log({ status });
      const interval = setInterval(async () => {
        if (status) {
          await detect(net);
        } else {
          return () => clearInterval(interval);
        }
      }, 16000); // long interval for development
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

// Unhandled Runtime Error
// Error: Error when checking : expected conv2d_input to have shape [null,128,128,1] but got array with shape [1,640,480,3].
// Unhandled Runtime Error
// Error: Error in resizeBilinear: new shape must 2D, but got shape ,128,128,1.
