import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { font } from "ascii-art"
import { studentEntryRoute } from "./routes/studentEntry"
import { studentExitRoute } from "./routes/studentExit"
import { campusAttendanceRoute } from "./routes/campusAttendance"
import { cors } from "hono/cors"

const app = new Hono()

app.use("/*", cors({
    origin: ['http://localhost:5173'],
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
}))

app.route("/entry", studentEntryRoute)
app.route("/exit", studentExitRoute)
app.route("/attendance", campusAttendanceRoute)

serve(app, () => {
    font("Attendance App", "Doom").toPromise().then((data) => {
        console.log(data);
    }).then(() => {
        console.log("server started on port 3000")
    })
})