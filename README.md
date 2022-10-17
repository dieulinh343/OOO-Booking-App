# OOO Booking App Frontend

## Prerequisites

- NodeJS: 16
- npm: 8

## Using VSCode workspace

Use the file `.vscode/ooo-booking-frontend.code-workspace` to open this repo as a multi-root workspace

## Install Dependencies and Bootstrap

- In the root folder of this project, use this command to install all the dependencies for our packages and bootstrap those
```
npm install && npm run bootstrap
```

## Run in development mode

- If using VSCode workspace, open a new terminal tab with your selected portal (Ex: frontend-app). If not using VSCode workspace, relocate into packages/PORTAL_NAME
- In the selected portal root folder, use this command to start local dev-server
```
npm start
```
- If try running web-widget in your local, use these commands instead
```
npm start-app
npm start-demo
```
- Running on local dev-server but with dev, staging, or prod API, use this command (replace `dev` with `staging` or `prod` for different environments)
```
npm run start:dev
```
## Add something to commons package:

- Put your code into `packages/commons/src` folder
- Remember to add needed dependencies to `packages/commons/package.json`
- Export your module inside `packages/commons/src/index.js`
- Rebuild the package: Go to package folder and run `npm run build`
- To use it inside portals:

```javascript
import { Something } from '@ooo-booking/commons'
```

## Deployment

- In the root folder of this project, use this command to install all the dependencies
```
npm run bootstrap
```
- Inside the folder of the portal which you want to build, use this command to build the app bundle:
```
npm run build:dev
```
(Replace `dev` with `staging` or `prod` if you want to build for staging or production)

## Ports:
- Frontend App: 3000
