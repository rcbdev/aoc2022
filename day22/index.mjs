export default async function run({ inputLines }) {
  const map = inputLines.slice(0, inputLines.length - 2);
  let rawInstructions = inputLines[inputLines.length - 1];

  const instructions = [];
  let lastWasNumber = false;

  while (rawInstructions.length > 0) {
    if (lastWasNumber) {
      instructions.push(rawInstructions[0]);
      rawInstructions = rawInstructions.substring(1);
      lastWasNumber = false;
    } else {
      const instruction = rawInstructions.match(/\d+/)[0];
      instructions.push(+instruction);
      rawInstructions = rawInstructions.substring(instruction.length);
      lastWasNumber = true;
    }
  }

  const startOfLine1 = map[0].indexOf(".");

  const state = {
    position: [0, startOfLine1],
    direction: [0, 1],
  };

  const findFirstInColumn = (column, direction) => {
    for (
      let i = direction === "up" ? map.length - 1 : 0;
      direction === "up" ? i >= 0 : i < map.length;
      direction === "up" ? i-- : i++
    ) {
      if (map[i][column] && map[i][column] !== " ") {
        return i;
      }
    }
  };

  const findFirstInRow = (row, direction) => {
    for (
      let i = direction === "left" ? map[row].length - 1 : 0;
      direction === "left" ? i >= 0 : i < map[row].length;
      direction === "left" ? i-- : i++
    ) {
      if (map[row][i] && map[row][i] !== " ") {
        return i;
      }
    }
  };

  instructions.forEach((instruction) => {
    if (typeof instruction === "number") {
      for (let i = 0; i < instruction; i++) {
        const newPosition = [
          state.position[0] + state.direction[0],
          state.position[1] + state.direction[1],
        ];
        if (
          map[newPosition[0]]?.[newPosition[1]] === " " ||
          !map[newPosition[0]]?.[newPosition[1]]
        ) {
          if (state.direction[0] === -1) {
            newPosition[0] = findFirstInColumn(newPosition[1], "up");
          } else if (state.direction[0] === 1) {
            newPosition[0] = findFirstInColumn(newPosition[1], "down");
          } else if (state.direction[1] === -1) {
            newPosition[1] = findFirstInRow(newPosition[0], "left");
          } else {
            newPosition[1] = findFirstInRow(newPosition[0], "right");
          }
        }
        if (map[newPosition[0]][newPosition[1]] === "#") {
          break;
        }
        if (map[newPosition[0]][newPosition[1]] === ".") {
          state.position = newPosition;
          continue;
        }
        throw new Error("you should not get here:" + newPosition.join());
      }
    } else {
      if (state.direction[0] === 1) {
        state.direction = [0, -1];
      } else if (state.direction[0] === -1) {
        state.direction = [0, 1];
      } else if (state.direction[1] === 1) {
        state.direction = [1, 0];
      } else {
        state.direction = [-1, 0];
      }
      if (instruction === "L") {
        state.direction[0] = -1 * state.direction[0];
        state.direction[1] = -1 * state.direction[1];
      }
    }
  });

  const directionScore =
    state.direction[1] === 1
      ? 0
      : state.direction[0] === 1
      ? 1
      : state.direction[1] === -1
      ? 2
      : 3;
  console.log(
    1000 * (state.position[0] + 1) +
      4 * (state.position[1] + 1) +
      directionScore
  );

  const part2 = {
    position: [0, startOfLine1],
    direction: [0, 1],
  };

  const sideSize = 50;

  // specific to my input, doesn't actually figure out the cube from the net
  const wrapAroundCubeColumn = (column, row) => {
    if (column < sideSize) {
      if (row === sideSize * 2) {
        return [
          [column + sideSize, sideSize],
          [0, 1],
        ];
      }
      return [
        [0, sideSize * 2 + column],
        [1, 0],
      ];
    }
    if (column < sideSize * 2) {
      if (row === 0) {
        return [
          [sideSize * 2 + column, 0],
          [0, 1],
        ];
      }

      return [
        [sideSize * 2 + column, sideSize - 1],
        [0, -1],
      ];
    }
    if (row === 0) {
      return [
        [sideSize * 4 - 1, column - sideSize * 2],
        [-1, 0],
      ];
    }
    return [
      [column - sideSize, sideSize * 2 - 1],
      [0, -1],
    ];
  };

  const wrapAroundCubeRow = (row, column) => {
    if (row < sideSize) {
      if (column === sideSize) {
        return [
          [sideSize * 3 - 1 - row, 0],
          [0, 1],
        ];
      }
      return [
        [sideSize * 3 - 1 - row, sideSize * 2 - 1],
        [0, -1],
      ];
    }
    if (row < sideSize * 2) {
      if (column === sideSize) {
        return [
          [sideSize * 2, row - sideSize],
          [1, 0],
        ];
      }
      return [
        [sideSize - 1, row + sideSize],
        [-1, 0],
      ];
    }
    if (row < sideSize * 3) {
      if (column === 0) {
        return [
          [sideSize * 3 - 1 - row, sideSize],
          [0, 1],
        ];
      }
      return [
        [sideSize * 3 - 1 - row, sideSize * 3 - 1],
        [0, -1],
      ];
    }
    if (column === 0) {
      return [
        [0, row - sideSize * 2],
        [1, 0],
      ];
    }

    return [
      [sideSize * 3 - 1, row - sideSize * 2],
      [-1, 0],
    ];
  };

  instructions.forEach((instruction) => {
    if (typeof instruction === "number") {
      for (let i = 0; i < instruction; i++) {
        let newPosition = [
          part2.position[0] + part2.direction[0],
          part2.position[1] + part2.direction[1],
        ];
        let newDirection = part2.direction;
        if (
          map[newPosition[0]]?.[newPosition[1]] === " " ||
          !map[newPosition[0]]?.[newPosition[1]]
        ) {
          console.log("from", part2.position);
          if (part2.direction[1] === 0) {
            [newPosition, newDirection] = wrapAroundCubeColumn(
              part2.position[1],
              part2.position[0]
            );
          } else {
            [newPosition, newDirection] = newPosition = wrapAroundCubeRow(
              part2.position[0],
              part2.position[1]
            );
          }
          console.log("to", newPosition);
        }
        if (!map[newPosition[0]]) {
          console.log(part2.position, newPosition);
        }
        if (map[newPosition[0]][newPosition[1]] === "#") {
          break;
        }
        if (map[newPosition[0]][newPosition[1]] === ".") {
          part2.position = newPosition;
          part2.direction = newDirection;
        }
      }
    } else {
      if (part2.direction[0] === 1) {
        part2.direction = [0, -1];
      } else if (part2.direction[0] === -1) {
        part2.direction = [0, 1];
      } else if (part2.direction[1] === 1) {
        part2.direction = [1, 0];
      } else {
        part2.direction = [-1, 0];
      }
      if (instruction === "L") {
        part2.direction[0] = -1 * part2.direction[0];
        part2.direction[1] = -1 * part2.direction[1];
      }
    }
    console.log(instruction, part2.position, part2.direction);
  });

  const directionScore2 =
    part2.direction[1] === 1
      ? 0
      : part2.direction[0] === 1
      ? 1
      : part2.direction[1] === -1
      ? 2
      : 3;
  console.log(
    1000 * (part2.position[0] + 1) +
      4 * (part2.position[1] + 1) +
      directionScore2
  );
}
