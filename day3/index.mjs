export default async function run({ inputLines }) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = lower.toUpperCase();
  const letters = lower + upper;

  const distinct = (arr) => arr.filter((x, i) => arr.indexOf(x) === i);

  const bags = inputLines.map((l) => [
    [...l.substring(0, l.length / 2)],
    [...l.substring(l.length / 2)],
  ]);

  const bothCompartments = bags.map((b) =>
    distinct(b[0].filter((l) => b[1].includes(l)))
  );

  const sum = bothCompartments.reduce(
    (rv, curr) =>
      rv + curr.reduce((rv2, curr2) => rv2 + letters.indexOf(curr2) + 1, 0),
    0
  );

  console.log(sum);

  const groups = inputLines.reduce((rv, curr, i) => {
    if (i % 3 === 0) {
      rv.push([]);
    }

    rv[rv.length - 1].push([...curr]);

    return rv;
  }, []);

  const badges = groups.map((g) =>
    distinct(g[0].filter((l) => g[1].includes(l) && g[2].includes(l)))
  );

  const badgesSum = badges.reduce(
    (rv, curr) => rv + letters.indexOf(curr[0]) + 1,
    0
  );

  console.log(badgesSum);
}
