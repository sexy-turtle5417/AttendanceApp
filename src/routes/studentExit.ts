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
    const existingStudent = await prisma.student.findUnique({ where: { lrn: studentLrn }})
    const existingGuard = await prisma.guard.findUnique({ where: { id: guardId }})
    if(!existingStudent){
        c.status(400)
        return c.json({ message: `student with lrn '${studentLrn}' does not exist`})
    }
    if(!existingGuard){
        c.status(400)
        return c.json({ message: `guard with id '${guardId}' does not exist`})
    }
    try{
        const studentEntry = await prisma.studentEntry.findFirstOrThrow({ 
            where: { studentLrn: studentLrn}, 
            orderBy: { timeIn: 'desc'}
        });
        const studentEntryId = studentEntry.id
        const data = { studentEntryId, guardId }
        return await prisma.studentExit.create({ data }).then(async () => {
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
            WHERE studententry.id = ${studentEntryId};`
            return c.json(result[0])
        }); 
    }
    catch(err){
        c.status(400)
        return c.json({ message: `couldn't find any open student entries`})
    }  
})

studentExitRoute.delete("/delete/:id", async (c: Context) => {
    const id = Number(c.req.param('id'))
    const existingRecord = await prisma.studentExit.findUnique({ where: { id }})
    if(!existingRecord){
        c.status(400)
        return c.json({ message: `Exit record with id '${id}' does not exist`})
    }
    return await prisma.studentExit.delete({ where: { id }}).then(() => {
        return c.json({ message: `Record with id '${id}' has been successfully deleted`})
    })
})