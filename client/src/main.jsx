import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { store } from "./redux/store";
import AuthLoader from "./components/AuthLoader";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthLoader>
    <App />
    </AuthLoader>
  </Provider>
);