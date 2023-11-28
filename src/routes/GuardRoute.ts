import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { invalidJsonRequestBodyFilter } from "./middleware/UniversalMiddleWare";

export const GuardRoute = new Hono()
const prisma = new PrismaClient()

type GuardData = {
    id: number,
    fn: string,
    ln: string
}

async function invalidGuardDataFilter(c: Context, next: Function) {
    const data: GuardData = await c.req.json()
    c.status(400)
    if(!data.id){
        return c.json({ message: 'id is a required field'})
    }
    if(!data.fn){
        return c.json({ message: 'fn is a required field'})
    }
    if(!data.ln){
        return c.json({ message: 'ln is a required field'})
    }
    c.status(200)
    await next()
}

GuardRoute.post(
    "/create",
    invalidJsonRequestBodyFilter,
    invalidGuardDataFilter, 
    async (c: Context) => {
    const data: GuardData = await c.req.json()
    const existingGuard = await prisma.guard.findUnique({ where: { id: data.id }})
    if(existingGuard){
        return c.json({ message: `Guard with id ${data.id} already exists`})
    }
    const guard = await prisma.guard.create({ data })
    c.status(201)
    return c.json(guard)
})

GuardRoute.get("/all" , async (c: Context) => {
    const guards = await prisma.guard.findMany()
    return c.json(guards)
})

GuardRoute.get("/:id", async (c: Context) => {
    const id = Number(c.req.param('id'))
    const guard = await prisma.guard.findUnique({ where: { id }})
    if(!guard){
        c.status(400)
        return c.json({ message: `guard with id ${id} does not exist`})
    }
    return c.json(guard)
})

GuardRoute.put("/newid/:newid/id/:id", async (c: Context) => {
    const newId = Number(c.req.param('newid'))
    const id = Number(c.req.param('id'))
    const existingGuard = await prisma.guard.findUnique({ where: { id }})
    const existingId = await prisma.guard.findUnique({ where: { id: newId }})
    if(existingId){
        c.status(400)
        return c.json({ message: `Guard with id ${newId} already exists`})
    }
    if(!existingGuard){
        c.status(400)
        return c.json({ message: `Guard with id ${id} does not exist`})
    }
    const updatedGuard = await prisma.guard.update({ data: { id: newId}, where: { id }})
    c.status(200)
    return c.json(updatedGuard)
})

GuardRoute.put("firstname/:fn/id/:id",async (c: Context) => {
    const fn = c.req.param('fn')
    const id = Number(c.req.param('id'))
    const existingGuard = await prisma.guard.findUnique({ where: { id }})
    if(!existingGuard){
        c.status(400)
        return c.json({ message: `Guard with id ${id} does not exist`})
    }
    const updatedGuard = await prisma.guard.update({ data: { fn }, where: { id }})
    return c.json(updatedGuard)
})

GuardRoute.put("lastname/:ln/id/:id", async (c: Context) => {
    const ln = c.req.param('ln')
    const id = Number(c.req.param('id'))
    const existingGuard = await prisma.guard.findUnique({ where: { id }})
    if(!existingGuard){
        c.status(400)
        return c.json({ message: `Guard with id ${id} does not exist`})
    }
    const updatedGuard = await prisma.guard.update({ data: { ln }, where: { id }})
    return c.json(updatedGuard)
})

GuardRoute.delete("/:id", async (c: Context) => {
    const id = Number(c.req.param('id'))
    const existingGuard = await prisma.guard.findUnique({ where: { id }})
    if(!existingGuard){
        c.status(400)
        return c.json({ message: `Guard with id ${id} does not exist`})
    }
    return await prisma.guard.delete({ where: { id }}).then(() => {
        return c.json({ message: `Guard with id ${id} successfully deleted`})
    })
})