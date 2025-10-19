import { ERROR_MESSAGES } from '../errors.js';

export function validateInputStructure(input, delimiter) {
  if (!/^[\d,:-\s]+$/.test(input)) {
    throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
  }

  if (!/\d/.test(input)) {
    throw new Error(ERROR_MESSAGES.NO_NUMBER);
  }

  if (new RegExp(`^${delimiter.source}|${delimiter.source}$`).test(input)) {
    throw new Error(ERROR_MESSAGES.DELIMITER_AT_EDGE);
  }
}

export function validateAndConvertNumber(token) {
  if (/^-\d+$/.test(token)) throw new Error(ERROR_MESSAGES.NEGATIVE_NUMBER);
  if (!/^\d+$/.test(token)) throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
  return Number(token);
}
