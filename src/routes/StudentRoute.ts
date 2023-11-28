import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client";

export const StudentRoute = new Hono();
const prisma = new PrismaClient();

StudentRoute.post("/create", async (c: Context) => {
    const data = await c.req.json();
    const student = await prisma.student.create({data})
    return c.json(student)
})