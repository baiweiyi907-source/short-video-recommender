# Personalisation and User Control in Short-Video Recommendation Systems
README prose word count: 758 words
## Project Overview

This project is a short-video recommendation website developed for the Intelligent Interactive Systems Assignment 2 at the University of Birmingham. It explores how recommendation explanations and user controls can make short-video recommendations more transparent and controllable.

Users can watch sample videos, provide feedback and adjust category interests. The prototype shows how these actions affect interest scores and recommendation rankings.

## Project Features

The prototype provides a short-video feed containing eight sample videos across eight categories: Animals, Food, Nature, Fun, Travel, Sports, Music and City.

Users can select Like or Not Interested to provide feedback on a video. This changes the interest score associated with its category: Like increases the score by 15 points, while Not Interested decreases it by 25 points. Scores remain within a range of 0–100.

The Why this video? section explains a recommendation by displaying the video's category, original sample interest score and current interest score. Users can also open My Preferences to view and manually adjust interest scores for all eight categories through labelled sliders.

The prototype provides a preview of updated recommendation rankings. Users choose when to apply the new feed order, rather than having the current feed change immediately. An Undo option can reverse the last feedback action.

Feedback and manual preferences are saved in the browser using localStorage. Users can reset manual adjustments separately or use Forget My Data to remove their saved recommendation information.

## Project Status

The project is a working interactive prototype developed using React and TypeScript. Its core interface, feedback, explanation, preference-control, ranking-preview and browser-based data-management functions have been implemented.

The recommendation system is a rule-based simulation, not a trained machine-learning model. Predefined rules update category interest scores, and the resulting scores determine recommendation rankings. Manual preference settings take priority over feedback-based scores.

The prototype does not require an account or sign-in. User feedback and preferences are stored locally in the browser.

## Technologies Used

The prototype was developed using React and TypeScript, with Vite providing the development environment. Browser localStorage stores user feedback and preferences, while locally stored MP4 files provide the video content. Recommendation scoring and ranking are implemented using predefined rules rather than a trained machine-learning model.

## How to Run the Project

### Requirements

* Node.js
* npm (included with Node.js)

### Installation and Setup

Clone the public GitHub repository:

```bash
git clone https://github.com/baiweiyi907-source/short-video-recommender.git
```

Navigate to the project directory:

```bash
cd short-video-recommender
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display a local address in the terminal, usually:

```text
http://localhost:5173/
```

Open the displayed address in a web browser to access the prototype.

All eight MP4 videos are included in `public/videos/`. No additional download or separate ZIP file is required.

## Development Record

The table summarises the main development changes, why they were made and how the prototype was checked.

| Development Stage     | Changes and Reasons                                                                                                                 | Verification                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Initial Interface     | Built the short-video feed and organised eight sample videos into eight categories to establish the main user interaction.          | Checked page rendering and video playback in the browser.                     |
| Feedback and Ranking  | Implemented Like, Not Interested, interest-score updates, recommendation previews and Undo to make the effects of feedback visible. | Checked feedback actions, score changes and recommendation previews.          |
| Preference Management | Added eight labelled preference sliders so users can directly control category interests.                                           | Checked manual score adjustments and their effect on recommendation rankings. |
| Data Management       | Added browser localStorage and separate reset and deletion functions to support persistent preferences and user data control.       | Checked preference restoration, reset behaviour and data deletion.            |
| Video Sources         | Replaced externally hosted videos with eight local MP4 files to reduce dependence on external video sources.                        | Checked playback of the local video files in the browser.                     |
| Final Checks          | Reviewed the main prototype features and prepared the project files for submission through GitHub.                                  | Checked the main browser interactions and overall prototype behaviour.        |

## AI Assistance

I used ChatGPT to assist with React and TypeScript development, troubleshooting and project documentation. For example, I used AI assistance to investigate browser video playback issues while moving from externally hosted videos to local MP4 files.

I reviewed the suggested changes and made adjustments where necessary. I then checked the relevant behaviour in the browser, including local video playback and the prototype's main interactions. ChatGPT also helped me organise the system architecture diagram and storyboards. I reviewed the diagrams and written documentation to ensure they represented the implemented prototype accurately.

AI assistance supported the development and documentation process; I reviewed the final implementation and its behaviour.