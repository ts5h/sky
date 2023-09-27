import React, { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import { AiFillGithub } from "react-icons/ai";
import Styles from "../../../../scss/Footer.module.scss";

export const MenuGitHub: FC = () => {
  const [isHover, setIsHover] = useState(false);

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

  return (
    <button
      type="button"
      onMouseOver={() => handleHover(true)}
      onMouseOut={() => handleHover(false)}
      onFocus={() => handleHover(true)}
      onBlur={() => handleHover(false)}
      onTouchStart={() => handleTouch(true)}
      onTouchEnd={() => handleTouch(false)}
      onClick={handleClick}
      className={isHover ? Styles.on : ""}
      title="GitHub"
    >
      <AiFillGithub className={Styles.icon} />
    </button>
  );
};
