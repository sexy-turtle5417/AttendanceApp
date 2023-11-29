import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export const studentEntryRoute = new Hono()

export type StudentEntryData = {
    studentLrn: number,
    guardId: string
}

studentEntryRoute.post("/add", async (c: Context) => {
    const data: StudentEntryData = await c.req.json()
    const studentEntry = await prisma.studentEntry.create({ data })
    return c.json(studentEntry)
})

studentEntryRoute.delete("/delete/:id", async (c: Context) => {
    const id = Number(c.req.param('id'))
    return await prisma.studentEntry.delete({ where: { id }}).then(() => {
        return c.json({ message: `record with id '${id}' has been successfully deleted`})
    })
})