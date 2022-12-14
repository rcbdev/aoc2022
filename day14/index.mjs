export default async function run({ inputLines }) {
  const paths = inputLines.map((l) =>
    l.split(" -> ").map((x) => x.split(",").map((y) => +y))
  );
  let minX =
    paths
      .flatMap((path) => path.map((x) => x[0]))
      .reduce((rv, curr) => (rv < curr ? rv : curr)) - 1;
  let maxX =
    paths
      .flatMap((path) => path.map((x) => x[0]))
      .reduce((rv, curr) => (rv > curr ? rv : curr)) + 1;
  let maxY = paths
    .flatMap((path) => path.map((x) => x[1]))
    .reduce((rv, curr) => (rv > curr ? rv : curr));

  const map = new Array(maxY + 1)
    .fill(0)
    .map(() => new Array(maxX - minX + 1).fill("."));

  paths.forEach((path) => {
    for (let i = 1; i < path.length; i++) {
      const start = path[i - 1];
      const end = path[i];
      if (start[0] === end[0]) {
        const from = start[1] < end[1] ? start : end;
        const to = start[1] < end[1] ? end : start;

        for (let j = 0; j <= to[1] - from[1]; j++) {
          map[from[1] + j][from[0] - minX] = "#";
        }
      } else {
        const from = start[0] < end[0] ? start : end;
        const to = start[0] < end[0] ? end : start;

        for (let j = 0; j <= to[0] - from[0]; j++) {
          map[from[1]][from[0] + j - minX] = "#";
        }
      }
    }
  });

  let round = 0;
  while (true) {
    let x = 500 - minX;
    let stopped = false;
    for (let i = 1; i < maxY + 1; i++) {
      if (map[i][x] === ".") {
        continue;
      }
      if (map[i][x - 1] === ".") {
        x = x - 1;
        continue;
      }
      if (map[i][x + 1] === ".") {
        x = x + 1;
        continue;
      }
      map[i - 1][x] = "o";
      stopped = true;
      break;
    }
    if (!stopped) {
      break;
    }
    round++;
  }

  console.log(round);

  const height = maxY + 1;
  minX = minX - height;
  maxX = maxX + height;
  maxY = maxY + 1;

  const map2 = new Array(maxY + 1)
    .fill(0)
    .map(() => new Array(maxX - minX + 1).fill("."));

  paths.forEach((path) => {
    for (let i = 1; i < path.length; i++) {
      const start = path[i - 1];
      const end = path[i];
      if (start[0] === end[0]) {
        const from = start[1] < end[1] ? start : end;
        const to = start[1] < end[1] ? end : start;

        for (let j = 0; j <= to[1] - from[1]; j++) {
          map2[from[1] + j][from[0] - minX] = "#";
        }
      } else {
        const from = start[0] < end[0] ? start : end;
        const to = start[0] < end[0] ? end : start;

        for (let j = 0; j <= to[0] - from[0]; j++) {
          map2[from[1]][from[0] + j - minX] = "#";
        }
      }
    }
  });

  let round2 = 0;
  while (true) {
    let x = 500 - minX;
    let stopped = false;
    for (let i = 1; i < maxY + 1; i++) {
      if (map2[i][x] === ".") {
        continue;
      }
      if (map2[i][x - 1] === ".") {
        x = x - 1;
        continue;
      }
      if (map2[i][x + 1] === ".") {
        x = x + 1;
        continue;
      }
      map2[i - 1][x] = "o";
      stopped = true;
      break;
    }
    if (!stopped) {
      map2[maxY][x] = "o";
    }
    if (stopped && map2[0][500 - minX] === "o") {
      break;
    }
    round2++;
  }

  console.log(round2 + 1);
}
