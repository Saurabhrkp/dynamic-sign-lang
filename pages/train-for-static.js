import React from "react";
import Meta from "../components/Meta";
import JSZip from "jszip";

const TrainForStaticModel = () => {
  const [zipFiles, setZipFiles] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (zipFiles.length <= 2) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [zipFiles]);

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

  const getTrainingData = React.useCallback(() => {
    zipFiles.forEach(async (zipFile, idx) => {
      let zip = new JSZip();
      let zipFolder = await zip.loadAsync(zipFile);
      const image = { label: zipFile.name.split(".")[0], data: [] };
      await zipFolder.forEach(async (_, file) => {
        let dataType = "data:image/jpeg;base64,";
        let base64Data = await file.async("base64");
        image.data.push(`${dataType + base64Data}`);
      });
      setFiles((prevState) => {
        return [...prevState, image];
      });
    });
  }, [zipFiles, files]);

  return (
    <>
      <Meta title={"Train Static Model for dataset"} />
      <div className="flex-container">
        <input type="file" accept=".zip" multiple onChange={onFileChange} />
        {zipFiles.length > 2 && (
          <button onClick={() => getTrainingData()}>Load</button>
        )}
      </div>
      {enabled ? (
        <button type="submit">Submit</button>
      ) : (
        <button disabled type="submit">
          Submit
        </button>
      )}
    </>
  );
};

export default TrainForStaticModel;
