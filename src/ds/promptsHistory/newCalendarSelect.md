1.

This repository contains a design system.

Follow the guidelines contained in the usage-guidelines.mdc file attached to this request.

Your task is to create a new react component. The design for this component in this link: https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=4333-10557&m=dev

The name of the component is "Calendar Month Field" but I want you to use "Calendar Select" in the code side.

For getting all the needed design information you should use the Figma MCP.

The output of this task is to create the following files properly filled.

The tsx file at ui/primitives/CalendarSelect containing the react component
The css file at ui/primitives/CalendarSelect containing the needed styles
The storybook file for testing the component properly in the storybook page
The figma file for mapping the props to the figma ones.
Take into account that there is already a select component created. So this new component should reuse that component whith the needed visual changes.
Take into account that the proper types should be created in the same way that is done for the rest of component.

2.  You have hardcoded month details in the implementation. The CalendarSelect component will be use for month but also for years like this defined in Figma: https://www.figma.com/design/1OQXUrddcTOYCxEPP19ZFr/Simple-Design-System--Community-?node-id=4333-12221&t=d4JORHWrH0VjNnED-1

so the content should be provided by props and those prorps should't be called like they are now months. They should have a neutral name
