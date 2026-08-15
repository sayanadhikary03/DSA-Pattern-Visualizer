import { useState, useCallback, useEffect, useRef } from "react";
import {
  nextStep,
  previousStep,
  restart as restartStep,
  isAtEnd,
  speedToInterval,
} from "../engine/stepManager";

/**
 * useVisualizer
 *
 * @param {Array} steps – generated execution steps
 * @returns playback controls and current state
 */
export default function useVisualizer(steps = []) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const intervalRef = useRef(null);

  const totalSteps = steps.length;
  const isComplete = totalSteps > 0 && currentStepIndex >= totalSteps - 1;
  const currentStep = totalSteps > 0 ? steps[currentStepIndex] : null;

  // Reset when steps change (new algorithm / test case)
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  // Autoplay timer
  useEffect(() => {
    if (isPlaying && !isComplete) {
      const interval = speedToInterval(speed);
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = nextStep(prev, totalSteps);
          if (isAtEnd(next, totalSteps)) {
            setIsPlaying(false);
          }
          return next;
        });
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, totalSteps, isComplete]);

  const play = useCallback(() => {
    if (!isComplete) setIsPlaying(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => nextStep(prev, totalSteps));
  }, [totalSteps]);

  const previous = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => previousStep(prev));
  }, []);

  const restart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(restartStep());
  }, []);

  const setSpeed = useCallback((newSpeed) => {
    setSpeedState(newSpeed);
  }, []);

  const goTo = useCallback(
    (index) => {
      setIsPlaying(false);
      setCurrentStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
    },
    [totalSteps]
  );

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    isComplete,
    speed,
    play,
    pause,
    next,
    previous,
    restart,
    setSpeed,
    goTo,
  };
}
