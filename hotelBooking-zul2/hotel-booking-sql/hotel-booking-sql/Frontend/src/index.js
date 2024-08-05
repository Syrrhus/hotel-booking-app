import '@babel/polyfill';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SearchProvider } from './context/SearchContext'; // Adjust path accordingly

ReactDOM.render(
  <SearchProvider>
    <App />
  </SearchProvider>,
  document.getElementById("root")
);
