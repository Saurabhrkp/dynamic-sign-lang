import React from "react";
import Meta from "./Meta";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Meta />
      <Navbar />
      <div className="flex-col min-h-screen p-6 pt-16 bg-gray-100 min-w-min flex-container">
        {children}
      </div>
    </>
  );
};

export default Layout;
