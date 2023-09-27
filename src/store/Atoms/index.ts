import { atom } from "jotai";
import { isIOS } from "react-device-detect";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

export const audioContextAtom = atom(new AudioContext());
export const soundFlagAtom = atom(!isIOS);
