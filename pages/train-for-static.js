import React from "react";
import Meta from "../components/Meta";
import JSZip from "jszip";

const TrainForStaticModel = () => {
  const [zipFiles, setZipFiles] = React.useState([]);
  const [letter, setLetter] = React.useState(0);
  const [photos, setPhotos] = React.useState([]);

  const onFileChange = (event) => {
    setZipFiles((prevState) => {
      return [...prevState, event.target.files[0]];
    });
  };

  const getTrainingData = React.useCallback(
    async (letter) => {
      let zip = new JSZip();
      let zipFolder = await zip.loadAsync(zipFiles[letter]);
      zipFolder.forEach(async (_, letter) => {
        let dataType = "data:image/jpeg;base64,";
        let base64Data = await letter.async("base64");
        setPhotos((prevState) => {
          return [...prevState, `${dataType + base64Data}`];
        });
      });
      setLetter((prevState) => {
        return prevState + 1;
      });
    },
    [zipFiles, photos, letter]
  );

  return (
    <>
      <Meta title={"Train Static Model for dataset"} />
      <div className="flex-container">
        <input type="file" onChange={onFileChange} />
        <button onClick={() => getTrainingData(letter)}>Upload!</button>
      </div>
      <div className="flex-container">
        <input type="file" onChange={onFileChange} />
        <button onClick={() => getTrainingData(letter)}>Upload!</button>
      </div>
      <div className="m-8 grid-container">
        <div className="flex-col space-y-2 flex-container">
          <img src={photos[0]} className="rounded-md shadow-lg" />
        </div>
      </div>
    </>
  );
};

export default TrainForStaticModel;
