import React from "react";
import Webcam from "react-webcam";
import p5 from "p5";
import Meta from "../components/Meta";

const StaticSign = () => {
  const webcamRef = React.useRef(null);
  const P5Ref = React.useRef(null);
  const [status, setStatus] = React.useState(true);
  const [model, setModel] = React.useState(null);
  let ml5, P5, video, flippedVideo;

  const Sketch = (p5) => {
    p5.setup = () => {
      createCanvas(320, 260);
      // Create the video
      video = createCapture(VIDEO);
      video.size(320, 240);
      video.hide();

      flippedVideo = ml5.flipImage(video);
      // Start classifying
      classifyVideo();
    };

    p5.draw = () => {
      background(0);
      // Draw the video
      image(flippedVideo, 0, 0);

      // Draw the label
      fill(255);
      textSize(16);
      textAlign(CENTER);
      text(label, width / 2, height - 4);
    };
  };

  React.useEffect(() => {
    P5 = new p5(Sketch, P5Ref.current);
  }, []);

  React.useEffect(() => {
    const IMAGE_WIDTH = 512;
    const IMAGE_HEIGHT = 384;
    const IMAGE_CHANNELS = 4;
    const options = {
      task: "imageClassification",
      inputs: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
      outputs: ["label"],
    };
    ml5 = require("ml5");
    setModel(ml5.neuralNetwork(options));
  }, []);

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
