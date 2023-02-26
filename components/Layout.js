import Navbar from "./Navbar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
};

export default Layout;
