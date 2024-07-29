#! /usr/bin/env node

import * as fs from "node:fs/promises";
import * as prettier from "prettier";

import {
  classComment,
  slotRenderer,
  eventsRenderer,
  eventsMembers,
  attributesRenderer,
  attributeMembers,
  cssPropertiesRenderer,
  cssPropertiesMembers,
  descriptionRenderer,
  nameRenderer,
} from "./tools.js";

const CEMPATH = process.env.npm_config_cem ?? "./test/custom-elements.json";
const GENERATEDPATH = process.env.npm_config_gen ?? "./test";

console.log(`Skeleton-component-generator, input: ${CEMPATH}, output: ${GENERATEDPATH}`);

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
    await fs.writeFile(
      `${GENERATEDPATH}/${name}.ts`,
      contents
    );
  } else {
    console.log(`Skipping ${name}, for now this only works with lit`);
  }
};

const litClass = ({
  description,
  name,
  tagName,
  cssProperties,
  attributes,
  events,
  slots,
}) => {
  return `
  import { html, css, LitElement } from 'lit';
  import { customElement, property } from 'lit/decorators.js';

  ${classComment({ cssProperties, description, slots })}
  
  @customElement('${tagName}')
  export class ${name} extends LitElement {
      ${cssPropertiesMembers(cssProperties)}
      ${attributeMembers(attributes)}
      ${eventsMembers(events)}
      render() {
          return html\`
          ${nameRenderer(name, tagName)}
          ${descriptionRenderer(description)}
          ${cssPropertiesRenderer(cssProperties)}
          ${attributesRenderer(attributes)}
          ${eventsRenderer(events)}
          ${slotRenderer(slots)}
          \`
      }
  }
`;
};

cem?.modules.map((module) => {
  // console.log(`found module ${module.path}`);
  const declarations = module.declarations;
  declarations.map((declaration) => {
    // console.log(declaration);
    const isCustomElement = declaration.customElement;
    if (isCustomElement) {
      // console.log("\tthis is a custom element!");
      generateLitElement(declaration);
    }
  });
});
