import { Router } from "express";

const tweetRouter = Router();

//tweet crud
tweetRouter.post("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

tweetRouter.get("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

tweetRouter.use("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemeted ${id}` });
});

tweetRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented : ${id}` });
});

tweetRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

export default tweetRouter;
