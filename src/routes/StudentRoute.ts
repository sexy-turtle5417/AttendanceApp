import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { invalidJsonRequestBodyFilter } from "./middleware/UniversalMiddleWare";

export const StudentRoute = new Hono();
const prisma = new PrismaClient();

type StudentData = {
    lrn: number,
    fn: string,
    ln: string
}

async function invalidStudentJsonFilter(c: Context, next: Function){
    const requestBody: StudentData = await c.req.json()
    c.status(400)
    if(!requestBody.lrn){
        return c.json({ message: "JSON must have an lrn field"})
    }
    if(!requestBody.fn){
        return c.json({ message: 'JSON must have a fn field'})
    }
    if(!requestBody.ln){
        return c.json({ message: 'JSON must have a ln field'})
    }
    c.status(200)
    await next()
}

StudentRoute.post(
    "/create", 
    invalidJsonRequestBodyFilter, 
    invalidStudentJsonFilter, 
    async (c: Context) => {
    const data: StudentData = await c.req.json();
    const existingStudent = await prisma.student.findUnique({ where: { lrn: data.lrn}})
    if(existingStudent){
        c.status(400)
        return c.json({ message: `student with lrn ${data.lrn} already exists`})
    }
    const student = await prisma.student.create({data})
    c.status(201)
    return c.json(student)
})

StudentRoute.get("/all", async (c: Context) => {
    const students = await prisma.student.findMany()
    return c.json(students)
})

StudentRoute.get("/:lrn", async (c: Context) => {
    const lrn = Number(c.req.param('lrn'))
    const student = await prisma.student.findUnique({ where: { lrn }})
    if(!student){
        c.status(400)
        return c.json({ message: `Student with lrn ${lrn} does not exist`})
    }
    return c.json(student)
})

StudentRoute.put("/newlrn/:newlrn/lrn/:lrn", async (c: Context) => {
    const newlrn = Number(c.req.param('newlrn'))
    const lrn = Number(c.req.param('lrn'))
    const existingLrn = await prisma.student.findUnique({ where: { lrn: newlrn}})
    if(existingLrn){
        c.status(400)
        return c.json({ message: `Student with lrn ${newlrn} already exists`})
    }
    const existingStudent = await prisma.student.findUnique({ where: { lrn }})
    if(!existingStudent){
        return c.json({ message: `Student with lrn ${lrn} does not exist`})
    }
    const updatedStudent = await prisma.student.update({ data: { lrn: newlrn}, where: { lrn }})
    return c.json(updatedStudent)
})

StudentRoute.put("/firstname/:fn/lrn/:lrn", async (c: Context) => {
    const fn = c.req.param('fn')
    const lrn = Number(c.req.param('lrn'))
    const existingStudent = await prisma.student.findUnique({ where: { lrn }})
    if(!existingStudent){
        return c.json({ message: `Student with lrn ${lrn} does not exist`})
    }
    const updatedStudent = await prisma.student.update({ data: { fn }, where: { lrn }})
    return c.json(updatedStudent)
})

StudentRoute.put("/lastname/:ln/lrn/:lrn", async (c: Context) => {
    const ln = c.req.param('ln')
    const lrn = Number(c.req.param('lrn'))
    const existingStudent = await prisma.student.findUnique({ where: { lrn }})
    if(!existingStudent){
        return c.json({ message: `Student with lrn ${lrn} does not exist`})
    }
    const updatedStudent = await prisma.student.update({ data: { ln }, where: { lrn }})
    return c.json(updatedStudent)
})

StudentRoute.delete("/:lrn", async (c: Context) => {
    const lrn = Number(c.req.param('lrn'))
    const existingStudent = await prisma.student.findUnique({ where: { lrn }})
    if(!existingStudent){
        return c.json({ message: `Student with lrn ${lrn} does not exist`})
    }
    return await prisma.student.delete({ where: { lrn }}).then(() => {
        return c.json({ message: `Student with lrn ${lrn} successfully deleted`})
    })
})

