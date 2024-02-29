import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const userRouter = Router();
const prisma = new PrismaClient();
//USER crud

//create a user
userRouter.post("/", async (req, res) => {
  const { email, name, username } = req.body;

  try {
    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
        bio: "Hello! I'm New to Twitter",
      },
    });
    res.json(createUser);
  } catch (error) {
    res.status(400).json({ error: "Username and email should be unique" });
  }
});

//list all users
userRouter.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, image: true },
  });
  res.json(allUsers);
});

//get one user
userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      tweets: true,
    },
  });
  if (!user) {
    return res.status(400).json("No User found");
  }
  res.json(user);
});

//update User
//Not happening in postman. check once again.
userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;
  try {
    const updateUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        bio,
        name,
        image,
      },
    });
    res.json(updateUser);
  } catch (error) {
    res.status(400).json({ error: "Failed to Update the User" });
  }
});

//delete user
userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleteUser = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.status(200);
});

export default userRouter;
