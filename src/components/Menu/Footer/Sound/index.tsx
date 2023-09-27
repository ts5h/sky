import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { AiFillGithub } from "react-icons/ai";
import Styles from "../../../../scss/Footer.module.scss";

export const MenuSound = () => {
  const [isHover, setIsHover] = useState(false);
  const [isFirstTouch, setIsFirstTouch] = useState(true);

  const handleHover = (state: boolean) => {
    if (isMobile) return;
    setIsHover(state);
  };

  const handleTouch = (state: boolean) => {
    if (!isMobile) return;
    setIsHover(state);
  };

  const handleClick = () => {
    window.open("https://github.com/ts5h/sky");
  };
};
