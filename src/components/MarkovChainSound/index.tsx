import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Tone from "tone";

Tone.Transport.bpm.value = 82;
const coefficient = 60 / Tone.Transport.bpm.value;

// E melodic minor
const markovChainFreq = [
  ["E3", "F#3", "G3"],
  ["A3", "B3", "C#4"],
  ["D#4", "E4", "F#4"],
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

  // Synth
  const synth = useMemo(
    () =>
      new Tone.PolySynth(Tone.FMSynth, {
        envelope: {
          attack: 0.125 * coefficient,
          release: 2 * coefficient,
        },
        detune: -12,
        modulationIndex: 0.4,
        harmonicity: 2,
        portamento: 0.125 * coefficient,
        volume: -8,
      }),
    [],
  );

  const synthDelay = useMemo(
    () =>
      new Tone.PingPongDelay({
        delayTime: 0.5 * coefficient,
        feedback: 0.25,
        wet: 0.25,
      }).toDestination(),
    [],
  );

  const synthReverb = useMemo(
    () =>
      new Tone.Reverb({
        decay: 0.25 * coefficient,
        wet: 0.75,
      }).toDestination(),
    [],
  );

  synth.connect(synthDelay).connect(synthReverb);

  // HiHat
  const hihatOsc = useMemo(
    () =>
      new Tone.Oscillator({
        type: "square",
        frequency: 2850.0,
      }),
    [],
  );

  const hihatEnv = useMemo(
    () =>
      new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: 0.01,
        sustain: 0,
        release: 0.1,
      }),
    [],
  );

  const hihatPan = useMemo(
    () =>
      new Tone.PanVol({
        pan: 0,
        volume: -30,
      }).toDestination(),
    [],
  );

  hihatOsc.connect(hihatEnv).connect(hihatPan);

  const currentNoteIndex = useRef(0);
  const currentDurIndex = useRef(0);

  const choose = useCallback((arr: string[]): string => {
    const randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
  }, []);

  const getNextIndex = useCallback((currentIndex: number): number => {
    const rand = Math.random();
    const cdf = transitionProbabilities[currentIndex].map((p, i, arr) =>
      arr.slice(0, i + 1).reduce((acc, val) => acc + val),
    );

    return cdf.findIndex((p) => rand < p);
  }, []);

  const playNote = useCallback(() => {
    const noteIndex = getNextIndex(currentNoteIndex.current);
    const rootNote = choose(markovChainFreq[noteIndex]);

    const durIndex = getNextIndex(currentDurIndex.current);
    const nextDur = choose(markovChainDuration[durIndex]);

    const shouldRest = Math.random() > 0.9;

    if (!shouldRest) {
      synth.triggerAttackRelease(
        // 6sus4
        [
          rootNote,
          Tone.Frequency(rootNote).transpose(5).toNote(),
          Tone.Frequency(rootNote).transpose(7).toNote(),
          Tone.Frequency(rootNote).transpose(10).toNote(),
        ],
        nextDur,
      );
    }

    if (Tone.Transport.state === "started") {
      Tone.Transport.scheduleOnce(
        playNote,
        `+${Tone.Time(nextDur).toSeconds()}`,
      );
    }

    currentNoteIndex.current = noteIndex;
    currentDurIndex.current = durIndex;
  }, [getNextIndex]);

  const playHihat = useCallback(() => {
    if (Math.floor(Math.random() * 8) === 1) {
      hihatPan.volume.value = -47 + Math.random() * 20;
      hihatPan.pan.value = Math.random() * 2 - 1;
      hihatOsc.start();
      hihatOsc.stop(`+32n`);
      hihatEnv.triggerAttackRelease("32n");
    }

    Tone.Transport.scheduleOnce(playHihat, "+32n");
  }, []);

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
          playHihat();
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
