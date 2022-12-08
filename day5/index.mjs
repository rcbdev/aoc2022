export default async function run({ inputLines }) {
  const stacks = [];

  const lineWithNumbers = inputLines.find((l) => l.startsWith(" 1"));
  const numbers = lineWithNumbers
    .trim()
    .split("  ")
    .map((c) => +c);
  const count = numbers[numbers.length - 1];

  const indexForNumberLine = inputLines.indexOf(lineWithNumbers);
  const boxesInput = inputLines.slice(0, indexForNumberLine);
  const moves = inputLines.slice(indexForNumberLine + 2).map((l) => {
    const split = l.split(" ");

    return {
      move: +split[1],
      from: +split[3] - 1,
      to: +split[5] - 1,
    };
  });

  for (let i = 0; i < count; i++) {
    const stack = boxesInput
      .map((l) => l.substring(4 * i + 1, 4 * i + 2))
      .filter((x) => x !== " ");
    stacks.push(stack);
  }

  const part1Stacks = stacks.map((stack) => [...stack]);

  moves.forEach(({ move, from, to }) => {
    for (let i = 0; i < move; i++) {
      part1Stacks[to].unshift(part1Stacks[from].shift());
    }
  });

  console.log(part1Stacks.map((s) => s[0]).join(""));

  const part2Stacks = stacks.map((stack) => [...stack]);
  moves.forEach(({ move, from, to }) => {
    const temp = [];
    for (let i = 0; i < move; i++) {
      temp.push(part2Stacks[from].shift());
    }
    part2Stacks[to].unshift(...temp);
  });

  console.log(part2Stacks.map((s) => s[0]).join(""));
}
