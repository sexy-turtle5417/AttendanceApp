import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

export const StudentInRoute = new Hono()
const prisma = new PrismaClient()

StudentInRoute.post("/create")