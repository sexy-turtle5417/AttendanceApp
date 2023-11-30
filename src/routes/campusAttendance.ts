import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client"

export const campusAttendanceRoute = new Hono()
const prisma = new PrismaClient()

campusAttendanceRoute.get("/all", async (c: Context) => {
    const records = await prisma.$queryRaw`
    SELECT 
    studentEntry.id as "entryId",
    student.lrn as "lrn",
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
    ORDER BY timeEntered DESC`
    return c.json(records)
})
