import { Context } from "hono";
import { EntryData } from "../Entry/repositories/EntryRepository";

export async function invaliddEntryDataFilter(c: Context, next: Function){
    const requestBody: EntryData = await c.req.json()
    if(!requestBody.studentLrn){
        c.status(400)
        return c.json({ message: 'studentLrn is a required field' })
    }
    if(!requestBody.guardId){
        c.status(400)
        return c.json({ message: 'guardId is a required field'})
    }
    await next()
}