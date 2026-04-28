You are going to create a new page for the app.

- All the AI instructions in markdown files located in a folder called `promptsHistory` should be ignored. They are just a history of the prompts I have tested.
- The path for the new page you are going to greate will be `/contact-us`.
- The design will be located in this figma file: `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=562-9227&m=dev`
- Take into account that this is the root node but you could find others nodes inside the root one in different layers and you need to use for all of them the MCP functionality provide by figma to get the proper info related with them for implementing it in the proper way.
- The page content is the part between the `Header` and the `Footer` since those parts are reused in the layout for all the pages.
- For all the texts use mocks.
- The form submit should make a POST request to `/contacts` endpoint with all the form information.
- Client Validation:

* all the fields are mandatory
* the email should be valid
* Submit button should be disabled ones the submit is done until the request is finished correctly.
* Ones the request is confirmed all the fields and the button should reset to the initial state.

- The click on the header nav button `Contact us` should navigate to this page
- Use copilot-instructions.md and all the files located in the `specs` folder as guidelines to use. The specs folder has more preference over the copilot-instructions.md so in case of contradictions use the specs folder ones
- Icons are not connected with figma code connect. When you see an element in the code provide by Figma in an asset property place with the name {{NAME}} you need to import an Icon component located in the ds/us/icons folder with the name `Icon{{NAME}}`.
