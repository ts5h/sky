import React from "react";
import { ReturnToHome } from "./components/ReturnToHome";
import { Sky } from "./components/Sky";
import { MarkovChainSound } from "./components/MarkovChainSound";
import "./scss/App.scss";

export const App = () => (
  <div className="App">
    <ReturnToHome />
    <Sky />
    <MarkovChainSound />
  </div>
);
