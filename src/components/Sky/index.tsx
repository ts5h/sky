import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { useImages } from "../hooks/useImages";

export const Sky: FC = () => {
  const { windowSize } = useWindowSize();
  const { images } = useImages();

  // Draw images to canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useMemo(() => canvasRef.current?.getContext("2d"), []);

  const timerIdRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const render = useCallback(() => {
    const nextTimeout = Math.random() * 490 + 10;
    timerIdRef.current = setTimeout(() => render(), nextTimeout);
  }, []);

  useEffect(() => {
    render();

    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height}
    />
  );
};
