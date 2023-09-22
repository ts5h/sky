import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import Tone from "tone";

Tone.Transport.bpm.value = 90;

const markovChainFreq = [
  ["C4", "D4", "E4"],
  ["F4", "G4", "A4"],
  ["B4", "C5", "D5"],
];

const markovChainDur = [
  ["8n", "4n", "2n"],
  ["16n", "8t", "4n"],
  ["1m", "2n", "4n"],
];

const markovChainRest = [
  0.9, // 10% chance of a rest
  0.85, // 15% chance of a rest
  0.8, // 20% chance of a rest
];

export const MarkovChainSound: FC = () => {
  const synth = useMemo(() => new Tone.Synth().toDestination(), []);

  const currentNoteIndex = useRef(0);
  const currentDurIndex = useRef(0);

  const choose = useCallback((arr: string[]): string => {
    const randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
  }, []);

  const getNextIndex = useCallback(
    (currentIndex: number, chain: string[][]): number => {
      const probs = chain[currentIndex];
      const rand = choose(probs);
      return probs.indexOf(rand);
    },
    [choose]
  );

  const playNote = useCallback(() => {
    const noteIndex = getNextIndex(currentNoteIndex.current, markovChainFreq);
    const nextNote = choose(markovChainFreq[noteIndex]);

    const durIndex = getNextIndex(currentDurIndex.current, markovChainDur);
    const nextDur = choose(markovChainDur[durIndex]);

    const restIndex = Math.floor(Math.random() * markovChainRest.length);
    const shouldRest = Math.random() > markovChainRest[restIndex];

    if (!shouldRest) {
      synth.triggerAttackRelease(nextNote, nextDur);
    }

    Tone.Transport.scheduleOnce(playNote, `+${Tone.Time(nextDur).toSeconds()}`);

    currentNoteIndex.current = noteIndex;
    currentDurIndex.current = durIndex;
  }, [synth, getNextIndex]);

  useEffect(() => {
    Tone.Transport.start();
    playNote();

    return () => {
      Tone.Transport.stop();
      synth.dispose();
    };
  }, [playNote, synth]);

  return null;
};
