import React, { FC } from "react";
import { MenuGitHub } from "./GitHub";
import { MenuReload } from "./Reload";
import Styles from "../../../scss/Footer.module.scss";

export const Footer: FC = () => {
  return (
    <div className={Styles.wrapper}>
      <nav className={Styles.nav}>
        <MenuReload />
        <MenuGitHub />
      </nav>
    </div>
  );
};
