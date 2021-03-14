import React from "react";
import JSZip from "jszip";
import p5 from "p5";
import Meta from "../components/Meta";
import Results from "../components/Results-Grid";

const TrainForStaticModel = () => {
  const [zipFiles, setZipFiles] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [enabled, setEnabled] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [model, setModel] = React.useState(null);
  const IMAGE_WIDTH = 512;
  const IMAGE_HEIGHT = 384;
  const IMAGE_CHANNELS = 4;
  let ml5;

  React.useEffect(() => {
    const options = {
      task: "imageClassification",
      inputs: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    };
    ml5 = require("ml5");
    setModel(ml5.neuralNetwork(options));
  }, []);

  const onFileChange = React.useCallback(
    (event) => {
      event.preventDefault();
      if (event.target.files.length) {
        const Files = Array.from(event.target.files);
        Files.map((file) => {
          return setZipFiles((prevFiles) => {
            return [...prevFiles, file];
          });
        });
      }
    },
    [zipFiles]
  );
  const startTrainingModel = React.useCallback(() => {
    files.forEach((file) => {
      file.data.map((src) => {
        const img = new Image();
        img.src = src;
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        img.onload = function () {
          // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
          ctx.drawImage(img, 0, 0, 512, 384, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let inputImage = {
            image: [],
          };
          for (let i = 0; i < data.length; i += 4) {
            let r = data[i + 0] / 255;
            let g = data[i + 1] / 255;
            let b = data[i + 2] / 255;
            let a = data[i + 3] / 255;
            console.log(r, g, b, a);
            inputImage.image.push(r, g, b, a);
          }
          let target = { label: file.label };

          model.addData(inputImage, target);
        };
      });
    });
  }, [files]);

  const loadTrainingData = React.useCallback(() => {
    zipFiles.forEach(async (zipFile) => {
      let zip = new JSZip();
      let zipFolder = await zip.loadAsync(zipFile);
      const image = { label: zipFile.name.split(".")[0], data: [] };
      zipFolder.forEach(async (_, file) => {
        let dataType = "data:image/jpeg;base64,";
        let base64Data = await file.async("base64");
        image.data.push(`${dataType + base64Data}`);
      });
      setFiles((prevState) => {
        return [...prevState, image];
      });
    });
    setEnabled(true);
  }, [zipFiles, files]);

  return (
    <>
      <Meta title={"Train Static Model for dataset"} />
      <div className="flex-container">
        <label className="label">
          Upload Zip Files with Label:
          <input
            className="w-auto input"
            type="file"
            accept=".zip"
            multiple
            onChange={onFileChange}
          />
        </label>
      </div>
      <div className="flex-container">
        {zipFiles.length > 2 && (
          <button className="btn btn-green" onClick={() => loadTrainingData()}>
            {!enabled ? "Load Training Data" : "Training Data Loaded"}
          </button>
        )}
        {enabled && (
          <button
            className="btn btn-blue"
            type="submit"
            onClick={() => setShow(!show)}
          >
            {!show ? "Show Training Data" : "Hide Training Data"}
          </button>
        )}
      </div>
      <div className="flex-container">
        {enabled && (
          <button
            className="btn btn-red"
            type="submit"
            onClick={startTrainingModel}
          >
            Start Training Model
          </button>
        )}
      </div>
      <canvas
        id="canvas"
        style={{ width: `${IMAGE_WIDTH}px`, height: `${IMAGE_HEIGHT}px` }}
      ></canvas>
      <div className="flex-container">
        {show &&
          files.map((images) => {
            return (
              <div key={`${images.label}`}>
                <h2 className="p-3 text-lg font-semibold text-center md:text-3xl">
                  {images.label} - {images.data.length}
                </h2>
                <Results items={images.data} label={images.label} />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default TrainForStaticModel;
