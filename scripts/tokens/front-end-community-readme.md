# Figma Token Import

This folder contains all the code related to the automatic import of tokens from Figma. The tokens are stored in the following Figma file: [Simple Design System - Community](https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=3-5&m=dev) and are implemented as Figma variables.

## Process Overview

The process can be divided into two main steps:

### 1. Extract Figma Variables and Styles

Retrieve the Figma variables in JSON format and update the `tokens.json` file with their content. Similarly, extract the corresponding font and effect styles used in Figma in JSON format, and update `styles.json` with this data.

### 2. Generate CSS Variables

Use `tokens.json` and `styles.json` to generate all the CSS variables that will be used in the code. This process produces two files:

- `theme.css` - Contains all CSS custom properties
- `tokenVariableSyntaxAndDescriptionSnippet.js` - Can be executed directly in the Figma console to update the tokens with the information mapped from the corresponding CSS variables

## Methods

This can be done in two ways:

### 1. Fully Automated

By running the npm script:

```bash
npm run script:tokens:rest
```

The process will connect to the Figma file through the Figma API and retrieve the JSON data used to update `tokens.json` and `styles.json`. It will then continue with step 2 to generate the CSS variables.

> **Note:** To run the automated version, it is necessary to have an access token with read access to the file_variables scope.

### 2. Semi-Automatic

The folders `figma-plugin-styles-json` and `figma-plugin-tokens-json` contain plugins that can be used from Figma to export styles and tokens as JSON files.

> **Note:** These plugins need to be run from Figma desktop app. The web version does not support local plugins.

#### Using the Plugins

Follow these steps:

1. Open Figma desktop app and open the file in **design mode** (it does not work in dev mode)
2. Go to the "Plugins" menu and select "Development" > "Import Plugin from Manifest..."
3. Select the `manifest.json` file from either `figma-plugin-styles-json` or `figma-plugin-tokens-json` folder
4. Once imported, you can run the plugin by going to "Plugins" > "Development" and selecting the plugin you just imported
5. The plugin will generate a JSON file with the styles or tokens defined in your Figma file
6. Save the generated JSON file to your local machine (`styles.json` and `tokens.json`)
7. Integrate the JSON file into your project as needed

After completing the semi-automatic export, run the following script to start the automated phase of CSS variable generation:

```bash
npm run script:tokens
```

This script will execute the `app.mjs` file that processes token and style data.

## Input Files

The script takes two JSON files as input:

- `tokens.json` - Contains design tokens (colors, spacing, etc.)
- `styles.json` - Contains font and effect styles

## Output Files

### theme.css

Generated CSS file located in the `src` folder containing all the needed CSS variables:

- Variables prefixed with `--sds-font-*` are generated from `styles.json`
- Variables prefixed with `--sds-effects-*` are generated from `styles.json`
- All other variables are generated from `tokens.json`

### tokenVariableSyntaxAndDescriptionSnippet.js

This file contains code that can be executed directly in the Figma console to map the styles with the created CSS variables. See the reference image for an example of how to use it in Figma.
