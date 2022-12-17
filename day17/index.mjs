const rockInput = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##
`;

const getRocks = () => {
  const rocks = [];
  let currentrock = [];
  rockInput.split("\n").forEach((line) => {
    if (line === "") {
      rocks.push(currentrock);
      currentrock = [];
      return;
    }
    currentrock.push(line.split(""));
  });

  return rocks;
};

const newRow = ".......".split("");

export default async function run({ inputLines }) {
  const gas = inputLines[0].split("");
  const rocks = getRocks();

  let map = [];

  const addRowsToMap = (maxRow) => {
    for (let i = map.length; i <= maxRow; i++) {
      map.push([...newRow]);
    }
  };

  const checkCollision = (rock, bottomLeft, dir) => {
    for (let y = 0; y < rock.length; y++) {
      for (let x = 0; x < rock[y].length; x++) {
        if (rock[y][x] === "#") {
          let mapY = bottomLeft[0] + rock.length - y - 1;
          let mapX = bottomLeft[1] + x;

          switch (dir) {
            case "down":
              mapY -= 1;
              break;
            case "left":
              mapX -= 1;
              break;
            case "right":
              mapX += 1;
              break;
          }

          if (
            mapY === -1 ||
            mapX === -1 ||
            mapX === 7 ||
            map[mapY]?.[mapX] === "#"
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  let jetIndex = 0;
  const pairs = [];
  let pairFound = false;
  let cycleData = null;
  let cycleCalculated = false;
  let part1Solved = false;
  let part2Solved = false;
  for (let i = 0; i < 10000; i++) {
    if (part1Solved && part2Solved) {
      break;
    }
    if (i === 2022) {
      console.log("part 1", map.length);
      part1Solved = true;
    }
    const highestRock = map.reduceRight(
      (rv, curr, idx) => (rv === -1 && curr.includes("#") ? idx : rv),
      -1
    );
    const newRock = rocks[i % rocks.length];
    const bottomLeft = [highestRock + 4, 2];

    const jetRockPair = `${jetIndex}-${i % rocks.length}`;
    if (!pairFound) {
      if (
        pairs.includes(jetRockPair) &&
        // printing all potential cycles showed this is the correct size
        // could do some better analysis to find the right cycle in the code
        i - pairs.indexOf(jetRockPair) === 1745
      ) {
        pairFound = true;
        cycleData = {
          jetRockPair,
          start: pairs.indexOf(jetRockPair),
          rocks: i - pairs.indexOf(jetRockPair),
          height1: highestRock + 1,
          height2: null,
          heightAdded: null,
          heightStart: null,
          heightAbove: null,
        };
      } else if (!pairs.includes(jetRockPair)) {
        pairs.push(jetRockPair);
      }
    } else if (
      cycleData.height2 === null &&
      cycleData.jetRockPair === jetRockPair
    ) {
      cycleData.height2 = highestRock + 1;
      cycleData.heightAdded = cycleData.height2 - cycleData.height1;
      cycleData.heightStart = cycleData.height1 - cycleData.heightAdded;
    } else if (!cycleCalculated && cycleData.height2 !== null) {
      if (
        (i - cycleData.start) % cycleData.rocks ===
        (1_000_000_000_000 - cycleData.start) % cycleData.rocks
      ) {
        cycleData.heightAbove =
          highestRock + 1 - cycleData.heightAdded * 2 - cycleData.heightStart;
        cycleCalculated = true;
        const cycles = Math.floor(
          (1_000_000_000_000 - cycleData.start) / cycleData.rocks
        );
        if (cycleData.heightAbove === cycleData.heightAdded) {
          cycleData.heightAbove = 0;
        }
        console.log(cycleData);
        console.log(
          "part 2",
          cycles * cycleData.heightAdded +
            cycleData.heightAbove +
            cycleData.heightStart
        );
        part2Solved = true;
      }
    }

    while (true) {
      if (gas[jetIndex] === ">") {
        if (!checkCollision(newRock, bottomLeft, "right")) {
          bottomLeft[1] += 1;
        }
      } else {
        if (!checkCollision(newRock, bottomLeft, "left")) {
          bottomLeft[1] -= 1;
        }
      }

      jetIndex = (jetIndex + 1) % gas.length;

      if (checkCollision(newRock, bottomLeft, "down")) {
        break;
      } else {
        bottomLeft[0] -= 1;
      }
    }

    addRowsToMap(bottomLeft[0] + newRock.length - 1);
    for (let y = 0; y < newRock.length; y++) {
      for (let x = 0; x < newRock[y].length; x++) {
        if (newRock[y][x] === "#") {
          map[bottomLeft[0] + newRock.length - y - 1][bottomLeft[1] + x] = "#";
        }
      }
    }
  }
}
