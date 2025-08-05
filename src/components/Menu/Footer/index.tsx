import { FC } from "react";
import Styles from "../../../scss/Footer.module.scss";
import { MenuGitHub } from "./GitHub";
import { MenuReload } from "./Reload";
import { MenuSound } from "./Sound";

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
