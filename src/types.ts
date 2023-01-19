export type RegisterRequest = {
  participantId: string; // GUID
  targetUrl: string;
  eventType: string;
  authType: string;
  accessToken: string;
};

export type RegisterResponse = {
  status: string;
};

export type SettlementVerifyRequest = {
  transactionId: string; // GUID
  participantId: string; // GUID
  settlementId: string; // GUID
};

export type SettlementVerifyResponse = {
  status: string;
};

export type SettlementVerifyEvent = {
  transactionId: string; // GUID
  participantId: string; // GUID
  settlementId: string; // GUID
  settlementStatus: "received" | "processing" | "verified";
};
