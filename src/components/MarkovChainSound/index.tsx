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
const coefficient = 60 / Tone.Transport.bpm.value;

// C# minor
const markovChainFreq = [
  ["C#3", "D#3", "E3"],
  ["F#3", "G#3", "A3"],
  ["B2", "C#3", "D#3"],
];

// 6add9
const chords = [
  ["B2", "D#3", "F#3", "G#3", "C#4"],
  ["C#3", "F#3", "G#3", "A#3", "D#4"],
  ["D#3", "F#3", "A#3", "C#4", "F#4"],
  ["E3", "G#3", "B3", "C#4", "F#4"],
  ["F#3", "A#3", "C#4", "D#4", "G#4"],
  ["G#3", "C#4", "D#4", "F#4", "A#4"],
  ["A3", "C#4", "E4", "F#4", "B4"],
];

const markovChainDuration = [
  ["8n", "4n", "2n"],
  ["16n", "8t", "4n"],
  ["1m", "2n", "4n"],
];

const transitionProbabilities = [
  [0.7, 0.2, 0.1],
  [0.1, 0.7, 0.2],
  [0.2, 0.3, 0.5],
];

export const MarkovChainSound: FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const synth = useMemo(
    () =>
      new Tone.PolySynth(Tone.FMSynth, {
        envelope: {
          attack: 0.125 * coefficient,
          release: 2 * coefficient,
        },
        detune: 0,
        modulationIndex: 0.15,
        harmonicity: 2,
        portamento: 0.125 * coefficient,
        volume: -8,
      }),
    []
  );

  const delay = useMemo(
    () =>
      new Tone.PingPongDelay({
        delayTime: 0.5 * coefficient,
        feedback: 0.25,
        wet: 0.25,
      }).toDestination(),
    []
  );

  const reverb = useMemo(
    () =>
      new Tone.Reverb({
        decay: 0.25 * coefficient,
        wet: 0.75,
      }).toDestination(),
    []
  );

  synth.connect(delay).connect(reverb);

  const currentNoteIndex = useRef(0);
  const currentDurIndex = useRef(0);

  const choose = useCallback((arr: string[]): string => {
    const randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
  }, []);

  const getNextIndex = useCallback((currentIndex: number): number => {
    const rand = Math.random();
    const cdf = transitionProbabilities[currentIndex].map((p, i, arr) =>
      arr.slice(0, i + 1).reduce((acc, val) => acc + val)
    );

    return cdf.findIndex((p) => rand < p);
  }, []);

  const playNote = useCallback(() => {
    const noteIndex = getNextIndex(currentNoteIndex.current);
    const rootNote = choose(markovChainFreq[noteIndex]);

    const durIndex = getNextIndex(currentDurIndex.current);
    const nextDur = choose(markovChainDuration[durIndex]);

    const selectedChord = chords.find((chord) => chord[0] === rootNote);
    const shouldRest = Math.random() > 0.9;

    if (selectedChord && !shouldRest) {
      synth.triggerAttackRelease(
        // 6add9
        [
          rootNote,
          selectedChord[1],
          selectedChord[2],
          selectedChord[3],
          selectedChord[4],
        ],
        nextDur
      );
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
    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      Tone.start()
        .then(() => {
          Tone.Transport.start();
          setIsPlaying(true);
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
        display: isPlaying ? "none" : "block",
        right: "0",
        bottom: "0",
        zIndex: 2,
      }}
    >
      <button type="button" onClick={handleClick}>
        {isPlaying ? "Stop" : "Start"}
      </button>
    </div>
  );
};
