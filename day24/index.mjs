export default async function run({ inputLines }) {
  const obstacles = [];
  const maxX = inputLines[0].length - 1;
  const maxY = inputLines.length - 1;

  inputLines.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (line[j] !== ".") {
        obstacles.push({
          location: [i, j],
          type: line[j],
        });
      }
    }
  });
  const runFromTo = (start, target) => {
    let options = [start];
    let rounds = 0;

    while (true) {
      obstacles.forEach((obstacle) => {
        switch (obstacle.type) {
          case ">":
            obstacle.location[1] = obstacle.location[1] + 1;
            if (obstacle.location[1] === maxX) {
              obstacle.location[1] = 1;
            }
            break;
          case "<":
            obstacle.location[1] = obstacle.location[1] - 1;
            if (obstacle.location[1] === 0) {
              obstacle.location[1] = maxX - 1;
            }
            break;
          case "v":
            obstacle.location[0] = obstacle.location[0] + 1;
            if (obstacle.location[0] === maxY) {
              obstacle.location[0] = 1;
            }
            break;
          case "^":
            obstacle.location[0] = obstacle.location[0] - 1;
            if (obstacle.location[0] === 0) {
              obstacle.location[0] = maxY - 1;
            }
            break;
        }
      });

      const newOptions = [];

      options.forEach((option) => {
        const possibleMoves = [option];
        for (let i = -1; i <= 1; i += 2) {
          possibleMoves.push([option[0] + i, option[1]]);
          possibleMoves.push([option[0], option[1] + i]);
        }

        const filteredMoves = possibleMoves.filter((move) => {
          if (move[0] < 0 || move[1] < 0 || move[0] > maxY || move[1] > maxX) {
            return false;
          }
          return !obstacles.some(
            (obstacle) =>
              obstacle.location[0] === move[0] &&
              obstacle.location[1] === move[1]
          );
        });
        if (filteredMoves.length) {
          newOptions.push(...filteredMoves);
        }
      });

      options = newOptions.filter(
        (option, i) =>
          newOptions.findIndex(
            (o) => o[0] === option[0] && o[1] === option[1]
          ) === i
      );
      rounds++;

      if (
        options.some(
          (option) => option[0] === target[0] && option[1] === target[1]
        )
      ) {
        break;
      }
    }

    return rounds;
  };

  const part1 = runFromTo([0, 1], [maxY, maxX - 1]);

  console.log(part1);

  const backToStart = runFromTo([maxY, maxX - 1], [0, 1]);
  const backToEnd = runFromTo([0, 1], [maxY, maxX - 1]);

  console.log(part1 + backToStart + backToEnd);
}
