const simulateRope = (moves, size = 2) => {
  const knots = new Array(size).fill(0).map(() => [0, 0]);
  const visited = new Set();
  visited.add("0-0");
  const newMoves = moves.flatMap((move) => new Array(move.dist).fill(move.dir));

  newMoves.forEach((move) => {
    const head = knots[(0, 0)];
    switch (move) {
      case "R":
        head[0] += 1;
        break;
      case "L":
        head[0] -= 1;
        break;
      case "U":
        head[1] += 1;
        break;
      case "D":
        head[1] -= 1;
        break;
    }

    for (let i = 1; i < knots.length; i++) {
      const last = i === knots.length - 1;
      const h = knots[i - 1];
      const t = knots[i];
      if (Math.max(Math.abs(h[0] - t[0]), Math.abs(h[1] - t[1])) > 1) {
        if (h[0] === t[0]) {
          t[1] += h[1] > t[1] ? 1 : -1;
        } else if (h[1] === t[1]) {
          t[0] += h[0] > t[0] ? 1 : -1;
        } else {
          t[1] += h[1] > t[1] ? 1 : -1;
          t[0] += h[0] > t[0] ? 1 : -1;
        }
      }
      if (last) {
        visited.add(`${t[0]}-${t[1]}`);
      }
    }
  });

  return visited;
};

export default async function run({ inputLines }) {
  const moves = inputLines.map((l) => {
    const split = l.split(" ");
    return {
      dir: split[0],
      dist: +split[1],
    };
  });

  const part1 = simulateRope(moves, 2);
  console.log(part1.size);

  const part2 = simulateRope(moves, 10);
  console.log(part2.size);
}
