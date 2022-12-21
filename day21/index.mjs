const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "/": (a, b) => a / b,
  "*": (a, b) => a * b,
};

export default async function run({ inputLines }) {
  const monkeys = Object.fromEntries(
    inputLines
      .map((line) => {
        const split = line.split(": ");
        const name = split[0];
        const rawSum = split[1];
        if (/^\d+$/.test(rawSum)) {
          return {
            name,
            sum: null,
            result: +rawSum,
          };
        }

        const splitSum = rawSum.split(" ");
        const parsedSum = {
          left: splitSum[0],
          operator: splitSum[1],
          right: splitSum[2],
        };

        return {
          name,
          sum: parsedSum,
          result: null,
        };
      })
      .map((monkey) => [monkey.name, monkey])
  );

  const part1Monkeys = JSON.parse(JSON.stringify(monkeys));

  const calculateNumber = (monkeyName) => {
    const monkey = part1Monkeys[monkeyName];
    if (monkey.result !== null) {
      return monkey.result;
    }

    const left = calculateNumber(monkey.sum.left);
    const right = calculateNumber(monkey.sum.right);
    const result = operators[monkey.sum.operator](left, right);

    monkey.result = result;
    return result;
  };

  console.log(calculateNumber("root"));

  const part2Monkeys = JSON.parse(JSON.stringify(monkeys));

  const calculateNumber2 = (monkeyName) => {
    if (monkeyName === "humn") {
      // rubbish manual trial and error
      return 3032671800353;
    }
    const monkey = part2Monkeys[monkeyName];
    if (monkey.result !== null) {
      return monkey.result;
    }

    const left = calculateNumber2(monkey.sum.left);
    const right = calculateNumber2(monkey.sum.right);
    const result = operators[monkey.sum.operator](left, right);

    monkey.result = result;
    return result;
  };

  console.log(
    calculateNumber2(part2Monkeys.root.sum.left) -
      calculateNumber2(part2Monkeys.root.sum.right)
  );
}
