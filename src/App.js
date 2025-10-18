import { Console } from '@woowacourse/mission-utils';

const CUSTOM_DELIMITER_START_INDEX = 2;
const ESCAPED_NEWLINE_LENGTH = 2;

class App {
  async run() {
    const userInput = await this.getUserInput();
    const numbers = this.parseInput(userInput);
    const sum = this.calculateSum(numbers);
    this.printResult(sum);
  }

  async getUserInput() {
    const input = await Console.readLineAsync('덧셈할 문자열을 입력해주세요.\n');
    return input;
  }

  parseInput(userInput) {
    if (userInput === '') return [0];

    const { delimiter, inputWithoutDeclaration } = this.getDelimiter(userInput);
    const numbers = inputWithoutDeclaration.split(delimiter).map((v) => parseInt(v, 10));

    if (numbers.some((n) => n < 0)) {
      throw new Error('[ERROR] 음수는 입력할 수 없습니다.');
    }

    return numbers;
  }

  getDelimiter(userInput) {
    let delimiter = /[,:]/;

    // 커스텀 구분자가 없는 경우, 기본 구분자를 사용한다.
    if (!userInput.startsWith('//')) {
      return { delimiter, inputWithoutDeclaration: userInput };
    }

    const delimiterEndIndex = userInput.indexOf('\\n');

    if (delimiterEndIndex === -1) {
      throw new Error('[ERROR] 잘못된 커스텀 구분자 형식입니다.');
    }

    if (delimiterEndIndex === CUSTOM_DELIMITER_START_INDEX) {
      throw new Error('[ERROR] 커스텀 구분자가 입력되지 않았습니다.');
    }

    const customDelimiter = userInput.slice(
      CUSTOM_DELIMITER_START_INDEX,
      delimiterEndIndex
    );
    if (customDelimiter.length > 1) {
      throw new Error('[ERROR] 커스텀 구분자는 한 글자만 가능합니다.');
    }

    if (!isNaN(Number(customDelimiter))) {
      throw new Error('[ERROR] 커스텀 구분자로 숫자는 사용할 수 없습니다.');
    }

    const inputWithoutDeclaration = userInput.slice(
      delimiterEndIndex + ESCAPED_NEWLINE_LENGTH
    );

    delimiter = new RegExp(`[,:${customDelimiter}]`);
    return { delimiter, inputWithoutDeclaration };
  }

  calculateSum(numbers) {
    if (numbers.some((n) => isNaN(n))) {
      throw new Error(
        '[ERROR] 숫자 또는 지정된 구분자(, : 또는 커스텀 구분자)만 입력할 수 있습니다.'
      );
    }

    return numbers.reduce((acc, cur) => acc + cur, 0);
  }

  printResult(sum) {
    Console.print('결과 : ' + sum);
  }
}

export default App;
