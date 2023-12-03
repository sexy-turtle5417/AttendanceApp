import { Context } from "hono";

export async function invalidJsonRequestBodyFilter(c: Context, next: Function){
    try{
        await c.req.json()
        await next()
    }
    catch(err){
        c.status(400)
        return c.json({ message: 'Requestbody must be valid JSON'})
    }
}