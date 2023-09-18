import React, { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import Styles from "../../scss/ReturnToHome.module.scss";

export const ReturnToHome: FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`${Styles.return} ${isHovered ? Styles.on : ""} ${isMobile ? Styles.mobile : ""}`}>
      <a
        href="/"
        className={`${Styles.link} ${isMobile ? Styles.mobile : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        HOME
      </a>
    </div>
  );
};
