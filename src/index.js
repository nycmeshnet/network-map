import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
if (process.env.NODE_ENV === "development") require("tachyons");

ReactDOM.render(<App />, document.getElementById("map-root"));
