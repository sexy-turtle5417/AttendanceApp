import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { font } from "ascii-art"

const app = new Hono()
serve(app, () => {
    font("Attendance App", "Doom").toPromise().then((data) => {
        console.log(data);
    }).then(() => {
        console.log("server started on port 3000")
    })
})