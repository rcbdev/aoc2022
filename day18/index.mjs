export default async function run({ inputLines }) {
  // solution
  const coords = inputLines.map((l) => l.split(",").map((x) => +x));
  const maxCoord = coords
    .reduce((rv, curr) => [
      Math.max(rv[0], curr[0]),
      Math.max(rv[1], curr[1]),
      Math.max(rv[2], curr[2]),
    ])
    .map((x) => x + 2);

  const map = new Array(maxCoord[0])
    .fill(0)
    .map(() =>
      new Array(maxCoord[1]).fill(0).map(() => new Array(maxCoord[2]).fill(0))
    );

  coords.forEach((coord) => {
    map[coord[0]][coord[1]][coord[2]] = 1;
  });

  let last = 0;
  let surface = 0;

  for (let i = 0; i < maxCoord[0]; i++) {
    for (let j = 0; j < maxCoord[1]; j++) {
      for (let k = 0; k < maxCoord[2]; k++) {
        if (map[i][j][k] === last) {
          continue;
        }
        last = map[i][j][k];
        surface++;
      }
    }
  }

  for (let i = 0; i < maxCoord[0]; i++) {
    for (let k = 0; k < maxCoord[2]; k++) {
      for (let j = 0; j < maxCoord[1]; j++) {
        if (map[i][j][k] === last) {
          continue;
        }
        last = map[i][j][k];
        surface++;
      }
    }
  }

  for (let j = 0; j < maxCoord[1]; j++) {
    for (let k = 0; k < maxCoord[2]; k++) {
      for (let i = 0; i < maxCoord[0]; i++) {
        if (map[i][j][k] === last) {
          continue;
        }
        last = map[i][j][k];
        surface++;
      }
    }
  }

  console.log(surface);

  last = "w";
  surface = 0;

  const expandWater = (coord) => {
    if (coord.some((v, i) => v < 0 || v >= maxCoord[i])) {
      return;
    }
    if (map[coord[0]][coord[1]][coord[2]] !== 0) {
      return;
    }

    map[coord[0]][coord[1]][coord[2]] = "w";

    for (let i = -1; i <= 1; i += 2) {
      expandWater([coord[0] + i, coord[1], coord[2]]);
      expandWater([coord[0], coord[1] + i, coord[2]]);
      expandWater([coord[0], coord[1], coord[2] + i]);
    }
  };

  expandWater([0, 0, 0]);

  for (let i = 0; i < maxCoord[0]; i++) {
    for (let j = 0; j < maxCoord[1]; j++) {
      for (let k = 0; k < maxCoord[2]; k++) {
        if (map[i][j][k] === last) {
          continue;
        }
        if (last === "w" || map[i][j][k] === "w") {
          surface++;
        }
        last = map[i][j][k];
      }
    }
  }

  for (let i = 0; i < maxCoord[0]; i++) {
    for (let k = 0; k < maxCoord[2]; k++) {
      for (let j = 0; j < maxCoord[1]; j++) {
        if (map[i][j][k] === last) {
          continue;
        }
        if (last === "w" || map[i][j][k] === "w") {
          surface++;
        }
        last = map[i][j][k];
      }
    }
  }

  for (let j = 0; j < maxCoord[1]; j++) {
    for (let k = 0; k < maxCoord[2]; k++) {
      for (let i = 0; i < maxCoord[0]; i++) {
        if (map[i][j][k] === last) {
          continue;
        }
        if (last === "w" || map[i][j][k] === "w") {
          surface++;
        }
        last = map[i][j][k];
      }
    }
  }

  console.log(surface);
}
