#! /usr/bin/env node

import * as fs from 'node:fs/promises';
import { styleText } from 'node:util';
import * as prettier from 'prettier';
import { program } from 'commander';

import { templateRenderer } from './tools.js';

program
  .name('skeleton-component-generator')
  .description(
    'Create skeleton web components using Lit based on given Custom Elements Manifest.',
  )
  .option('--cem <path>', 'path to the custom elements manifest to use')
  .option('--gen <path>', 'path to the output directory')
  .option('--templates <path>', 'path to directory with custom templates');

program.parse(process.argv);

const options = program.opts();

const CEMPATH = options.cem ?? './test/custom-elements.json';
const GENERATEDPATH = options.gen ?? './test';
const TEMPLATESPATH = options.templates ?? null;

try {
  const isFile = await fs.access(CEMPATH);
} catch (e) {
  console.log(`CEM not found at path ${styleText('cyan', CEMPATH)}`);
  process.exit(1);
}

console.log(
  `Skeleton-component-generator. Input: ${styleText('cyan', CEMPATH)}; Output: ${styleText('green', GENERATEDPATH)}`,
);

const cemFile = await fs.readFile(CEMPATH, 'utf-8');
const cem = JSON.parse(cemFile);

const generateCustomElement = async declaration => {
  const { name, superclass, tagName } = declaration;
  if (superclass.package === 'lit') {
    console.log(
      `Generating class ${styleText('green', name)} with tag ${styleText('cyan', tagName)}, based on ${styleText('yellow', superclass.package)}`,
    );
    const contents = await prettier.format(
      await templateRenderer(declaration, TEMPLATESPATH),
      {
        semi: false,
        parser: 'typescript',
      },
    );
    await fs.writeFile(`${GENERATEDPATH}/${name}.ts`, contents);
  } else {
    console.log(`Skipping ${name}, for now this only works with lit`);
  }
};

cem?.modules.map(module => {
  const declarations = module.declarations;
  declarations.map(async declaration => {
    const isCustomElement = declaration.customElement;
    if (isCustomElement) {
      const { name, contents } = generateCustomElement(declaration);
      if (contents) await fs.writeFile(`${GENERATEDPATH}/${name}.ts`, contents);
    }
  });
});
