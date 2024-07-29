#! /usr/bin/env node

import * as fs from "node:fs/promises";
import * as prettier from "prettier";
import { program } from "commander";

import { litClass } from "./tools.js";

program
  .name("skeleton-component-generator")
  .description("Create skeleton web components using Lit based on given Custom Elements Manifest.")
  .option('--cem <path>', 'path to the custom elements manifest to use')
  .option('--gen <path>', 'path to the output directory')

program.parse(process.argv);

const options = program.opts();

const CEMPATH = options.cem ?? "./test/custom-elements.json";
const GENERATEDPATH = options.gen ?? "./test";

console.log(options);

console.log(
  `Skeleton-component-generator. Input: ${CEMPATH}; Output: ${GENERATEDPATH}`
);

const cemFile = await fs.readFile(CEMPATH, "utf-8");
const cem = JSON.parse(cemFile);

const generateLitElement = async (declaration) => {
  const { name, superclass, tagName } = declaration;
  if (superclass.package === "lit") {
    console.log(
      `Generating class ${name} with tag ${tagName}, based on ${superclass.package}`
    );
    const contents = await prettier.format(litClass(declaration), {
      semi: false,
      parser: "typescript",
    });
    await fs.writeFile(`${GENERATEDPATH}/${name}.ts`, contents);
  } else {
    console.log(`Skipping ${name}, for now this only works with lit`);
  }
};

cem?.modules.map((module) => {
  const declarations = module.declarations;
  declarations.map((declaration) => {
    const isCustomElement = declaration.customElement;
    if (isCustomElement) {
      generateLitElement(declaration);
    }
  });
});
