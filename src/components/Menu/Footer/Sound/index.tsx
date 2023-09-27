import React, { FC, useState } from "react";
import { isIOS, isMobile } from "react-device-detect";
import { useAtom } from "jotai";
import { audioContextAtom, soundFlagAtom } from "../../../../store/Atoms";
import { SoundOff, SoundOn } from "../../../../icons";
import Styles from "../../../../scss/Footer.module.scss";

export const MenuSound: FC = () => {
  const [audioContext, setAudioContext] =
    useAtom<AudioContext>(audioContextAtom);
  const [isPlaying, setIsPlaying] = useAtom(soundFlagAtom);

  const [isHover, setIsHover] = useState(false);
  const [isFirstTouch, setIsFirstTouch] = useState(true);

  const handleHover = (state: boolean) => {
    if (isMobile) return;
    setIsHover(state);
  };

  const handleTouch = (state: boolean) => {
    if (!isMobile) return;
    setIsHover(state);

    if (isIOS && isFirstTouch) {
      const source = audioContext.createBufferSource();
      source.buffer = audioContext.createBuffer(1, 1, 22500);
      source.onended = () => source.disconnect();

      source.connect(audioContext.destination);
      source.start(0);
      source.stop(0.001);
    }

    setIsFirstTouch(false);
  };

  const handleClick = () => {
    setIsPlaying((prev) => !prev);
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
      title="Sound"
    >
      <span className={Styles.icon}>
        {isPlaying ? <SoundOn /> : <SoundOff />}
      </span>
    </button>
  );
};
