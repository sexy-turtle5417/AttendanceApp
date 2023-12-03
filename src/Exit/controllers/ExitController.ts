import { Context, Hono } from "hono"

export class ExitController{
    
    private hono: Hono = new Hono()
    
    getRoute(): Hono {

        this.hono.post("/add", async (c: Context) => {
            return c.json({ message: 'Hello, Hono'})
        })



        return this.hono
    }
}