import React, { FC, useCallback, useEffect, useRef } from "react";
import { useImages } from "../../hooks/useImages";
import { useWindowSize } from "../../hooks/useWindowSize";

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

const canvasSize = {
  width: 4000,
  height: 2500,
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

    if (!ctx) {
      render();
      return;
    }

    const repeat = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < repeat; i++) {
      const img = selectImage();
      const scale = generateLogNormalRandom(0.1, 0.7) * 0.1;

      ctx.globalAlpha =
        Math.random() * 10 > 2
          ? Math.random() * 0.55 + 0.05
          : Math.random() * 0.9 + 0.05;

      ctx.drawImage(
        img.image,
        img.x,
        img.y,
        img.width,
        img.height,
        Math.random() * (windowSize.width + 50) - 25,
        Math.random() * (windowSize.height + 50) - 25,
        img.width * scale,
        img.height * scale,
      );
    }

    // Add line noises
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
    ctx.fillRect(0, Math.random() * canvasSize.height, canvasSize.width, 1);

    ctx.globalAlpha = 1.0;
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

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
    />
  );
};
