# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `pnpm start` - Start the development server at http://localhost:3000
- `pnpm build` - Build for production in the `build` folder
- `pnpm test` - Run tests in interactive watch mode

### Code Quality
- `pnpm lint` - Run Biome to check for issues
- `pnpm lint:fix` - Fix Biome issues automatically with safe fixes
- `pnpm format` - Format code with Biome

## Architecture Overview

This is a React TypeScript project built with Create React App that displays a generative audio-visual experience:

1. **Visual Component (Sky)**: Renders random image crops from public/images/ on a canvas with animated effects
   - Uses `requestAnimationFrame` for continuous rendering
   - Applies log-normal distribution for image scaling
   - Adds white noise lines for artistic effect

2. **Audio Component (MarkovChainSound)**: Generates ambient drone music using Tone.js
   - Markov chain-based note and duration selection in E melodic minor
   - Polyphonic synthesizer with 6sus4 chord voicing
   - Hi-hat percussion with stochastic triggering
   - Uses Jotai for sound on/off state management

3. **State Management**: Uses Jotai for minimal global state (sound flag)

4. **Styling**: SCSS modules for component-specific styles

The app follows a simple component structure where App.tsx orchestrates the main components: ReturnToHome navigation, Sky visual renderer, MarkovChainSound audio engine, and Footer controls.