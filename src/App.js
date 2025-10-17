import { Console } from "@woowacourse/mission-utils";

class App {
  async run() {
    const userInput = await this.getUserInput();
    const numbers = this.parseInput(userInput);
    const sum = this.calculateSum(numbers);
    this.printResult(sum);
  }

  async getUserInput() {
    const input = await Console.readLineAsync("덧셈할 문자열을 입력해주세요.\n");
    return input;
  }

  parseInput(userInput) {
    // 문자열 파싱
  }

  calculateSum(numbers) {
    // 합산
  }

  printResult() {
    // 결과 출력
  }
}

export default App;
