import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client"

export const studentExitRoute = new Hono()
const prisma = new PrismaClient()

type StudentExitData = {
    studentLrn: number,
    guardId: string
}

studentExitRoute.post("/add", async (c: Context) => {
    const requestBody: StudentExitData = await c.req.json()
    const { studentLrn, guardId } = requestBody
    const studentEntry = await prisma.studentEntry.findFirstOrThrow({ 
        where: { studentLrn: studentLrn}, 
        orderBy: { timeIn: 'desc'}
    });
    const studentEntryId = studentEntry.id
    const data = { studentEntryId, guardId }
    const studentExit = await prisma.studentExit.create({ data })
    return c.json(studentExit)
})

studentExitRoute.delete("/delete/:id", async (c: Context) => {
    const id = Number(c.req.param('id'))
    return await prisma.studentExit.delete({ where: { id }}).then(() => {
        return c.json({ message: `Record with id '${id}' has been successfully deleted`})
    })
})