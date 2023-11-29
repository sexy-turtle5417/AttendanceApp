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
    const { studentLrn, guardId }  = data
    const existingStudent = await prisma.student.findUnique({ where: { lrn: studentLrn }})
    if(!existingStudent){
        c.status(400)
        return c.json({ message: `student with lrn '${studentLrn}' does not exist`})
    }
    const existingGuard = await prisma.guard.findUnique({ where: { id: guardId }})
    if(!existingGuard){
        c.status(400)
        return c.json({ message: `guard with id '${guardId}' dose not exist`})
    }
    const studentEntry = await prisma.studentEntry.create({ data })
    return c.json(studentEntry)
})

studentEntryRoute.delete("/delete/:id", async (c: Context) => {
    const id = Number(c.req.param('id'))
    const existingRecord = await prisma.studentEntry.findUnique({ where: { id }})
    if(!existingRecord){
        c.status(400)
        return c.json({ message: `Entry record with id '${id}' does not exist`})
    }
    return await prisma.studentEntry.delete({ where: { id }}).then(() => {
        return c.json({ message: `record with id '${id}' has been successfully deleted`})
    })
})