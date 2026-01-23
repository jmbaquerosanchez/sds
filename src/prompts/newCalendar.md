Your task is to implement the following component defined on this figma link: https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=4333-9262&m=dev

It is a calendar where it will be displayed the days for every selected month and year.

Follow the guidelines contained in the usage-guidelines.mdc file attached to this request.

I want you to implement this new component. For that purpose you will need to:

- Add the new calendar react component to the proper UI folder, in this case for compositions and use the needed primitives components (CalendarButton and CalendarSelect). This will include the needed tsx files, the styles css files and all the types that you infer that will need according to what you can get from figma.
- Create the proper figma files for mapping the new components properties with the figma files.
- Include the needed storybook files in order to display the new components in our storybook page.

Try to keep the consistency according to the components already created.
Use figma MCP to retrieve the data you need.

The calendar component is a component designed to provide the user the posibility to select a calendar range. The actions avaliable are:

- Click on left button -> show the previous month. The CalendarButtons are updated accordinly to the new month to display the proper dates and also the month select field need to be updated with the previous month and the year should be updated with the previous year in case that the mounth was january. In that case the month should be updated to display December.
- Click on right button -> show next mounth. The CalendarButtons are updated accordinly to the new month to display the proper dates and also the month select field need to be updated with the next month and the year should be updated with the next year in case that the mounth was December. In that case the month should be updated to display January.
- Click on month field -> the user can select a mount
- Click on year field -> the user can select a year
- Click on a Calendar Button (first time) -> select the starting date
- click on a Calendar Button (second time) -> select the end date

Interview me and create plan to implement it
