export default async function run({ inputLines }) {
  const trees = inputLines.map((l) => l.split("").map((x) => +x));
  const visible = [];

  const width = trees[0].length;
  const height = trees.length;

  const scores = trees.map((row) => row.map(() => 1));

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const treeHeight = trees[y][x];
      let found = false;
      for (let i = -1; i <= 1; i += 2) {
        let heighest = true;
        let x2 = x + i;
        while (x2 > -1 && x2 < width) {
          if (trees[y][x2] >= treeHeight) {
            heighest = false;
            break;
          }
          x2 += i;
        }
        const x2Pinned = x2 === -1 ? 0 : x2 === width ? width - 1 : x2;
        const canSee = Math.abs(x - x2Pinned);
        scores[y][x] = scores[y][x] * canSee;
        if (heighest && !found) {
          visible.push({ x, y });
          found = true;
        }
      }
      for (let j = -1; j <= 1; j += 2) {
        let heighest = true;
        let y2 = y + j;
        while (y2 > -1 && y2 < height) {
          if (trees[y2][x] >= treeHeight) {
            heighest = false;
            break;
          }
          y2 += j;
        }
        const y2Pinned = y2 === -1 ? 0 : y2 === height ? height - 1 : y2;
        const canSee = Math.abs(y - y2Pinned);
        scores[y][x] = scores[y][x] * canSee;
        if (heighest && !found) {
          visible.push({ x, y });
          found = true;
        }
      }
    }
  }

  console.log(visible.length);

  const maxScore = scores
    .flatMap((row) => row)
    .reduce((rv, curr) => (rv > curr ? rv : curr));

  console.log(maxScore);
}
