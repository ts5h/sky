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

const boxMullerTransform = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const generateLogNormalRandom = (mean: number, std: number) => {
  const normalRandom = boxMullerTransform() * std + mean;
  return Math.exp(normalRandom);
};

export const Sky: FC = () => {
  const { windowSize } = useWindowSize();
  const { images } = useImages();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const selectImage = useCallback((): CloppedImage => {
    const index = Math.floor(Math.random() * images.length);
    const { image } = images[index];
    const loaded = image.complete;

    const width = Math.floor(Math.random() * 400) + 1;
    const height = Math.floor(Math.random() * 400) + 1;
    const x = Math.floor(Math.random() * (image.width - width));
    const y = Math.floor(Math.random() * (image.height - height));

    return { image, loaded, x, y, width, height };
  }, [images]);

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    const img = selectImage();

    if (!ctx || !img.loaded) {
      render();
      return;
    }

    const scale = generateLogNormalRandom(0.2, 0.55) * 0.1;

    ctx.globalAlpha =
      Math.random() * 10 > 1
        ? Math.random() * 0.45 + 0.05
        : Math.random() * 0.9 + 0.05;

    ctx.drawImage(
      img.image,
      img.x,
      img.y,
      img.width,
      img.height,
      Math.random() * windowSize.width - 50,
      Math.random() * windowSize.height - 50,
      img.width * scale,
      img.height * scale
    );

    ctx.globalAlpha = 1.0;

    // Add line noises
    if (Math.floor(Math.random() * 30) === 1) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
      ctx.fillRect(0, Math.random() * windowSize.height, windowSize.width, 1);
    }

    animationFrameIdRef.current = requestAnimationFrame(render);
  }, [windowSize, selectImage]);

  useEffect(() => {
    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [render]);

  return <canvas ref={canvasRef} width={4000} height={2500} />;
};
