export default async function run({ inputLines }) {
  const buckets = inputLines.reduce(
    (rv, curr) => {
      if (curr === "") {
        return [...rv, []];
      }

      rv[rv.length - 1].push(+curr);

      return rv;
    },
    [[]]
  );

  const totals = buckets.map((bucket) =>
    bucket.reduce((rv, curr) => rv + curr)
  );

  const sorted = [...totals].sort((a, b) => a - b).reverse();

  console.log(sorted[0] + sorted[1] + sorted[2]);
}
