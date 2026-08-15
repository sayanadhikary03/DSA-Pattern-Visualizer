/**
 * Execution Engine
 *
 * Takes a step-generator function and test-case input, produces an
 * array of deterministic execution steps. The engine doesn't know
 * anything about how arrays / trees / graphs look visually — it only
 * manages step data.
 */

/**
 * Run a step generator against a test-case input.
 *
 * @param {Function} generateSteps  – algorithm-specific step generator
 * @param {*}        input          – the test-case input (shape varies)
 * @returns {{ steps: Array, totalSteps: number }}
 */
export function runStepGenerator(generateSteps, input) {
  const steps = generateSteps(input);
  return {
    steps,
    totalSteps: steps.length,
  };
}

/**
 * Create the initial engine state.
 */
export function createEngineState() {
  return {
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    speed: 1, // multiplier: 0.5, 1, 1.5, 2
    isComplete: false,
  };
}

/**
 * Load generated steps into an engine state snapshot.
 */
export function loadSteps(steps) {
  return {
    steps,
    currentStepIndex: 0,
    isPlaying: false,
    speed: 1,
    isComplete: steps.length === 0,
  };
}
