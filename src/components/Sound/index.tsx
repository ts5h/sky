import React, { FC, useCallback, useMemo } from "react";

export const Sound: FC = () => {
  const markovChainFreq = useMemo(
    () => [
      [0.7, 0.2, 0.1],
      [0.1, 0.6, 0.2],
      [0.1, 0.1, 0.8],
    ],
    []
  );

  const markovChainDur = useMemo(
    () => [
      [0.5, 0.3, 0.2],
      [0.3, 0.4, 0.3],
      [0.2, 0.3, 0.5],
    ],
    []
  );

  const markovChainRest = useMemo(
    () => [
      [0.9, 0.1], // 10% chance of a rest
      [0.85, 0.15], // 15% chance of a rest
      [0.8, 0.2], // 20% chance of a rest
    ],
    []
  );

  const choose = useCallback((arr: number[]): number => {
    const randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
  }, []);

  const getNextIndex = useCallback(
    (currentIndex: number, chain: number[][]): number => {
      const probs = chain[currentIndex];
      const rand = choose(probs);
      return probs.indexOf(rand);
    },
    []
  );

  const getNextNoteIndex = useCallback((currentIndex: number): number => {
    return getNextIndex(currentIndex, markovChainFreq);
  }, []);

  const getNextDurIndex = useCallback((currentIndex: number): number => {
    return getNextIndex(currentIndex, markovChainDur);
  }, []);

  const getNextRestIndex = useCallback((currentIndex: number): number => {
    return getNextIndex(currentIndex, markovChainRest);
  }, []);

  return <>Sound</>;
};
