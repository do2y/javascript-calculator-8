import { Console } from '@woowacourse/mission-utils';
import { ERROR_MESSAGES } from './errors.js';

const CUSTOM_DELIMITER_PREFIX = '//';
const ESCAPED_NEWLINE = '\\n';
const CUSTOM_DELIMITER_START_INDEX = CUSTOM_DELIMITER_PREFIX.length;
const ESCAPED_NEWLINE_LENGTH = ESCAPED_NEWLINE.length;
const DEFAULT_DELIMITER = /[,:]/;

class App {
  async run() {
    try {
      const input = await this.getUserInput();
      const numbers = this.parseInput(input);
      const sum = this.calculateSum(numbers);
      this.printResult(sum);
    } catch (error) {
      Console.print(error.message);
      throw error;
    }
  }

  async getUserInput() {
    const input = await Console.readLineAsync('덧셈할 문자열을 입력해주세요.\n');
    return input;
  }

  parseInput(userInput) {
    if (userInput === '') return [0];

    const { delimiter, inputWithoutDeclaration } = this.getDelimiter(userInput);
    this.validateInputStructure(inputWithoutDeclaration, delimiter);

    return inputWithoutDeclaration.split(delimiter).map(this.validateAndConvertNumber);
  }

  getDelimiter(input) {
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

  validateInputStructure(input, delimiter) {
    // 구분자나 숫자, 음수 부호(-) 외의 문자가 포함된 경우
    if (!/^[\d,:-]+$/.test(input)) {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // 숫자가 하나도 포함되지 않은 경우
    if (!/\d/.test(input)) {
      throw new Error(ERROR_MESSAGES.NO_NUMBER);
    }

    // 구분자가 앞뒤에 위치한 경우
    if (new RegExp(`^${delimiter.source}|${delimiter.source}$`).test(input)) {
      throw new Error(ERROR_MESSAGES.DELIMITER_AT_EDGE);
    }
  }

  validateAndConvertNumber(token) {
    if (/^-\d+$/.test(token)) throw new Error(ERROR_MESSAGES.NEGATIVE_NUMBER);
    if (!/^\d+$/.test(token)) throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    return Number(token);
  }

  calculateSum(numbers) {
    return numbers.reduce((acc, cur) => acc + cur, 0);
  }

  printResult(sum) {
    Console.print(`결과 : ${sum}`);
  }
}

export default App;
