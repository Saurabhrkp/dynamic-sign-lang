import React from "react";
import Meta from "../components/Meta";
import JSZip from "jszip";
import Results from "../components/Results-Grid";

const TrainForStaticModel = () => {
  const [zipFiles, setZipFiles] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [enabled, setEnabled] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [model, setModel] = React.useState(null);
  let ml5;

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
            Load Training Data
          </button>
        )}
        {enabled && (
          <button
            className="btn btn-blue"
            type="submit"
            onClick={() => setShow(true)}
          >
            Show Training Data
          </button>
        )}
      </div>
      <div className="flex-container">
        {show &&
          files.map((images) => {
            return (
              <div key={`${images.label}`}>
                <h2 className="p-3 text-lg font-semibold text-center md:text-3xl">
                  {images.label} - {images.data.length}
                </h2>
                <Results items={[...images.data]} label={images.label} />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default TrainForStaticModel;
