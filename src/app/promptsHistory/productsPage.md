You are going to create a new page for the app.

- All the AI instructions in markdown files located in a folder called `promptsHistory` should be ignored. They are just a history of the prompts I have tested.
- The path for the new page you are going to create will be `/products` and the user will be able to get that route with the proper nav button in the header `Products`.
- The page design will be located in this figma file: `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=562-10872&m=dev`
- There is one desktop design located here `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=175-7790&m=dev` and one mobile design located here `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=562-10721&m=dev`.
- Take into account that this are the root nodes but you could find others nodes inside the root one in different layers and you need to use for all of them the MCP functionality provide by figma to get the proper info related with them for implementing it in the proper way.
- The new page will do a GET from the `/products` endpoint to rereive all the needed information.
- The page will contain the following structure:

* Product card grid: Each card represent a product from `/products`
* The rest of the elements are destinated to apply different filters to the products cards displayed in the grid.
* The Filter menu is a component that contains in this order:

1. A check list with all the possible tags that the product can have. You will need to iterate for every tags array located in the product data and create a checkbox for every different one. By default all of them are not checked. When one is checked it is added that tag to the element called `Keyword List` as a Tag element. If you click on the tag button X or in the check button again the tag will be removed. The effect to de card grid is to filter the products that contains that tag.
2. A slider field for selecting a price range from 0 to (max price of all the products from `/products`). The selected range will filter the products card according to it.

- In the mobile size a new button will be displayed. the click to this button will toggle the visibility of the filter menu. In desktop that button is not visible and the filter menu is always visible.
- The search field filter the products with the introduced text in the description.
- There are some other buttons in a Tag Toggel group that will do the following:

* New: will displayed the products with the `registeredTimestamp` minor than 10 days.
* Price ascending: order the products price ascending.
* Price descending: order the products price descending.
* Rating: Order the products rating descending

- Create a product context where to keep all this component state.
- If there are more than one filter applied the cards displayed is the result of apply both.
- The page content is the part between the `Header` and the `Footer` since those parts are reused in the layout for all the pages.
- Filter Menu will filter the products displayed.

- Use copilot-instructions.md and all the files located in the `specs` folder as guidelines to use. The specs folder has more preference over the copilot-instructions.md so in case of contradictions use the specs folder ones
- Icons are not connected with figma code connect. When you see an element in the code provide by Figma in an asset property place with the name {{NAME}} you need to import an Icon component located in the ds/us/icons folder with the name `Icon{{NAME}}`.
