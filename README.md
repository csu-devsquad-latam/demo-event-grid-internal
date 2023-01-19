# Event Grid Demo

## Getting Started

### Prerequisite
* A Event Grid Domain created
* A Service Principal that has the following roles: "EventGrid Contributor" and "EventGrid Data Sender"
* (Optional) Install `humao.rest-client` VSCode Extension to run the `demo.rest` file

### Steps
0. Install NodeJS LTS
1. `npm ci`
2. Duplicate `.env.example` and fill out the information
3. `npm run dev` Starts a local development of this application
4. If you have the Rest Client extension install in your VS Code, you can send the requests in the `demo.rest` file
