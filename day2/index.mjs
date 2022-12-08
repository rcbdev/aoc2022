export default async function run({ inputLines }) {
  const map = {
    A: 1,
    B: 2,
    C: 3,
    X: 1,
    Y: 2,
    Z: 3,
  };

  const rounds = inputLines.map((l) => {
    const moves = l.split(" ");
    return [map[moves[0]], map[moves[1]]];
  });

  const getScore = ([a, b]) =>
    (a === b ? 3 : b - a === 1 ? 6 : b - a === -2 ? 6 : 0) + b;

  const score = rounds.reduce((rv, curr) => rv + getScore(curr), 0);

  console.log(score);

  const getMoves = ([a, b]) => {
    if (b === 1) {
      const result = a === 1 ? 3 : a - 1;
      return [a, result];
    }
    if (b === 2) {
      return [a, a];
    }

    const result2 = a === 3 ? 1 : a + 1;
    return [a, result2];
  };

  const score2 = rounds.reduce((rv, curr) => rv + getScore(getMoves(curr)), 0);

  console.log(score2);
}
