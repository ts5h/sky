import React, { FC } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

export const Sky: FC = () => {
  const { windowSize } = useWindowSize();

  return (
    <canvas id="sky" width={windowSize.width} height={windowSize.height} />
  );
};
