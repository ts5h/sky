import React from "react";
import { ReturnToHome } from "./components/Menu/ReturnToHome";
import { Sky } from "./components/Sky";
import { MarkovChainSound } from "./components/MarkovChainSound";
import { Footer } from "./components/Menu/Footer";
import "./scss/App.scss";

export const App = () => (
  <div className="App">
    <ReturnToHome />
    <Sky />
    <MarkovChainSound />
    <Footer />
  </div>
);
