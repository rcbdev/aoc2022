const regex = {
  ore: /(\d+) ore/,
  clay: /(\d+) clay/,
  obsidian: /(\d+) obsidian/,
};

const whatCanIBuild = (blueprint, state) => {
  const canBuild = [];

  if (state.ore >= blueprint.oreRobot.ore) {
    canBuild.push("oreRobot");
  }
  if (state.ore >= blueprint.clayRobot.ore) {
    canBuild.push("clayRobot");
  }
  if (
    state.ore >= blueprint.obsidianRobot.ore &&
    state.clay >= blueprint.obsidianRobot.clay
  ) {
    canBuild.push("obsidianRobot");
  }
  if (
    state.ore >= blueprint.geodeRobot.ore &&
    state.obsidian >= blueprint.geodeRobot.obsidian
  ) {
    canBuild.push("geodeRobot");
  }

  return canBuild;
};

export default async function run({ inputLines }) {
  const blueprints = inputLines.map((l, i) => {
    const number = i + 1;
    const afterColon = l.split(": ")[1];
    const sections = afterColon.split(". ");
    const oreRobot = {
      ore: +regex.ore.exec(sections[0])[1],
    };
    const clayRobot = {
      ore: +regex.ore.exec(sections[1])[1],
    };
    const obsidianRobot = {
      ore: +regex.ore.exec(sections[2])[1],
      clay: +regex.clay.exec(sections[2])[1],
    };
    const geodeRobot = {
      ore: +regex.ore.exec(sections[3])[1],
      obsidian: +regex.obsidian.exec(sections[3])[1],
    };

    return {
      number,
      oreRobot,
      clayRobot,
      obsidianRobot,
      geodeRobot,
    };
  });

  const results = blueprints.slice(0, 3).map((blueprint) => {
    let options = [
      {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
        oreRobot: 1,
        clayRobot: 0,
        obsidianRobot: 0,
        geodeRobot: 0,
        skipped: [],
      },
    ];

    const maxOreNeeded = Math.max(
      blueprint.oreRobot.ore,
      blueprint.clayRobot.ore,
      blueprint.obsidianRobot.ore,
      blueprint.geodeRobot.ore
    );
    const clayNeeded = blueprint.obsidianRobot.clay;
    const obsidianNeeded = blueprint.geodeRobot.obsidian;

    for (let i = 0; i < 31; i++) {
      console.log(i, options.length);
      options = options
        .filter((option) => option.oreRobot <= maxOreNeeded)
        .filter((option) => option.clayRobot <= clayNeeded)
        .filter((option) => option.obsidianRobot <= obsidianNeeded);
      options = options.flatMap((option) => {
        const newOptions = [];
        const canBuild = whatCanIBuild(blueprint, option);
        let filtered = canBuild.filter((r) => !option.skipped.includes(r));

        if (option.obsidian >= obsidianNeeded) {
          filtered = filtered.filter((x) => x === "geodeRobot");
        }

        const afterMining = {
          ...option,
          ore: option.ore + option.oreRobot,
          clay: option.clay + option.clayRobot,
          obsidian: option.obsidian + option.obsidianRobot,
          geode: option.geode + option.geodeRobot,
        };

        for (let j = 0; j < filtered.length; j++) {
          const bot = filtered[j];
          newOptions.push({
            ...afterMining,
            ore: afterMining.ore - (blueprint[bot].ore ?? 0),
            clay: afterMining.clay - (blueprint[bot].clay ?? 0),
            obsidian: afterMining.obsidian - (blueprint[bot].obsidian ?? 0),
            [bot]: afterMining[bot] + 1,
            skipped: [],
          });
        }

        const newSkipped = [...afterMining.skipped, ...filtered];

        if (
          !(
            newSkipped.length === 4 ||
            (afterMining.clayRobot === 0 && newSkipped.length === 2) ||
            (afterMining.obsidianRobot === 0 && newSkipped.length === 3) ||
            filtered.includes("geodeRobot")
          )
        ) {
          newOptions.push({
            ...afterMining,
            skipped: [...afterMining.skipped, ...filtered],
          });
        }
        return newOptions;
      });
    }

    const best = options.sort(
      (a, b) => b.geode + b.geodeRobot - (a.geode + a.geodeRobot)
    )[0];

    console.log(`blueprint ${blueprint.number}`, best.geode + best.geodeRobot);

    return {
      ...blueprint,
      best,
    };
  });

  // console.log(
  //   results
  //     .map((r) => r.number * (r.best.geode + r.best.geodeRobot))
  //     .reduce((rv, curr) => rv + curr)
  // );
  console.log(
    results
      .map((r) => r.best.geode + r.best.geodeRobot)
      .reduce((rv, curr) => rv * curr)
  );
}
