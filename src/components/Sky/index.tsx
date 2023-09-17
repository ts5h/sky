import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useWindowSize } from "../hooks/useWindowSize";

export const Sky: FC = () => {
  const { windowSize } = useWindowSize();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = canvasRef.current?.getContext("2d");

  const requestRef: MutableRefObject<number | null> = useRef(null);

  const render = useCallback(() => {
    requestRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas ref={canvasRef} width={windowSize.width} height={windowSize.height} />
  );
};
