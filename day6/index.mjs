const findMarker = (text, size) => {
  const buffer = text.substring(0, size).split("");
  let index = size;

  while (buffer.some((l, i) => buffer.indexOf(l) !== i)) {
    buffer.shift();
    buffer.push(text[index]);
    index++;
  }

  return index;
};

export default async function run({ inputText }) {
  console.log(findMarker(inputText, 4));
  console.log(findMarker(inputText, 14));
}
