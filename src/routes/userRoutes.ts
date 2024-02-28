import { Router } from "express";

const userRouter = Router();

//USER crud
userRouter.post("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

userRouter.get("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

userRouter.use("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemeted ${id}` });
});

userRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented : ${id}` });
});

userRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

export default userRouter;
