const letterMap = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyz".split("").map((l, i) => [l, i])
);

letterMap.S = 0;
letterMap.E = 25;

export default async function run({ inputLines }) {
  const map = inputLines.map((l) => l.split(""));

  const startRow = map.findIndex((row) => row.includes("S"));
  const startColumn = map[startRow].findIndex((x) => x === "S");

  const paths = [[[startRow, startColumn]]];
  let visited = [`${startRow}-${startColumn}`];
  let pathLength = 0;

  const udlr = (curr) => {
    const candidates = [
      [curr[0] - 1, curr[1]],
      [curr[0] + 1, curr[1]],
      [curr[0], curr[1] - 1],
      [curr[0], curr[1] + 1],
    ];

    const inGrid = candidates.filter(
      (x) => x[0] > -1 && x[0] < map.length && x[1] > -1 && x[1] < map[0].length
    );

    const notSeen = inGrid.filter((x) => !visited.includes(`${x[0]}-${x[1]}`));

    const currLetter = map[curr[0]][curr[1]];
    return notSeen.filter((x) => {
      const thisLetter = map[x[0]][x[1]];
      return letterMap[thisLetter] - letterMap[currLetter] < 2;
    });
  };

  while (true) {
    const path = paths.sort((a, b) => a.length - b.length).shift();
    const toCheck = udlr(path[path.length - 1], map);

    if (toCheck.some((x) => map[x[0]][x[1]] === "E")) {
      pathLength = path.length;
      break;
    }

    toCheck.forEach((x) => {
      paths.push([...path, x]);
      visited.push(`${x[0]}-${x[1]}`);
    });
  }

  console.log(pathLength);

  const paths2 = map
    .flatMap((row, i) =>
      row.map((x, j) => (x === "a" || x === "S" ? [[i, j]] : null))
    )
    .filter((x) => x !== null);
  visited = paths2.map((x) => `${x[0][0]}-${x[0][1]}`);

  while (true) {
    const path = paths2.sort((a, b) => a.length - b.length).shift();
    const toCheck = udlr(path[path.length - 1], map);

    if (toCheck.some((x) => map[x[0]][x[1]] === "E")) {
      pathLength = path.length;
      break;
    }

    toCheck.forEach((x) => {
      paths2.push([...path, x]);
      visited.push(`${x[0]}-${x[1]}`);
    });
  }

  console.log(pathLength);
}
