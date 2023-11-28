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
    return c.json(guard)
})