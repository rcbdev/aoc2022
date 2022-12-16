const walkPath = (path, valves) => {
  const last = path[path.length - 1];
  const nextValve = valves[last.dest];
  if (nextValve.rate > 0) {
    return [path];
  }

  return nextValve.links
    .filter((link) => !path.some((x) => x.dest === link.dest))
    .flatMap((link) => walkPath([...path, link], valves));
};

const walkPath2 = (path, valves, target) => {
  const last = path[path.length - 1];
  const nextValve = valves[last.dest];
  if (nextValve.name === target) {
    return [path];
  }

  return nextValve.links
    .filter((link) => !path.some((x) => x.dest === link.dest))
    .flatMap((link) => walkPath([...path, link], valves, target));
};

export default async function run({ inputLines }) {
  const valves = {};

  inputLines.forEach((line) => {
    const split = line.split(" ");
    const name = split[1];
    const rate = +split[4].split("=")[1].replace(";", "");
    const links = split
      .slice(9)
      .map((x) => x.replace(",", ""))
      .map((x) => ({ dest: x, time: 1 }));

    valves[name] = {
      name,
      rate,
      links,
    };
  });

  Object.values(valves).forEach((valve) => {
    const links = valve.links.flatMap((link) => {
      const paths = walkPath([{ dest: valve.name, time: 0 }, link], valves);

      const result = paths.map((path) => ({
        dest: path[path.length - 1].dest,
        time: path.reduce((rv, curr) => rv + curr.time, 0),
      }));

      return result;
    });

    valve.links = links.filter((l) => {
      const toDest = links.filter((x) => x.dest === l.dest);
      if (toDest.length === 1) {
        return true;
      }

      const minTime = Math.min(...toDest.map((x) => x.time));
      const toKeep = toDest.find((x) => x.time === minTime);

      return l === toKeep;
    });
  });

  const filtered = Object.fromEntries(
    Object.entries(valves).filter(
      ([_, value]) => value.rate > 0 || value.name === "AA"
    )
  );

  Object.values(filtered).forEach((valve) => {
    const links = valve.links.flatMap((link) =>
      Object.keys(filtered)
        .filter((x) => x !== "AA" && x !== valve.name)
        .flatMap((dest) => {
          const paths = walkPath2(
            [{ dest: valve.name, time: 0 }, link],
            valves,
            dest
          );

          const result = paths.map((path) => ({
            dest: path[path.length - 1].dest,
            time: path.reduce((rv, curr) => rv + curr.time, 0),
          }));

          return result;
        })
    );

    valve.links = links.filter((l) => {
      const toDest = links.filter((x) => x.dest === l.dest);
      if (toDest.length === 1) {
        return true;
      }

      const minTime = Math.min(...toDest.map((x) => x.time));
      const toKeep = toDest.find((x) => x.time === minTime);

      return l === toKeep;
    });
  });

  let paths1 = [
    {
      p: "AA",
      t: 30,
      visited: ["AA"],
      score: 0,
    },
  ];

  const getMoves1 = (path, time) => {
    const moves = valves[path.p].links.filter(
      (l) => !path.visited.includes(l.dest) && path.t - l.time - 1 === time
    );

    return moves.map((m) => ({
      p: m.dest,
      t: time,
      score: path.score + time * valves[m.dest].rate,
      visited: [...path.visited, m.dest],
    }));
  };

  for (let i = 30; i > 0; i--) {
    paths1 = [...paths1, ...paths1.flatMap((path) => getMoves1(path, i))];
  }

  console.log(
    paths1.reduce((rv, curr) => (rv > curr.score ? rv : curr.score), 0)
  );

  let paths2 = [
    {
      p1: "AA",
      p2: "AA",
      t1: 26,
      t2: 26,
      visited: ["AA"],
      score: 0,
    },
  ];

  const getMoves2 = (path, time, player) => {
    const moves = valves[path[`p${player}`]].links.filter(
      (l) =>
        !path.visited.includes(l.dest) &&
        path[`t${player}`] - l.time - 1 === time
    );

    return moves.map((m) => ({
      ...path,
      [`p${player}`]: m.dest,
      [`t${player}`]: time,
      score: path.score + time * valves[m.dest].rate,
      visited: [...path.visited, m.dest],
    }));
  };

  const numValves = Object.keys(valves).length;
  for (let i = 26; i > 0; i--) {
    paths2 = [...paths2, ...paths2.flatMap((path) => getMoves2(path, i, 1))];
    paths2 = [...paths2, ...paths2.flatMap((path) => getMoves2(path, i, 2))];
    // nasty hack to cut down problem space
    paths2 = paths2.sort((a, b) => b.score - a.score).slice(0, 1_000);
    console.log(i, paths2.length);
  }

  console.log(
    paths2.reduce((rv, curr) => (rv > curr.score ? rv : curr.score), 0)
  );
}
