import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";
import { EventGridManagementClient } from "@azure/arm-eventgrid";
import { DefaultAzureCredential } from "@azure/identity";

dotenv.config();

import health from "./routes/health";
import settlement from "./routes/settlement";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const { EVENT_GRID_DOMAIN_SUBSCRIPTION_ID: subscriptionId } = process.env;

const credential = new DefaultAzureCredential();
const client = new EventGridManagementClient(credential, subscriptionId!);

app.use("/healthz", health());
app.use("/", settlement(credential, client));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
