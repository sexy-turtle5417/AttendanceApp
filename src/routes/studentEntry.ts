import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()
export const studentEntryRoute = new Hono()

export type StudentEntryData = {
    studentLrn: number,
    guardId: string
}

studentEntryRoute.post("/checkentry", async (c: Context) => {
    const data: StudentEntryData = await c.req.json()
    const studentEntry = await prisma.studentEntry.create({ data })
    return c.json(studentEntry)
})

studentEntryRoute.delete("/deleteentry/:id", async (c: Context) => {
    const id = Number(c.req.param('id'))
    return await prisma.studentEntry.delete({ where: { id }}).then(() => {
        return c.json({ message: `record with id '${id}' has been successfully deleted`})
    })
})