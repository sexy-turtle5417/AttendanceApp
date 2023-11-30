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
    const { id } = studentEntry
    const result: any[] = await prisma.$queryRaw`
    SELECT
    studentEntry.id as "entryId",
    student.lrn,
    gradelevel.name as "gradeLevel",
    section.name as "section",
    concat(student.firstname, " ", student.lastname) as "fullname",
    timeIn as "timeEntered",
    concat(guardEntry.firstname, " ", guardEntry.lastname) as "entryCheckedBy",
    timeOut as "timeExited",
    concat(guardExit.firstname, " ", guardExit.lastname) as "exitCheckedBy"
    FROM 
    studententry
    LEFT JOIN student
    ON student.lrn = studententry.studentLrn
    LEFT JOIN guard as guardEntry
    ON guardEntry.id = studententry.guardId
    LEFT JOIN section
    ON student.sectionId = section.id
    LEFT JOIN gradelevel
    ON section.level = gradelevel.level
    LEFT JOIN studentexit
    ON studententry.id = studentexit.studentEntryId
    LEFT JOIN guard as guardExit
    ON guardExit.id = studentexit.guardId
    WHERE studententry.id = ${id};`
    return c.json(result[0])
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