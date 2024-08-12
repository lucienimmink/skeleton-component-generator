import { styleText } from 'node:util';

const capitalizeFirstLetter = string => {
  if (string === 'any') return 'Object';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getAttributesDefault = (type, value) => {
  if (type === 'any') return null;
  if (value && value !== 'undefined') {
    try {
      return value.toString();
    } catch (e) {
      console.error(e, value);
      return null;
    }
  }
  switch (type) {
    case 'object':
      return null;
    case 'number':
      return 0;
    case 'string':
    case 'String':
      return "''";
    case 'Array<any>':
      return [];
    case 'boolean':
      return false;
    default:
      console.error(`what should the default be for ${type}?`);
  }
};

const generateCustomTemplates = async TEMPLATESPATH => {
  const templateParts = [
    'customElement',
    'classComment',
    'cssPropertiesMembers',
    'attributeMembers',
    'eventsMembers',
    'nameRenderer',
    'descriptionRenderer',
    'cssPropertiesRenderer',
    'attributesRenderer',
    'eventsRenderer',
    'slotRenderer',
  ];
  const templates = {};
  await Promise.all(
    templateParts.map(async template => {
      try {
        const templateImport = await import(`${TEMPLATESPATH}/${template}.js`);
        templates[template] = templateImport.render;
      } catch (e) {
        console.log(
          `No template found for ${styleText('yellow', template)}, will use default instead`,
        );
        templates[template] = eval(template);
      }
    }),
  );
  return templates;
};

export const templateRenderer = async (declaration, TEMPLATESPATH) => {
  if (!TEMPLATESPATH) return litClassRenderer(declaration);
  console.log(`Using ${styleText('cyan', TEMPLATESPATH)} as templates`);
  const templates = await generateCustomTemplates(TEMPLATESPATH);
  return templates.customElement(declaration, templates);
};

const litClassRenderer = ({
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

const slotRenderer = slots => {
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

const eventsRenderer = events => {
  return `
    ${
      events
        ? `
          <h2>Events</h2>
          <ul>
          ${events
            .map(event => {
              return `<li><button @click=\$\{this.eventFunction${event.name}\}>trigger ${event.name}</button></li>\n`;
            })
            .join('')}
          </ul>  
      `
        : ``
    }
    `;
};

const attributesRenderer = attributes => {
  return `
    ${
      attributes
        ? `
          <h2>Attributes</h2>
          <ul>
          ${attributes
            .map(attribute => {
              return `<li>${attribute.fieldName} = \$\{this.${attribute.fieldName}\}</li>\n`;
            })
            .join('')}
          </ul>  
      `
        : ``
    }
    `;
};

const cssPropertiesRenderer = cssProperties => {
  return `
    ${
      cssProperties
        ? `
          <h2>CSS variables</h2>
          <ul>
          ${cssProperties
            .map(cssProperty => {
              return `<li><span style="color: var(${cssProperty.name}, ${cssProperty.default})">current text-color: ${cssProperty.name} default value: ${cssProperty.default}</span></li>\n`;
            })
            .join('')}
          </ul>  
      `
        : ``
    }
    `;
};

const descriptionRenderer = description => {
  return `
    ${description ? `<p>${description}</p>` : ``}
    `;
};

const nameRenderer = (name, tagName) => {
  return `
    <h1>${name} - &lt;${tagName}&gt;&lt;/${tagName}&gt;</h1>
    `;
};

const eventsMembers = events => {
  return `
    ${
      events
        ? `
          ${events
            .map(event => {
              return `
              /** Write function that dispatches the event ${event.name} */
              private eventFunction${event.name}() {
                  /** @type {${event.type.text}} ${event.description} */
                  this.dispatchEvent(new ${event.type.text}('${event.name}'));
              }
                  `;
            })
            .join('')}    
      `
        : ``
    }
    `;
};

const attributeMembers = attributes => {
  return `
    ${
      attributes
        ? `
          ${attributes
            .map(attribute => {
              return `/** ${attribute.description} */
              @property({ type: ${capitalizeFirstLetter(
                attribute.type?.text ?? 'String',
              )}, attribute: '${attribute.name}'})
              ${attribute.fieldName} = ${getAttributesDefault(attribute.type?.text ?? 'String', attribute.default)};
                  `;
            })
            .join('')}    
      `
        : ``
    }
    `;
};

const cssPropertiesMembers = cssProperties => {
  return `
    ${
      cssProperties
        ? `
          static styles = css\`
              h1, h2 {
                  margin: 0;
              }
              ul {
                  margin: 0;
              }
              :host {
                  ${cssProperties
                    .map(cssProperty => {
                      return `${cssProperty.name}: var(${cssProperty.name}, ${cssProperty.default});\n`;
                    })
                    .join('')}
              }
          \`
      `
        : ``
    }
    `;
};

const classComment = ({ cssProperties, description, slots }) => {
  return `
    ${
      cssProperties
        ? `
/**
${description ? `* ${description}\n*` : ``}
${
  slots
    ? `
${slots
  .map(slot => {
    return `* @slot ${slot.name} - ${slot.description}\n`;
  })
  .join('')}
`
    : ``
}
${cssProperties
  .map(cssProperty => {
    return `* @cssprop [${cssProperty.name}=${cssProperty.default}] - ${cssProperty.description}\n`;
  })
  .join('')}
*/    
      `
        : ``
    }
    `;
};
