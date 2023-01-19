import express from "express";

export default () => {
  const router = express.Router();
  router.get("/", async (req, res) => {
    res.json({
      status: "healthy",
    });
  });
  return router;
};
