const parseInput = (inputLines) => {
  const monkeys = [];

  for (let i = 0; i < inputLines.length; i += 7) {
    const monkey = {};

    monkey.items = inputLines[i + 1]
      .split(": ")[1]
      .split(", ")
      .map((x) => +x);

    const operationInfo = inputLines[i + 2].split(": ")[1];
    const operationSplit = operationInfo.split(" ");
    const operationNumber = operationSplit[operationSplit.length - 1];
    const operationNumberParsed = +operationNumber;
    const operationSign = operationSplit[operationSplit.length - 2];
    if (operationSign === "*") {
      if (operationNumber === "old") {
        monkey.operation = (x) => Math.floor(x * x);
      } else {
        monkey.operation = (x) => Math.floor(x * operationNumber);
      }
    } else {
      if (operationNumber === "old") {
        monkey.operation = (x) => Math.floor(x + x);
      } else {
        monkey.operation = (x) => Math.floor(x + operationNumberParsed);
      }
    }

    const testInfoSplit = inputLines[i + 3].split(" ");
    const testNumber = +testInfoSplit[testInfoSplit.length - 1];
    monkey.testDivisor = testNumber;

    const trueInfoSplit = inputLines[i + 4].split(" ");
    const falseInfoSplit = inputLines[i + 5].split(" ");

    monkey.true = +trueInfoSplit[trueInfoSplit.length - 1];
    monkey.false = +falseInfoSplit[falseInfoSplit.length - 1];

    monkey.inspected = 0;

    monkeys.push(monkey);
  }

  return monkeys;
};

export default async function run({ inputLines }) {
  const monkeys = parseInput(inputLines);

  for (let round = 0; round < 20; round++) {
    for (let i = 0; i < monkeys.length; i++) {
      const monkey = monkeys[i];
      while (monkey.items.length) {
        const item = monkey.items.shift();
        const afterOp = Math.floor(monkey.operation(item) / 3);
        const movesTo =
          afterOp % monkey.testDivisor === 0 ? monkey.true : monkey.false;
        monkeys[movesTo].items.push(afterOp);
        monkey.inspected++;
      }
    }
  }

  const inspected = monkeys.map((m) => m.inspected).sort((a, b) => b - a);
  console.log(inspected[0] * inspected[1]);

  const monkeys2 = parseInput(inputLines);

  monkeys2.forEach((monkey) => {
    for (let i = 0; i < monkey.items.length; i++) {
      const newItem = {};
      const item = monkey.items[i];

      monkeys2.forEach((m2) => {
        newItem[m2.testDivisor] = item % m2.testDivisor;
      });

      monkey.items[i] = newItem;
    }
  });

  for (let round = 0; round < 10_000; round++) {
    for (let i = 0; i < monkeys2.length; i++) {
      const monkey = monkeys2[i];
      while (monkey.items.length) {
        const item = monkey.items.shift();
        Object.keys(item).forEach((key) => {
          item[key] = monkey.operation(item[key]) % +key;
        });
        const movesTo =
          item[monkey.testDivisor] === 0 ? monkey.true : monkey.false;
        monkeys2[movesTo].items.push(item);
        monkey.inspected++;
      }
    }
  }

  const inspected2 = monkeys2.map((m) => m.inspected).sort((a, b) => b - a);
  console.log(inspected2[0] * inspected2[1]);
}
