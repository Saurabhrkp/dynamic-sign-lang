import React from "react";

const Contents = ({ items, deleteItem, letter, index }) => {
  return (
    <div className="m-8 grid-container">
      {items.map((src, i) => {
        let filename = `${letter}_${i + parseInt(index)}`;
        return (
          <div key={filename} className="flex-col space-y-2 flex-container">
            <img src={src} className="rounded-md shadow-lg" />
            <div className="flex-container">
              <button className="btn btn-red" onClick={() => deleteItem(src)}>
                Delete
              </button>
              <a href={src} download={filename}>
                <button className="btn btn-green">Download</button>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Contents;
