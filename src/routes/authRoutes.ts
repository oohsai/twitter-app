import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const authRouter = Router();
const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
//endpoints

//generate a random 8 digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
//Create a user, if it doesnt exist
//generate teh emailToken and send it to their mail
authRouter.post("/login", async (req, res) => {
  const { email } = req.body;
  //generate the token
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );
  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: {
              email, //if user already exists
            },
            create: {
              email, //if user doesn't exists
            },
          },
        },
      },
    });
    console.log(createdToken);
    //send emailToken to email
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400).json({ error: "Something Bad Happened" });
  }
});

//Validate the emailToken
//Generate a long-lived JWT token
authRouter.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;
  console.log(email, emailToken);

  const dbEmailToken = await prisma.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  });
  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json("Token Expired");
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  //All check for user is done
  // Now generate API token as user is legit

  res.sendStatus(200);
});

export default authRouter;
