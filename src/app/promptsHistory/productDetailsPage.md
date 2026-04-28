You are going to create a new page for the app.

- All the AI instructions in markdown files located in a folder called `promptsHistory` should be ignored. They are just a history of the prompts I have tested.
- The path for the new page you are going to create will be `/products/:id`.
-
- The page design will be located in this figma file: `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=562-11271&m=dev`
- There is one desktop design located here `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=175-8591&m=dev` and one mobile design located here `https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=562-11212&m=dev`.
- Take into account that this are the root nodes but you could find others nodes inside the root one in different layers and you need to use for all of them the MCP functionality provide by figma to get the proper info related with them for implementing it in the proper way.
- The new page will do a GET from the `/products/{{PRODUCT_ID}}` endpoint to retrieve the product object that contains all the needed information.
- it will also use `reviews?productId={{PRODUCT_ID}}` to get the reviews asociated to that product.
- The PRODUCT_ID used to call both endpoints will be taken from the URL param `:id`
- The page will contain the following parts:

* The first part is product information. The Select fields that you will find needs to be filled with the `attributes` content. So There will be one select field per attribute in that array and the options to be selected will be the `AttributeValue` type ones. Clicking on the button will make a POST call to `shoppingCart` adding a `ShoppingCartItem`. All the Select fields avaliable for each product are mandatory. The button will be disabled after a click and enabled again ones the request to de server is confirmed. A informative message should be displayed.
* The second part are revies card for the current product so it will be generated one card per object obtain from `reviews?productId={{PRODUCT_ID}}`
* The third part is an input field to join to a newsletter. After clicking in submit button a POST request will be sent with a `NewsletterListEntry` object. there should be client validation to check it is a email and the input field is mandatory. The submit button should be disabled ones a click is produce until the moment the request to the server is done.

- The page content is the part between the `Header` and the `Footer` since those parts are reused in the layout for all the pages.
- Filter Menu will filter the products displayed.

- Use copilot-instructions.md and all the files located in the `specs` folder as guidelines to use. The specs folder has more preference over the copilot-instructions.md so in case of contradictions use the specs folder ones
- Icons are not connected with figma code connect. When you see an element in the code provide by Figma in an asset property place with the name {{NAME}} you need to import an Icon component located in the ds/us/icons folder with the name `Icon{{NAME}}`.
