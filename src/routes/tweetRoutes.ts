import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const tweetRouter = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secretcode";

//tweet crud
//create a user
tweetRouter.post("/", async (req, res) => {
  const { content, image } = req.body;
  //@ts-ignore
  const user = req.user;
  try {
    const createTweet = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
      include: { user: true },
    });
    res.json(createTweet);
    //TODO send emailToken to email
  } catch (error) {
    res.status(400).json({ error: "Username and email should be unique" });
  }
});

//get all tweets
tweetRouter.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({
    include: { user: { select: { id: true, name: true, image: true } } },
  });
  res.json(allTweets);
});

//get one tweet
tweetRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const tweetId = await prisma.tweet.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
      },
    });
    if (!tweetId) {
      return res.status(400).json("Tweet Not found");
    }
    res.json(tweetId);
  } catch (error) {
    res.status(400).json({ error: "fetch failed" });
  }
});

//update tweet
tweetRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, image } = req.body;
  const updateTweet = await prisma.tweet.update({
    where: {
      id: Number(id),
    },
    data: {
      content,
      image,
    },
  });
  res.json("Updated the tweet");
});

//delete tweet
tweetRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleteTweet = await prisma.tweet.delete({
    where: { id: Number(id) },
  });
  res.sendStatus(200).json("Deleted the Tweet");
});

export default tweetRouter;
