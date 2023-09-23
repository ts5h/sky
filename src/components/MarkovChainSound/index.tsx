import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Tone from "tone";

Tone.Transport.bpm.value = 84;

// C# minor
const markovChainFreq = [
  ["C#3", "D#3", "E3"],
  ["F#3", "G#3", "A3"],
  ["B2", "C#3", "D#3"],
];

const markovChainDur = [
  ["8n", "4n", "2n"],
  ["16n", "8t", "4n"],
  ["1m", "2n", "4n"],
];

const transitionProbabilities = [
  [0.8, 0.2, 0.0],
  [0.1, 0.7, 0.2],
  [0.2, 0.3, 0.5],
];

export const MarkovChainSound: FC = () => {
  const [isStarted, setIsStarted] = useState(false);

  const synth = useMemo(
    () =>
      new Tone.PolySynth(Tone.FMSynth, {
        modulationIndex: 1.5,
        harmonicity: 1.95,
        envelope: {
          attack: 0.25 * Tone.Transport.bpm.value / 60,
          release: (2 * Tone.Transport.bpm.value) / 60,
        },
        volume: 0,
      }),
    []
  );

  const reverb = useMemo(() => new Tone.Reverb({
    decay: 2 * Tone.Transport.bpm.value / 60,
    wet: 0.9,
  }).toDestination(), []);
  synth.connect(reverb);

  const currentNoteIndex = useRef(0);
  const currentDurIndex = useRef(0);

  const choose = useCallback((arr: string[]): string => {
    const randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
  }, []);

  const getNextIndex = useCallback(
    (currentIndex: number): number => {
      const rand = Math.random();
      const cdf = transitionProbabilities[currentIndex].map((p, i, arr) =>
        arr.slice(0, i + 1).reduce((acc, val) => acc + val)
      );

      return cdf.findIndex(p => rand < p);
    },
    []
  );

  const playNote = useCallback(() => {
    if (synth.disposed) return;

    const noteIndex = getNextIndex(currentNoteIndex.current);
    const rootNote = choose(markovChainFreq[noteIndex]);

    const minorThird = Tone.Frequency(rootNote).transpose(3).toNote();
    const perfectFifth = Tone.Frequency(rootNote).transpose(7).toNote();
    const minorSeventh = Tone.Frequency(rootNote).transpose(10).toNote();
    const minorNinth = Tone.Frequency(rootNote).transpose(14).toNote();
    const chord = [rootNote, minorThird, minorSeventh, perfectFifth, minorNinth];

    const durIndex = getNextIndex(currentDurIndex.current);
    const nextDur = choose(markovChainDur[durIndex]);

    const shouldRest = Math.random() > 0.9;

    if (!shouldRest) {
      synth.triggerAttackRelease(chord, nextDur);
    }

    if (Tone.Transport.state === "started") {
      Tone.Transport.scheduleOnce(
        playNote,
        `+${Tone.Time(nextDur).toSeconds()}`
      );
    }

    currentNoteIndex.current = noteIndex;
    currentDurIndex.current = durIndex;
  }, [getNextIndex]);

  const handleClick = () => {
    if (!isStarted) {
      Tone.start()
        .then(() => {
          Tone.Transport.start();
          setIsStarted(true);
          playNote();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    return () => {
      Tone.Transport.stop();
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: "0",
        top: "100px",
        zIndex: 2,
      }}
    >
      <button type="button" onClick={handleClick}>
        Start
      </button>
    </div>
  );
};
