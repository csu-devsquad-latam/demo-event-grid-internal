import type {
  EventGridManagementClient,
  EventSubscription,
} from "@azure/arm-eventgrid";
import { EventGridPublisherClient } from "@azure/eventgrid";
import type { DefaultAzureCredential } from "@azure/identity";
import express from "express";
import type {
  RegisterRequest,
  RegisterResponse,
  SettlementVerifyEvent,
  SettlementVerifyRequest,
  SettlementVerifyResponse,
} from "../types";

const {
  EVENT_GRID_RESOURCE_GROUP: resourceGroupName,
  EVENT_GRID_DOMAIN_NAME: domainName,
  EVENT_GRID_DOMAIN_ENDPOINT: domainEndpoint,
} = process.env;

export default (
  credential: DefaultAzureCredential,
  client: EventGridManagementClient
) => {
  const router = express.Router();

  router.post<{}, RegisterResponse, RegisterRequest>(
    "/register",
    async (req, res) => {
      const { eventType, participantId, targetUrl } = req.body;

      console.log(resourceGroupName, domainName, participantId);
      console.log("creating or updating topic", participantId);
      const topicName = `${participantId}-topic`;
      const result = await client.domainTopics.beginCreateOrUpdateAndWait(
        resourceGroupName!,
        domainName!,
        topicName
      );
      console.log(result);
      const eventSubscriptionName = `${participantId}-${eventType}-sub`;
      const eventSubscriptionInfo: EventSubscription = {
        destination: {
          endpointType: "WebHook",
          endpointUrl: targetUrl!,
        },
        filter: {
          isSubjectCaseSensitive: false,
          subjectBeginsWith: eventType,
        },
      };

      const subscriptionResult =
        await client.domainTopicEventSubscriptions.beginCreateOrUpdateAndWait(
          resourceGroupName!,
          domainName!,
          topicName,
          eventSubscriptionName,
          eventSubscriptionInfo
        );
      console.log(subscriptionResult);
      return res.json({ status: "OK" });
    }
  );

  router.post<{}, SettlementVerifyResponse, SettlementVerifyRequest>(
    "/settlement/verify",
    async (req, res) => {
      console.log(req.body);
      const { participantId, settlementId, transactionId } = req.body;
      const topicName = `${participantId}-topic`;
      const subject = "settlementVerify";

      const client = new EventGridPublisherClient(
        domainEndpoint!,
        "EventGrid",
        credential
      );

      let receivedEvent: SettlementVerifyEvent = {
        transactionId,
        settlementId,
        participantId,
        settlementStatus: "received",
      };

      let processingEvent: SettlementVerifyEvent = {
        ...receivedEvent,
        settlementStatus: "processing",
      };

      let verifiedEvent: SettlementVerifyEvent = {
        ...receivedEvent,
        settlementStatus: "verified",
      };

      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      client.send([
        {
          eventType: "CustomEvent.Received",
          topic: topicName,
          subject,
          dataVersion: "1.0",
          data: {
            ...receivedEvent,
          },
        },
      ]);

      wait(500)
        .then(() => {
          client.send([
            {
              eventType: "CustomEvent.Processing",
              topic: topicName,
              subject,
              dataVersion: "1.0",
              data: {
                ...processingEvent,
              },
            },
          ]);
        })
        .then(() => wait(2000))
        .then(() => {
          client.send([
            {
              eventType: "CustomEvent.Verified",
              topic: topicName,
              subject,
              dataVersion: "1.0",
              data: {
                ...verifiedEvent,
              },
            },
          ]);
        });

      res.json({ status: "ACK" });
    }
  );

  return router;
};
