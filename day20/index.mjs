const mix = (startingState, roundState = startingState) => {
  const toMove = [...startingState];
  let currentState = [...roundState];
  const maxIndex = startingState.length - 1;

  while (toMove.length > 0) {
    const moving = toMove.shift();
    if (moving.value === 0) {
      continue;
    }
    const currentIndex = currentState.indexOf(moving);
    let newIndex = currentIndex + (moving.value % maxIndex);
    if (currentIndex === newIndex) {
      continue;
    }
    if (newIndex <= 0) {
      newIndex = maxIndex + newIndex;
    } else if (newIndex >= maxIndex) {
      newIndex = newIndex - maxIndex;
    }

    currentState = [
      ...currentState.slice(0, currentIndex),
      ...currentState.slice(currentIndex + 1),
    ];
    currentState = [
      ...currentState.slice(0, newIndex),
      moving,
      ...currentState.slice(newIndex),
    ];
  }

  return currentState;
};

export default async function run({ inputLines }) {
  const startingState = inputLines.map((l) => ({
    value: +l,
  }));

  const part1 = mix(startingState);

  const zeroIndex = part1.findIndex((x) => x.value === 0);
  console.log(
    part1[(zeroIndex + 1000) % part1.length].value +
      part1[(zeroIndex + 2000) % part1.length].value +
      part1[(zeroIndex + 3000) % part1.length].value
  );

  const withKey = startingState.map(({ value }) => ({
    value: value * 811589153,
  }));
  let part2 = withKey;

  for (let i = 0; i < 10; i++) {
    part2 = mix(withKey, part2);
  }

  const zeroIndex2 = part2.findIndex((x) => x.value === 0);
  console.log(
    part2[(zeroIndex2 + 1000) % part2.length].value +
      part2[(zeroIndex2 + 2000) % part2.length].value +
      part2[(zeroIndex2 + 3000) % part2.length].value
  );
}
