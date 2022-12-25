const digitsMap = {
  "=": -2,
  "-": -1,
  0: 0,
  1: 1,
  2: 2,
};
const reverseMap = {
  "-2": "=",
  "-1": "-",
  0: 0,
  1: 1,
  2: 2,
};

export default async function run({ inputLines }) {
  const numbers = inputLines.map((line) => {
    const split = line.split("").reverse();
    let number = 0;

    for (let i = 0; i < split.length; i++) {
      number += digitsMap[split[i]] * 5 ** i;
    }

    return number;
  });

  const total = numbers.reduce((rv, curr) => rv + curr);

  let inStupidNumbers = "";
  let i = 0;
  let done = 0;

  while (true) {
    const factor = 5 ** i;
    if (factor > total) {
      break;
    }
    let remainder = ((total - done) / factor) % 5;
    if (remainder > 2) {
      remainder = remainder - 5;
    }
    inStupidNumbers = reverseMap[remainder] + inStupidNumbers;
    done += remainder * factor;
    i++;
  }

  console.log(inStupidNumbers);
}
