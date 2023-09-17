import React, { FC } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

export const Canvas: FC = () => {
  const { windowSize } = useWindowSize();

  return <canvas id="canvas" width={windowSize.width} height={windowSize.height} />;
};
