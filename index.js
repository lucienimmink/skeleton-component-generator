#! /usr/bin/env node

import * as fs from "node:fs/promises";
import * as prettier from "prettier";

import { litClass } from "./tools.js";

const CEMPATH = process.env.npm_config_cem ?? "./test/custom-elements.json";
const GENERATEDPATH = process.env.npm_config_gen ?? "./test";

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
