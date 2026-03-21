import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css"; // Essential for Ant Design 5+
import "bootstrap/dist/css/bootstrap.min.css"; // Essential for your buttons/grid
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);