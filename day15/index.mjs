const extractCoords = (text) => {
  return [+/y=(-?\d+)/.exec(text)[1], +/x=(-?\d+)/.exec(text)[1]];
};

export default async function run({ inputLines }) {
  const sensors = inputLines.map((line) => {
    const splitLine = line.split(":");
    const sensor = extractCoords(splitLine[0]);
    const beacon = extractCoords(splitLine[1]);
    const distance =
      Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);

    return {
      location: sensor,
      beacon: beacon,
      distance,
      minX: sensor[1] - distance,
      maxX: sensor[1] + distance,
      minY: sensor[0] - distance,
      maxY: sensor[0] + distance,
    };
  });

  const minX = sensors.reduce(
    (rv, curr) => (rv < curr.minX ? rv : curr.minX),
    0
  );

  const maxX = sensors.reduce(
    (rv, curr) => (rv > curr.maxX ? rv : curr.maxX),
    0
  );

  // for input.txt
  const lineToCheck = 2000000;
  // for example.txt
  // const lineToCheck = 10;

  let noBeacon = 0;
  for (let i = minX; i <= maxX; i++) {
    if (
      sensors.some(({ beacon }) => beacon[0] === lineToCheck && beacon[1] === i)
    ) {
      continue;
    }

    if (
      sensors.some(
        ({ location, distance }) =>
          Math.abs(location[0] - lineToCheck) + Math.abs(location[1] - i) <=
          distance
      )
    ) {
      noBeacon++;
      continue;
    }
  }

  console.log(noBeacon);

  // for input.txt
  const min = 0;
  const max = 4000000;
  // for example.txt
  // const min = 0;
  // const max = 20;

  let result = null;

  for (let y = min; y <= max; y++) {
    const last = sensors
      .filter(({ minY, maxY }) => minY <= y && maxY >= y)
      .map(({ location, distance }) => {
        const remainder = distance - Math.abs(location[0] - y);
        return [location[1] - remainder, location[1] + remainder];
      })
      .sort((a, b) => a[0] - b[0])
      .reduce((rv, curr) => (rv >= curr[0] ? Math.max(rv, curr[1]) : rv), 0);

    if (last < max) {
      result = [y, last + 1];
      break;
    }
  }
  console.log(result[1] * 4000000 + result[0]);
}
