# Personalisation and User Control in Short-Video Recommendation Systems

## Project Overview

This project is a short-video recommendation website developed for the Intelligent Interactive Systems Assignment 2 at the University of Birmingham. The project focuses on helping users understand why videos are recommended and giving them more control over the content they see.

The website allows users to watch short videos, give feedback and change their interests. Users can also view information about their recommendations and see how their actions affect the interest scores. The aim is to make the recommendation process easier to understand and control.

## Project Features

The website provides a short-video feed with videos from different categories, including Animals, Food, Nature and Sports. Users can watch videos and move through the feed.

Users can select Like or Not Interested to give feedback on a video. This feedback changes the interest score for the video's category. For example, selecting Not Interested on an Animals video can reduce its interest score from 82 to 57.

The Why this video? section explains which category a video belongs to and shows its interest score. Users can also open My Preferences to view and change the scores for eight categories.

The website includes a preview of the updated recommendation order. Users can choose when to apply the new order rather than having the current feed change immediately. They can also undo their last feedback.

The website saves feedback and preferences in the browser when local storage is available. Users can reset manual changes or delete their saved recommendation data.

## Project Status

The website is a working interactive prototype built with React and TypeScript. The video feed, feedback buttons, recommendation explanations, preference controls and browser storage have been implemented.

The recommendation system uses a rule-based simulation. Interest scores change according to user feedback and manual preferences. The website uses these scores to update the recommendation ranking. It does not use a trained machine learning model.

The prototype does not require users to create an account or sign in.

## Technologies Used

The website was developed using React, TypeScript, HTML and CSS. Vite is used to run the project during development and build the website.

The project also uses browser local storage to save user feedback and interest scores. The example videos are loaded from Wikimedia Commons.

The main website interface is in `src/App.tsx`, while the recommendation rules are in `src/recommendation.ts`. The preference controls are in `src/PreferenceControl.tsx`.

## How to Run the Project

Node.js and npm must be installed before running the website. Node.js is needed to run the development tools, while npm installs the packages used by the project.

Download the project files and open the project folder in Visual Studio Code. Open a terminal in the folder and enter the following command.

```bash
npm install
```

This command reads the `package.json` file and installs the packages needed for the project, including React, Vite and other dependencies.

After the installation is complete, enter the following command.

```bash
npm run dev
```

Vite will display a local address in the terminal, usually `http://localhost:5173/`. Open the address shown in a web browser to use the website.

An internet connection is needed to load the example videos from Wikimedia Commons.

## Development Record

During development, I worked on the React and TypeScript code, checked errors and made changes to the website interface. I also tested the main interactions in the browser to see whether the website responded as expected.

One important part of the development was the feedback system. When a user selects Not Interested, the interest score for that video's category decreases. I checked this interaction using an Animals video, where the score changed from 82 to 57.

I also worked on how the updated recommendations are displayed. The website shows the new ranking in a preview, but the current video order stays the same until the user chooses to apply the changes. This gives users more control over when their recommendations change.

I also checked the preference controls, recommendation explanations and saved data features while developing the prototype.

## AI Assistance

I used ChatGPT during the development of this project to help with React and TypeScript code, identify possible errors and improve parts of the interface. I also used AI assistance when organising the system architecture diagram and reviewing the project documentation.

I reviewed the suggested changes and tested the website in the browser. I checked whether the main features worked as intended, including video feedback, interest score updates and preference controls. The final prototype reflects the changes and checks made during development.
