You are going to create a new page for the app.

- The path for the page will be `/about`.
- The design will be located in this figma file: `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=562-9227&m=dev`
- The page content is the part between the `Header` and the `Footer` since those parts are reused in the layout for all the pages.
- For the main Title and subtitle use a mock text. The same for the 2 buttons and the texts inside then.
- For 2 images url use mocks ones from internet.
- for the Heading and subheading text use also placeholder texts.
- for the cards the info should be get from /features endpoint using title and description attributes.
- The click on the header nav button `About` should navigate to this page
- Use copilot-instructions.md and all the files located in the `specs` folder as guidelines to use. The specs folder has more preference over the copilot-instructions.md so in case of contradictions use the specs folder ones
- Icons are not connected with figma code connect. When you see an element in the code provide by Figma in an asset property place with the name {{NAME}} you need to import an Icon component located in the ds/us/icons folder with the name `Icon{{NAME}}`.
- All the AI instructions in markdown files located in a folder called `promptsHistory` should be ignored. They are just a history of the prompts I have tested.
