import { Console } from '@woowacourse/mission-utils';
import { parseInput } from './utils/parser.js';
import { calculateSum } from './utils/calculator.js';

class App {
  async run() {
    try {
      const input = await this.getUserInput();
      const numbers = parseInput(input);
      const sum = calculateSum(numbers);
      this.printResult(sum);
    } catch (error) {
      Console.print(error.message);
      throw error;
    }
  }

  async getUserInput() {
    return await Console.readLineAsync('덧셈할 문자열을 입력해주세요.\n');
  }

  printResult(sum) {
    Console.print(`결과 : ${sum}`);
  }
}

export default App;
