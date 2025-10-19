import { Console } from '@woowacourse/mission-utils';

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
    if (endIdx === -1) throw new Error('[ERROR] 잘못된 커스텀 구분자 형식입니다.');

    const customDelimiter = input.slice(CUSTOM_DELIMITER_START_INDEX, endIdx);
    if (!customDelimiter) throw new Error('[ERROR] 커스텀 구분자가 입력되지 않았습니다.');
    if (customDelimiter.length > 1)
      throw new Error('[ERROR] 커스텀 구분자는 한 글자만 가능합니다.');
    if (!isNaN(Number(customDelimiter)))
      throw new Error('[ERROR] 커스텀 구분자로 숫자는 사용할 수 없습니다.');

    const inputWithoutDeclaration = input.slice(endIdx + ESCAPED_NEWLINE_LENGTH);

    return {
      delimiter: new RegExp(`[,:${customDelimiter}]`),
      inputWithoutDeclaration
    };
  }

  validateInputStructure(input, delimiter) {
    if (!/\d/.test(input)) {
      throw new Error('[ERROR] 숫자가 포함되어야 합니다.');
    }

    if (new RegExp(`^${delimiter.source}|${delimiter.source}$`).test(input)) {
      throw new Error('[ERROR] 구분자는 문자열의 앞이나 뒤에 위치할 수 없습니다.');
    }
  }

  validateAndConvertNumber(token) {
    if (/^-\d+$/.test(token)) throw new Error('[ERROR] 음수는 입력할 수 없습니다.');
    if (!/^\d+$/.test(token)) {
      throw new Error('[ERROR] 입력은 숫자와 지정된 구분자(, : 또는 커스텀 구분자)만 가능합니다.');
    }
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
