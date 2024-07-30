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
