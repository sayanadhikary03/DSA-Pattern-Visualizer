/**
 * Line Mapper
 *
 * Given an event name and a language, returns the source-code line
 * number from an algorithm's lineMap.
 *
 * If the step already carries a `line` object, that takes precedence.
 */

/**
 * Resolve the active source-code line for the current step.
 *
 * @param {Object} step      – current execution step
 * @param {Object} lineMap   – algorithm's { cpp: {}, python: {} }
 * @param {string} language  – "cpp" or "python"
 * @returns {number|null}      1-based line number, or null
 */
export function getActiveLine(step, lineMap, language) {
  // If the step explicitly carries line info, use it
  if (step.line && step.line[language] != null) {
    return step.line[language];
  }

  // Otherwise fall back to the lineMap using the event name
  if (lineMap && lineMap[language] && step.event) {
    const mapped = lineMap[language][step.event];
    if (mapped != null) return mapped;
  }

  return null;
}
