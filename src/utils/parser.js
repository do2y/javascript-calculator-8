import { ERROR_MESSAGES } from '../errors.js';
import { validateInputStructure, validateAndConvertNumber } from './validator.js';

const CUSTOM_DELIMITER_PREFIX = '//';
const ESCAPED_NEWLINE = '\\n';
const CUSTOM_DELIMITER_START_INDEX = CUSTOM_DELIMITER_PREFIX.length;
const ESCAPED_NEWLINE_LENGTH = ESCAPED_NEWLINE.length;
const DEFAULT_DELIMITER = /[,:]/;

export function parseInput(userInput) {
  if (userInput === '') return [0];

  const { delimiter, inputWithoutDeclaration } = getDelimiter(userInput);
  validateInputStructure(inputWithoutDeclaration, delimiter);
  return inputWithoutDeclaration.split(delimiter).map(validateAndConvertNumber);
}

export function getDelimiter(input) {
  if (!input.startsWith(CUSTOM_DELIMITER_PREFIX)) {
    return { delimiter: DEFAULT_DELIMITER, inputWithoutDeclaration: input };
  }

  const endIdx = input.indexOf(ESCAPED_NEWLINE);
  if (endIdx === -1) throw new Error(ERROR_MESSAGES.INVALID_CUSTOM_FORMAT);

  const customDelimiter = input.slice(CUSTOM_DELIMITER_START_INDEX, endIdx);
  if (!customDelimiter) throw new Error(ERROR_MESSAGES.EMPTY_CUSTOM);
  if (customDelimiter.length > 1) throw new Error(ERROR_MESSAGES.TOO_LONG_CUSTOM);
  if (!isNaN(Number(customDelimiter))) throw new Error(ERROR_MESSAGES.NUMBER_CUSTOM);

  const inputWithoutDeclaration = input.slice(endIdx + ESCAPED_NEWLINE_LENGTH);
  return {
    delimiter: new RegExp(`[,:${customDelimiter}]`),
    inputWithoutDeclaration
  };
}
