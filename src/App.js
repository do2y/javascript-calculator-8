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
    const { delimiter, inputWithoutDeclaration } = this.getDelimiter(userInput);
    return inputWithoutDeclaration.split(delimiter).map((v) => parseInt(v, 10));
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
    // 합산
  }

  printResult() {
    // 결과 출력
  }
}

export default App;
