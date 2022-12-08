export default async function run({ inputLines }) {
  const assignments = inputLines.map((l) =>
    l.split(",").map((x) => x.split("-").map((y) => +y))
  );

  const isInside = (a, b) => b[0] >= a[0] && b[1] <= a[1];

  const overlaps = assignments.filter(
    (a) => isInside(a[0], a[1]) || isInside(a[1], a[0])
  );

  console.log(overlaps.length);

  const isOverlap = (a, b) =>
    (b[0] >= a[0] && b[0] <= a[1]) || (b[1] >= a[0] && b[1] <= a[1]);

  const overlaps2 = assignments.filter(
    (a) => isOverlap(a[0], a[1]) || isOverlap(a[1], a[0])
  );

  console.log(overlaps2.length);
}
