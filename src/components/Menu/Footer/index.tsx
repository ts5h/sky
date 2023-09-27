import React, { FC } from "react";
import { MenuSound } from "./Sound";
import { MenuReload } from "./Reload";
import { MenuGitHub } from "./GitHub";
import Styles from "../../../scss/Footer.module.scss";

export const Footer: FC = () => {
  return (
    <div className={Styles.wrapper}>
      <nav className={Styles.nav}>
        <MenuSound />
        <MenuReload />
        <MenuGitHub />
      </nav>
    </div>
  );
};
