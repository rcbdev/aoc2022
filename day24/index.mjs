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
      const blocked = {};
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
        blocked[obstacle.location[0]] = blocked[obstacle.location[0]] ?? [];
        blocked[obstacle.location[0]].push(obstacle.location[1]);
      });

      let newOptions = options.flatMap((option) => {
        const theseOptions = [option];
        for (let i = -1; i <= 1; i += 2) {
          theseOptions.push([option[0] + i, option[1]]);
          theseOptions.push([option[0], option[1] + i]);
        }

        return theseOptions;
      });
      newOptions = newOptions.filter((move) => {
        if (move[0] < 0 || move[1] < 0 || move[0] > maxY || move[1] > maxX) {
          return false;
        }
        return !blocked[move[0]]?.includes(move[1]);
      });
      const covered = {};
      options = newOptions.filter((option) => {
        if (covered[option[0]]?.includes(option[1])) {
          return false;
        }
        covered[option[0]] = covered[option[0]] ?? [];
        covered[option[0]].push(option[1]);
        return true;
      });
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
