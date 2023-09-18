import React, { FC, useCallback, useEffect, useRef } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { useImages } from "../hooks/useImages";

type CloppedImage = {
  image: HTMLImageElement;
  loaded: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const Sky: FC = () => {
  const { windowSize } = useWindowSize();
  const { images } = useImages();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animationFrameIdRef = useRef<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const selectImage = useCallback((): CloppedImage => {
    const index = Math.floor(Math.random() * images.length);
    const { image } = images[index];
    const loaded = image.complete;

    const width = Math.floor(Math.random() * 250);
    const height = Math.floor(Math.random() * 250);
    const x = Math.floor(Math.random() * (image.width - width));
    const y = Math.floor(Math.random() * (image.height - height));

    return { image, loaded, x, y, width, height };
  }, [images]);

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    const img = selectImage();

    if (!ctx || !img.loaded || img.width === 0 || img.height === 0) {
      render();
      return;
    }

    ctx.globalAlpha =
      Math.random() * 10 > 2
        ? Math.random() * 0.45 + 0.05
        : Math.random() * 0.85 + 0.05;

    ctx.drawImage(
      img.image,
      img.x,
      img.y,
      img.width,
      img.height,
      Math.random() * windowSize.width - 100,
      Math.random() * windowSize.height - 100,
      img.width,
      img.height
    );

    animationFrameIdRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    render();

    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
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
