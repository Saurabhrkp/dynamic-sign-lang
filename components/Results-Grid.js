import React from "react";

const Results = ({ items, label }) => {
  return (
    <div className="m-5 grid-container">
      {items.map((src, i) => {
        return (
          <div
            key={`${label + i}`}
            className="flex-col space-y-2 flex-container"
          >
            <img src={src} className="rounded-md shadow-lg" />
          </div>
        );
      })}
    </div>
  );
};

export default Results;
