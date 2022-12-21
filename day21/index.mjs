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

  const calculateNumber = (monkeyName) => {
    const monkey = monkeys[monkeyName];
    if (monkey.result !== null) {
      return monkey.result;
    }

    const left = calculateNumber(monkey.sum.left);
    const right = calculateNumber(monkey.sum.right);
    const result = operators[monkey.sum.operator](left, right);

    return result;
  };

  console.log(calculateNumber("root"));

  const hasHuman = (monkeyName) => {
    if (monkeyName === "humn") {
      return true;
    }

    const monkey = monkeys[monkeyName];
    if (monkey.sum === null) {
      return false;
    }

    return hasHuman(monkey.sum.left) || hasHuman(monkey.sum.right);
  };

  const leftHasHuman = hasHuman(monkeys.root.sum.left);
  const target = calculateNumber(
    leftHasHuman ? monkeys.root.sum.right : monkeys.root.sum.left
  );

  const calculateReverse = (monkeyName) => {
    const nextMonkey = Object.values(monkeys).find(
      (monkey) =>
        monkey.sum?.left === monkeyName || monkey.sum?.right === monkeyName
    );

    if (nextMonkey.name === "root") {
      return target;
    }

    const result = calculateReverse(nextMonkey.name);

    if (nextMonkey.sum.left === monkeyName) {
      const right = calculateNumber(nextMonkey.sum.right);
      switch (nextMonkey.sum.operator) {
        case "+":
          return result - right;
        case "-":
          return result + right;
        case "*":
          return result / right;
        case "/":
          return result * right;
      }
    } else {
      const left = calculateNumber(nextMonkey.sum.left);
      switch (nextMonkey.sum.operator) {
        case "+":
          return result - left;
        case "-":
          return left - result;
        case "*":
          return result / left;
        case "/":
          return left / result;
      }
    }
  };

  console.log(calculateReverse("humn"));
}
