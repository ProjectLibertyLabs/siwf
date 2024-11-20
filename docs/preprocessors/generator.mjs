// Debugging Help
// Use console.error, not console.log
//
// Replaces {{#GENERATOR}} with the ./src/Generator/index.html data

import { readFileSync } from "node:fs";

function generatorEmbed(chapter) {
  const regex = /{{#GENERATOR}}/g;
  const matches = [...chapter.content.matchAll(regex)];
  matches.forEach((match) => {
    try {
      const output = readFileSync("./src/Generator/index.html", "utf8");

      const replaceWith = output
        .split("\n")
        .map((line) => line.trim().replace("./_app/", "./Generator/_app/"))
        .join("\n");
      chapter.content = chapter.content.replace(match[0], replaceWith);
    } catch (e) {
      console.error(
        "Unable to read the generated Generator script. Looks like you need to follow the instructions in tools/signed-request-generator/README.md",
      );
      throw e;
    }
  });
  if (chapter.sub_items) {
    chapter.sub_items.forEach((section) => {
      section.Chapter && generatorEmbed(section.Chapter);
    });
  }
}

// Function to perform the preprocessing
function preprocessMdBook([_context, book]) {
  // Generator Embed
  book.sections.forEach((section) => {
    section.Chapter && generatorEmbed(section.Chapter);
  });

  // Output the processed content in mdbook preprocessor format
  process.stdout.write(JSON.stringify(book));
}

if (process.argv < 3) {
  throw new Error("Something strange is happening");
}

if (process.argv[2] === "supports") {
  process.exit(0);
}

process.stdin.setEncoding("utf-8");
process.stdout.setEncoding("utf-8");

// Read data from stdin
let inputData = "";

process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", () => {
  preprocessMdBook(JSON.parse(inputData));
});
