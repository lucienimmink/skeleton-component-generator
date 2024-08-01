#! /usr/bin/env node

import * as fs from "node:fs/promises";
import { styleText } from "node:util";

import { program } from "commander";

import { generateCustomElement } from "./tools.js";

program
  .name("skeleton-component-generator")
  .description(
    "Create skeleton web components using Lit based on given Custom Elements Manifest."
  )
  .option("--cem <path>", "path to the custom elements manifest to use")
  .option("--gen <path>", "path to the output directory");

program.parse(process.argv);

const options = program.opts();

const CEMPATH = options.cem ?? "./test/custom-elements.json";
const GENERATEDPATH = options.gen ?? "./test";

console.log(
  `Skeleton-component-generator. Input: ${styleText(`green`, CEMPATH)}; Output: ${styleText(`green`, GENERATEDPATH)}`
);

const cemFile = await fs.readFile(CEMPATH, "utf-8");
const cem = JSON.parse(cemFile);

cem?.modules.map((module) => {
  const declarations = module.declarations;
  declarations.map(async (declaration) => {
    const isCustomElement = declaration.customElement;
    if (isCustomElement) {
      const {name, contents} = generateCustomElement(declaration);
      if (contents) await fs.writeFile(`${GENERATEDPATH}/${name}.ts`, contents);
    }
  });
});
