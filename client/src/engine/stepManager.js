/**
 * Step Manager
 *
 * Pure navigation helpers that work on an immutable steps array.
 * They return the new index — the hook / state-manager applies it.
 */

export function nextStep(currentIndex, totalSteps) {
  if (currentIndex < totalSteps - 1) {
    return currentIndex + 1;
  }
  return currentIndex;
}

export function previousStep(currentIndex) {
  if (currentIndex > 0) {
    return currentIndex - 1;
  }
  return currentIndex;
}

export function goToStep(targetIndex, totalSteps) {
  return Math.max(0, Math.min(targetIndex, totalSteps - 1));
}

export function restart() {
  return 0;
}

export function isAtEnd(currentIndex, totalSteps) {
  return currentIndex >= totalSteps - 1;
}

export function isAtStart(currentIndex) {
  return currentIndex <= 0;
}

/**
 * Convert a speed multiplier to a millisecond interval for autoplay.
 * Base interval is 1000ms at 1x speed.
 */
export function speedToInterval(speed) {
  const base = 1000;
  return Math.round(base / speed);
}
