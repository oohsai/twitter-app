import { PrismaClient, User } from "@prisma/client";
import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secretcode";

type AuthRequest = Request & { user?: User };

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];
  if (!jwtToken) {
    return res.sendStatus(401);
  }
  //decode the jwt token
  try {
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };
    if (!payload?.tokenId) {
      return res.sendStatus(401);
    }
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return res.sendStatus(401).json({ error: "API token expired" });
    }

    req.user = dbToken.user;
  } catch (error) {
    console.log(error);
  }
  next();
}
