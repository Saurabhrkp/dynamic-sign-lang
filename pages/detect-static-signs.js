import React from "react";
import Webcam from "react-webcam";
import Meta from "../components/Meta";
import * as tf from "@tensorflow/tfjs";

const StaticSign = () => {
  const webcamRef = React.useRef(null);
  React.useEffect(async () => {
    try {
      const model = await tf.loadLayersModel(`/model/model.json`);
      console.log(model);
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <>
      <Meta title={"Static Sign Language Recognition"} />
      <div className="container p-0 mx-auto md:p-6 lg:p-10">
        <div className="p-6 bg-gray-100 rounded-md shadow-lg">
          <Webcam
            audio={false}
            ref={webcamRef}
            className="w-auto h-auto mx-auto my-8 rounded-md lg:h-1/4"
          />
        </div>
      </div>
    </>
  );
};

export default StaticSign;
