import React from 'react';
import Webcam from 'react-webcam';
import Head from 'next/head';
import * as tf from '@tensorflow/tfjs';

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
    <div>
      <Head>
        <title>Static Sign Language Recognition</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto p-0 md:p-6 lg:p-10">
        <div className="bg-gray-100 p-6 rounded-md shadow-lg">
          <Webcam
            audio={false}
            ref={webcamRef}
            className="mx-auto my-8 w-auto h-auto lg:h-1/4 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default StaticSign;
