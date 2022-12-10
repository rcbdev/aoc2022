export default async function run({ inputLines }) {
  let cycle = 1;
  let x = 1;
  let interestingSignals = {};
  let output = [];

  const checkInterestingCycle = () => {
    if ((cycle - 20) % 40 === 0) {
      interestingSignals[cycle] = x * cycle;
    }
  };

  const draw = () => {
    const rowPosition = (cycle - 1) % 40;
    if (rowPosition === 0) {
      output.push("");
    }

    if (Math.abs(rowPosition - x) <= 1) {
      output[output.length - 1] += "#";
    } else {
      output[output.length - 1] += ".";
    }
  };

  const runCycle = () => {
    checkInterestingCycle();
    draw();
    cycle++;
  };

  inputLines.forEach((command) => {
    const split = command.split(" ");
    switch (split[0]) {
      case "noop":
        runCycle();
        break;
      case "addx":
        runCycle();
        runCycle();
        x += +split[1];
        break;
    }
  });

  console.log(
    Object.values(interestingSignals).reduce((rv, curr) => rv + curr)
  );

  output.forEach((line) => console.log(line));
}
