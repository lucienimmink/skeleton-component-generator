# @addasoft/skeleton-component-generator

> Create skeleton web components using Lit based on given Custom Elements Manifest.

## Install

```bash
npm install @addasoft/skeleton-component-generator
```

Project has a dependency `prettier`.

## Usage

### Specify input and output

`skeleton-component-generator --cem=[path to cem] --gen=[path to output generated files]`.

### Speficy custom templates

Added in `1.1.0`. Ability to override the template(s) that are used to generate parts of the skeleton class. Use the parameter `--templates <path>` to point to a specific directory containing the overrides.
If no override for a template is found in the given path the internal default will be used instead. Templates need to include a `render()` function that returns the output of the template. The `render()` function accepts parameters as defined in the `customElement` template. By default the parameter points to the object with the same name in CEM. So for example the `slots` template uses the `slots` object in CEM as the parameter.

#### Example

```javascript
export const render = slots => {
  return `
    ${
      slots
        ? `
          <h2>Slots</h2>
          <ul>
          ${slots
            .map(slot => {
              return `<li>Slot ${slot.name} (${slot.description}):
                  <slot name="${slot.name}"></slot>
              </li>\n`;
            })
            .join('')}
          </ul>  
      `
        : ``
    }
    `;
};
```

If you override the `customElement` template (the root template) you need to include the list of available templates. By overriding the `customElement` template you can also use different Custom Elements libraries instead of Lit, you are in full control.

#### Example

```javascript
export const render = (
  { description, name, tagName, cssProperties, attributes, events, slots },
  { classComment, cssPropertiesMembers, attributeMembers, eventsMembers, nameRenderer, descriptionRenderer, cssPropertiesRenderer, attributesRenderer, eventsRenderer, slotRenderer },
) => {
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
```

### Available templates

- customElement - base template. accepts &lt;declaration&gt; and &lt;templates&gt;
- attributeMembers - template to render the attributes as a list. accepts &lt;attributes&gt;
- attributesRenderer - template for showing the attributes. accepts &lt;attributes&gt;
- classComment - template to render comments at the top of the class. accepts &lt;declaration&gt;
- cssPropertiesMembers - template to render the CSS properties. accepts &lt;cssProperties&gt;
- cssPropertiesRenderer - template to render the CSS properties as a list. accepts &lt;cssProperties&gt;
- descriptionRenderer - template to render the description. accepts &lt;description&gt;
- eventsMembers - template to create a function that triggers the event. accepts &lt;events&gt;
- eventsRenderer - template to render buttons to trigger the event functions. accepts &lt;events&gt;
- nameRenderer - template to render the class name and custom element name. accepts &lt;name&gt; and &lt;tagName&gt;
- slotRenderer - template to render a slot. accepts &lt;slots&gt;

## Example

### CEM

```json
{
  "schemaVersion": "1.0.0",
  "readme": "",
  "modules": [
    {
      "kind": "javascript-module",
      "path": "components/hello-world.ts",
      "declarations": [
        {
          "kind": "class",
          "description": "Hello generated world! Click for a gift or a bomb",
          "name": "HelloWorld",
          "cssProperties": [
            {
              "description": "Controls the text colour",
              "name": "--text-color",
              "default": "black"
            },
            {
              "description": "Controls the background colour",
              "name": "--background-color",
              "default": "red"
            }
          ],
          "members": [
            {
              "kind": "field",
              "name": "type",
              "type": {
                "text": "string"
              },
              "default": "\"wonderful\"",
              "description": "What type is the world today?",
              "attribute": "type"
            },
            {
              "kind": "method",
              "name": "eventFunctionGift",
              "privacy": "private",
              "description": "Write function that dispatches the event Gift"
            },
            {
              "kind": "method",
              "name": "eventFunctionBomb",
              "privacy": "private",
              "description": "Write function that dispatches the event Bomb"
            }
          ],
          "events": [
            {
              "name": "Gift",
              "type": {
                "text": "Event"
              },
              "description": "gift - I'm bearing a gift"
            },
            {
              "name": "Bomb",
              "type": {
                "text": "Event"
              },
              "description": "bomb - This was a mistake..."
            }
          ],
          "attributes": [
            {
              "name": "type",
              "type": {
                "text": "string"
              },
              "default": "\"wonderful\"",
              "description": "What type is the world today?",
              "fieldName": "type"
            }
          ],
          "superclass": {
            "name": "LitElement",
            "package": "lit"
          },
          "tagName": "hello-world",
          "customElement": true
        }
      ],
      "exports": [
        {
          "kind": "js",
          "name": "HelloWorld",
          "declaration": {
            "name": "HelloWorld",
            "module": "components/hello-world.ts"
          }
        },
        {
          "kind": "custom-element-definition",
          "name": "hello-world",
          "declaration": {
            "name": "HelloWorld",
            "module": "components/hello-world.ts"
          }
        }
      ]
    }
  ]
}
```

### Generated lit element

```typescript
import { html, css, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

/**
* Hello generated world! Click for a gift or a bomb
*

* @cssprop [--text-color=black] - Controls the text colour
* @cssprop [--background-color=red] - Controls the background colour

*/

@customElement("hello-world")
export class HelloWorld extends LitElement {
  static styles = css`
    h1,
    h2 {
      margin: 0;
    }
    ul {
      margin: 0;
    }
    :host {
      --text-color: var(--text-color, black);
      --background-color: var(--background-color, red);
    }
  `

  /** What type is the world today? */
  @property({ type: String, attribute: "type" })
  type = "wonderful"

  /** Write function that dispatches the event Gift */
  private eventFunctionGift() {
    /** @type {Event} gift - I'm bearing a gift */
    this.dispatchEvent(new Event("Gift"))
  }

  /** Write function that dispatches the event Bomb */
  private eventFunctionBomb() {
    /** @type {Event} bomb - This was a mistake... */
    this.dispatchEvent(new Event("Bomb"))
  }

  render() {
    return html`
      <h1>HelloWorld - &lt;hello-world&gt;&lt;/hello-world&gt;</h1>

      <p>Hello generated world! Click for a gift or a bomb</p>

      <h2>CSS variables</h2>
      <ul>
        <li>
          <span style="color: var(--text-color, black)"
            >current text-color: --text-color default value: black</span
          >
        </li>
        <li>
          <span style="color: var(--background-color, red)"
            >current text-color: --background-color default value: red</span
          >
        </li>
      </ul>

      <h2>Attributes</h2>
      <ul>
        <li>type = ${this.type}</li>
      </ul>

      <h2>Events</h2>
      <ul>
        <li><button @click=${this.eventFunctionGift}>trigger Gift</button></li>
        <li><button @click=${this.eventFunctionBomb}>trigger Bomb</button></li>
      </ul>
    `
  }
}
```
