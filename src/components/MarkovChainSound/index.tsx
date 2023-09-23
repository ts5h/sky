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

const markovChainRest = [
  0.9, // 10% chance of a rest
  0.85, // 15% chance of a rest
  0.8, // 20% chance of a rest
];

export const MarkovChainSound: FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const synth = useMemo(
    () =>
      new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          release: (2 * Tone.Transport.bpm.value) / 60,
        },
        volume: -0.05,
      }),
    []
  );

  const reverb = useMemo(() => new Tone.Reverb({
    decay: 2 * Tone.Transport.bpm.value / 60,
    wet: 0.75,
  }).toDestination(), []);
  synth.connect(reverb);

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
    if (synth.disposed) return;

    const noteIndex = getNextIndex(currentNoteIndex.current, markovChainFreq);
    const rootNote = choose(markovChainFreq[noteIndex]);

    const minorThird = Tone.Frequency(rootNote).transpose(3).toNote();
    const perfectFifth = Tone.Frequency(rootNote).transpose(7).toNote();
    // const minorSeventh = Tone.Frequency(rootNote).transpose(10).toNote();
    const minorNinth = Tone.Frequency(rootNote).transpose(14).toNote();
    const chord = [rootNote, minorThird, perfectFifth, minorNinth];

    const durIndex = getNextIndex(currentDurIndex.current, markovChainDur);
    const nextDur = choose(markovChainDur[durIndex]);

    const restIndex = Math.floor(Math.random() * markovChainRest.length);
    const shouldRest = Math.random() > markovChainRest[restIndex];

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
        start
      </button>
    </div>
  );
};
