1. Update figma variables
2. Use those variables in the components (design mode). Look for the property and map to the variable. The variable should appear in dev mode when selecting the component in the right panel, list tab
3. Run token plugin (figma desktop) and copy the output json. Paste the json in the script/tokens/tokens.json file (remove the content first).
4. Run styles plugin (figma desktop) and copy the output json. Paste the json in the script/tokens/styles.json file (remove the content firt).
5. run `npm run script:tokens` to generate `theme.css` file and `tokenVariableSyntaxAndDescriptionSnippet.js` file.
6. copy all the content in `tokenVariableSyntaxAndDescriptionSnippet.js` file and paste it on the figma app console. This will map the variable to the css variable that we just generated. You can see that if you check the details of this variable (design mode) you will see the css var that we are using in the code side.
