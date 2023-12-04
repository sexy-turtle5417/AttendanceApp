import { Context } from "hono";
import { EntryData } from "../Entry/repositories/EntryRepository";
import { verify } from "jsonwebtoken";
import { jwtSecretKey } from "../Guard/services/RegistrationServiceImpl";

export async function invaliddEntryDataFilter(c: Context, next: Function){
    const requestBody: EntryData = await c.req.json()
    if(!requestBody.studentLrn){
        c.status(400)
        return c.json({ message: 'studentLrn is a required field' })
    }
    await next()
}

export async function jwtFilter(c: Context, next: Function){
    const authHeader = c.req.header("Authorization")
    if(!authHeader){
        c.status(400)
        return c.json({ message: 'Must have an Authorization token'})
    }
    else if(authHeader){
        const token = authHeader.split(" ")[1]
        const payload = verify(token, jwtSecretKey)
        c.set('payload', payload)
        await next()
    }
}