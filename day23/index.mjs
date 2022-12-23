export default async function run({ inputLines }) {
  const rounds = 2000; // change to 10 for part 1. currently brute forces part 2
  const padding = new Array(rounds).fill(".");
  const width = inputLines[0].length;
  const map = [
    ...new Array(rounds)
      .fill(0)
      .map(() => new Array(rounds * 2 + width).fill(".")),
    ...inputLines.map((line) => [...padding, ...line.split(""), ...padding]),
    ...new Array(rounds)
      .fill(0)
      .map(() => new Array(rounds * 2 + width).fill(".")),
  ];

  for (let i = 0; i < rounds; i++) {
    const moves = {};

    const processMove = (from, to) => {
      const key = `${to[0]},${to[1]}`;
      if (moves[key]) {
        moves[key] = "no";
        return;
      }
      moves[key] = from;
    };

    const checkAllAround = (y, x) => {
      for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
          if (a === 0 && b == 0) {
            continue;
          }
          if (map[y + a]?.[x + b] === "#") {
            return false;
          }
        }
      }
      return true;
    };

    const tryMoveUp = (y, x) => {
      let canMove = true;
      for (let a = -1; a <= 1; a++) {
        if (map[y - 1][x + a] === "#") {
          canMove = false;
          break;
        }
      }
      if (canMove) {
        processMove([y, x], [y - 1, x]);
        return true;
      }
      return false;
    };

    const tryMoveDown = (y, x) => {
      let canMove = true;
      for (let a = -1; a <= 1; a++) {
        if (map[y + 1][x + a] === "#") {
          canMove = false;
          break;
        }
      }
      if (canMove) {
        processMove([y, x], [y + 1, x]);
        return true;
      }
      return false;
    };

    const tryMoveLeft = (y, x) => {
      let canMove = true;
      for (let a = -1; a <= 1; a++) {
        if (map[y + a][x - 1] === "#") {
          canMove = false;
          break;
        }
      }
      if (canMove) {
        processMove([y, x], [y, x - 1]);
        return true;
      }
      return false;
    };

    const tryMoveRight = (y, x) => {
      let canMove = true;
      for (let a = -1; a <= 1; a++) {
        if (map[y + a][x + 1] === "#") {
          canMove = false;
          break;
        }
      }
      if (canMove) {
        processMove([y, x], [y, x + 1]);
        return true;
      }
      return false;
    };

    const moveChecks = [tryMoveUp, tryMoveDown, tryMoveLeft, tryMoveRight];

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === "#" && !checkAllAround(y, x)) {
          for (let a = 0; a < moveChecks.length; a++) {
            const tryMove = moveChecks[(a + i) % moveChecks.length];
            if (tryMove(y, x)) {
              break;
            }
          }
        }
      }
    }

    if (Object.keys(moves).length === 0) {
      console.log(i + 1);
      break;
    }

    Object.entries(moves).forEach(([toKey, from]) => {
      if (from === "no") {
        return;
      }
      const to = toKey.split(",").map((x) => +x);
      map[from[0]][from[1]] = ".";
      map[to[0]][to[1]] = "#";
    });
  }

  if (rounds === 10) {
    const smallerMapStartRow = map.findIndex((x) => x.some((a) => a === "#"));
    const smallerMapEndRow =
      map.length -
      1 -
      [...map].reverse().findIndex((x) => x.some((a) => a === "#"));
    const smallerMapStartColumn = map
      .map((row) => row.indexOf("#"))
      .filter((x) => x > -1)
      .reduce((rv, curr) => (rv < curr ? rv : curr));
    const smallerMapEndColumn = map
      .map((row) => row.length - 1 - [...row].reverse().indexOf("#"))
      .filter((x) => x < map[0].length)
      .reduce((rv, curr) => (rv > curr ? rv : curr));

    let count = 0;
    for (let y = smallerMapStartRow; y <= smallerMapEndRow; y++) {
      for (let x = smallerMapStartColumn; x <= smallerMapEndColumn; x++) {
        if (map[y][x] === ".") {
          count++;
        }
      }
    }

    console.log(count);
  }
}
