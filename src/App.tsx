import React from "react";
import { ReturnToHome } from "./components/ReturnToHome";
import { Sky } from "./components/Sky";
import "./scss/App.scss";

export const App = () => (
  <div className="App">
    <ReturnToHome />
    <Sky />
  </div>
);
