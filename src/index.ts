import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { font } from "ascii-art"
import { studentEntryRoute } from "./routes/studentEntry"

const app = new Hono()

app.route("/entry", studentEntryRoute)

serve(app, () => {
    font("Attendance App", "Doom").toPromise().then((data) => {
        console.log(data);
    }).then(() => {
        console.log("server started on port 3000")
    })
})