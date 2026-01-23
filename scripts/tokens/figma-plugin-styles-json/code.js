function RGBAToHexA(rgba, forceRemoveAlpha = false) {
  return (
    "#" +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
      .split(",") // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map((string) => parseFloat(string)) // Converts them to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map((number) => number.toString(16)) // Converts numbers to hex
      .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
      .join("")
  ); // Puts the array to togehter to a string
}

function colorToHex({ r, g, b, a }) {
  return RGBAToHexA(
    `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)}, ${a})`
  );
}

async function go() {
  const payload = [];
  (await figma.getLocalEffectStylesAsync()).forEach(
    ({ type, name, effects }) => {
      const newEffects = effects
        .filter((a) => a.visible)
        .map((effect) => {
          const variables = {};
          const boundVariables = effect.boundVariables || {};
          for (let property in boundVariables) {
            const variable = figma.variables.getVariableById(
              boundVariables[property].id
            );
            variables[property] = variable ? variable.name : null;
          }
          const hex = effect.color ? colorToHex(effect.color) : null;
          return Object.assign({}, effect, { hex, variables });
        });
      payload.push(JSON.stringify({ type, name, effects: newEffects }));
    }
  );
  (await figma.getLocalPaintStylesAsync()).forEach(({ type, name, paints }) => {
    const newPaints = paints
      .filter((a) => a.visible)
      .map((paint) => {
        const variables = {};
        const boundVariables = paint.boundVariables || {};
        for (let property in boundVariables) {
          const variable = figma.variables.getVariableById(
            boundVariables[property].id
          );
          variables[property] = variable ? variable.name : null;
        }
        return Object.assign({}, paint, { variables });
      });
    payload.push(JSON.stringify({ type, name, paints: newPaints }));
  });
  (await figma.getLocalTextStylesAsync()).forEach(
    ({
      type,
      name,
      fontSize,
      textDecoration,
      fontName,
      letterSpacing,
      lineHeight,
      leadingTrim,
      paragraphIndent,
      paragraphSpacing,
      listSpacing,
      handingPunctiation,
      handlingList,
      textCase,
      boundVariables,
    }) => {
      const variables = {};
      const safeBoundVariables = boundVariables || {};
      for (let property in safeBoundVariables) {
        const variable = figma.variables.getVariableById(
          safeBoundVariables[property].id
        );
        variables[property] = variable ? variable.name : null;
      }
      payload.push(
        JSON.stringify({
          type,
          name,
          fontSize,
          textDecoration,
          fontName,
          letterSpacing,
          lineHeight,
          leadingTrim,
          paragraphIndent,
          paragraphSpacing,
          listSpacing,
          handingPunctiation,
          handlingList,
          textCase,
          boundVariables: safeBoundVariables,
          variables,
        })
      );
    }
  );
  figma.showUI(
    `<style>body { margin: 0 } textarea { font-family: monospace; white-space: pre; height: 100vh; width: 100vw; }</style>
<textarea>[${payload.join(",\n")}]</textarea>`,
    {
      height: 900,
      width: 1200,
    }
  );
}

go();
