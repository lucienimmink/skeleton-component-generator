const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const slotRenderer = (slots) => {
  return `
    ${
      slots
        ? `
          <h2>Slots</h2>
          <ul>
          ${slots
            .map((slot) => {
              return `<li>Slot ${slot.name} (${slot.description}):
                  <slot name="${slot.name}"></slot>
              </li>\n`;
            })
            .join("")}
          </ul>  
      `
        : ``
    }
    `;
};

export const eventsRenderer = (events) => {
  return `
    ${
      events
        ? `
          <h2>Events</h2>
          <ul>
          ${events
            .map((event) => {
              return `<li><button @click=\$\{this.eventFunction${event.name}\}>trigger ${event.name}</button></li>\n`;
            })
            .join("")}
          </ul>  
      `
        : ``
    }
    `;
};

export const attributesRenderer = (attributes) => {
  return `
    ${
      attributes
        ? `
          <h2>Attributes</h2>
          <ul>
          ${attributes
            .map((attribute) => {
              return `<li>${attribute.fieldName} = \$\{this.${attribute.fieldName}\}</li>\n`;
            })
            .join("")}
          </ul>  
      `
        : ``
    }
    `;
};

export const cssPropertiesRenderer = (cssProperties) => {
  return `
    ${
      cssProperties
        ? `
          <h2>CSS variables</h2>
          <ul>
          ${cssProperties
            .map((cssProperty) => {
              return `<li><span style="color: var(${cssProperty.name}, ${cssProperty.default})">current text-color: ${cssProperty.name} default value: ${cssProperty.default}</span></li>\n`;
            })
            .join("")}
          </ul>  
      `
        : ``
    }
    `;
};

export const descriptionRenderer = (description) => {
  return `
    ${description ? `<p>${description}</p>` : ``}
    `;
};

export const nameRenderer = (name, tagName) => {
  return `
    <h1>${name} - &lt;${tagName}&gt;&lt;/${tagName}&gt;</h1>
    `;
};

export const eventsMembers = (events) => {
  return `
    ${
      events
        ? `
          ${events
            .map((event) => {
              return `
              /** Write function that dispatches the event ${event.name} */
              private eventFunction${event.name}() {
                  /** @type {${event.type.text}} ${event.description} */
                  this.dispatchEvent(new ${event.type.text}('${event.name}'));
              }
                  `;
            })
            .join("")}    
      `
        : ``
    }
    `;
};

export const attributeMembers = (attributes) => {
  return `
    ${
      attributes
        ? `
          ${attributes
            .map((attribute) => {
              return `/** ${attribute.description} */
              @property({ type: ${capitalizeFirstLetter(
                attribute.type.text
              )}, attribute: '${attribute.name}'})
              ${attribute.fieldName} = ${attribute.default};
                  `;
            })
            .join("")}    
      `
        : ``
    }
    `;
};

export const cssPropertiesMembers = (cssProperties) => {
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
                    .map((cssProperty) => {
                      return `${cssProperty.name}: var(${cssProperty.name}, ${cssProperty.default});\n`;
                    })
                    .join("")}
              }
          \`
      `
        : ``
    }
    `;
};

export const classComment = ({cssProperties, description, slots}) => {
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
    .map((slot) => {
    return `* @slot ${slot.name} - ${slot.description}\n`;
    })
    .join("")}
`
    : ``
}
${cssProperties
    .map((cssProperty) => {
    return `* @cssprop [${cssProperty.name}=${cssProperty.default}] - ${cssProperty.description}\n`;
    })
    .join("")}
*/    
      `
          : ``
      }
    `;
}