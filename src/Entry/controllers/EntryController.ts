import { Context, Hono } from "hono"

export class EntryController{

    private hono: Hono = new Hono()

    getRoute(): Hono {

        this.hono.post("/add", async (c: Context) => {
            return c.json({ message: 'Hello World'})
        })

        return this.hono
    }

}