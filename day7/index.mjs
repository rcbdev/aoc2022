const newDirectory = (parent = null) => ({
  children: {},
  parent,
  files: [],
  totalFileSize: 0,
});

export default async function run({ inputLines }) {
  const rootDirectory = newDirectory();
  const directories = [rootDirectory];

  let currentDirectory = rootDirectory;

  inputLines.forEach((l) => {
    if (l.startsWith("$ cd")) {
      const dir = l.replace("$ cd ", "");
      switch (dir) {
        case "/":
          currentDirectory = rootDirectory;
          break;
        case "..":
          currentDirectory = currentDirectory.parent;
          break;
        default:
          currentDirectory = currentDirectory.children[dir];
          break;
      }
      return;
    }
    if (l.startsWith("$ ls")) {
      return;
    }

    const split = l.split(" ");

    if (split[0] === "dir") {
      if (!currentDirectory.children[split[1]]) {
        currentDirectory.children[split[1]] = newDirectory(currentDirectory);
        directories.push(currentDirectory.children[split[1]]);
      }
    } else {
      currentDirectory.files.push({ name: split[1], size: +split[0] });
      currentDirectory.totalFileSize += +split[0];
      let parent = currentDirectory.parent;
      while (parent !== null) {
        parent.totalFileSize += +split[0];
        parent = parent.parent;
      }
    }
  });

  const small = directories.filter((d) => d.totalFileSize <= 100000);

  console.log(small.reduce((rv, curr) => rv + curr.totalFileSize, 0));

  const freeSpace = 70000000 - rootDirectory.totalFileSize;
  const required = 30000000;
  const missing = required - freeSpace;

  const candidates = directories.filter((d) => d.totalFileSize > missing);

  const best = candidates.reduce((rv, curr) =>
    rv.totalFileSize < curr.totalFileSize ? rv : curr
  );

  console.log(best.totalFileSize);
}
