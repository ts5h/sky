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

type Images = {
  imageUrl: string;
  loaded: boolean;
};

export const Sky: FC = () => {
  const { windowSize } = useWindowSize();

  // Load images
  const [images, setImages] = useState<Images[]>([
    { imageUrl: "https://i.imgur.com/9QVXK0F.png", loaded: false },
    { imageUrl: "https://i.imgur.com/9QVXK0F.png", loaded: false },
    { imageUrl: "https://i.imgur.com/9QVXK0F.png", loaded: false },
    { imageUrl: "https://i.imgur.com/9QVXK0F.png", loaded: false },
  ]);

  useEffect(() => {
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.imageUrl;
      img.onload = () => {
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index].loaded = true;
          return updatedImages;
        });
      };
      img.onerror = (e) => {
        console.error(e);
      };
    });
  }, []);

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
