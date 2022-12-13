const pairIsValid = ([left, right]) => {
  for (let i = 0; i < left.length; i++) {
    if (i === right.length) {
      return false;
    }
    if (typeof left[i] === "number" && typeof right[i] === "number") {
      if (left[i] < right[i]) {
        return true;
      }
      if (left[i] === right[i]) {
        continue;
      }
      if (left[i] > right[i]) {
        return false;
      }
    }

    const childLeft = typeof left[i] === "number" ? [left[i]] : left[i];
    const childRight = typeof right[i] === "number" ? [right[i]] : right[i];
    const childCheck = pairIsValid([childLeft, childRight]);
    if (childCheck === null) {
      continue;
    }
    return childCheck;
  }

  return left.length === right.length ? null : true;
};

export default async function run({ inputLines }) {
  const packetPairs = [];

  for (let i = 0; i < inputLines.length; i += 3) {
    packetPairs.push([
      JSON.parse(inputLines[i]),
      JSON.parse(inputLines[i + 1]),
    ]);
  }

  const valid = [];
  const invalid = [];

  packetPairs.forEach((pair) => {
    if (pairIsValid(pair)) {
      valid.push(pair);
    } else {
      invalid.push(pair);
    }
  });

  console.log(
    valid
      .map((pair) => packetPairs.indexOf(pair) + 1)
      .reduce((rv, curr) => rv + curr, 0)
  );

  const div1 = [[2]];
  const div2 = [[6]];
  const allPackets = packetPairs.flatMap((x) => x).concat([div1, div2]);

  allPackets.sort((a, b) => (pairIsValid([a, b]) ? -1 : 1));

  console.log((allPackets.indexOf(div1) + 1) * (allPackets.indexOf(div2) + 1));
}
