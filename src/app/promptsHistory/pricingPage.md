You are going to create a new page for the app.

- All the AI instructions in markdown files located in a folder called `promptsHistory` should be ignored. They are just a history of the prompts I have tested.
- The path for the new page you are going to greate will be `/pricing`.
- The design will be located in this figma file: `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=562-9558&m=dev`
- Take into account that this is the root node but you could find others nodes inside the root one in different layers and you need to use for all of them the MCP functionality provide by figma to get the proper info related with them for implementing it in the proper way.
- The page content is the part between the `Header` and the `Footer` since those parts are reused in the layout for all the pages.
- For title and subtitle texts use mocks.
- There is a component called `Card Grid Pricing` that needs to behave like this:

* It use the endpoint `/plans` for getting the information.
* The pills located in the top of the component will contain as pills as possible values has the type `PricingInterval`
* The pill selected will apply the proper filter to the endpoint like for example: `/plans?interval=month`
* The pill selected by default is month
* The content of every card will be filled with each object obtain from the endpoint.
* the intems in the list are mapped with the `features` endpoint field.
* The buttons callback will call a mock callback for now.

- There is a component called `Page Accordition` that needs to behave like this:

* It is an accordition filled with the content of the `/faqs` endpoint. It returns an array of `FAQItem` type.
* Every `FAQItem` objet with generate an entry in the accordition where the title is `question` and the text is the `answer`

- Apart from the code of the new page you need to incude some tests for it.

- The click on the header nav button `Pricing` should navigate to this page
- Use copilot-instructions.md and all the files located in the `specs` folder as guidelines to use. The specs folder has more preference over the copilot-instructions.md so in case of contradictions use the specs folder ones
- Icons are not connected with figma code connect. When you see an element in the code provide by Figma in an asset property place with the name {{NAME}} you need to import an Icon component located in the ds/us/icons folder with the name `Icon{{NAME}}`.
