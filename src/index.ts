import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { StudentRoute } from './routes/StudentRoute'
import { GuardRoute } from './routes/GuardRoute'
import { StudentInRoute } from './routes/StudentInRoute'

const app = new Hono()
app.route("/student", StudentRoute)
app.route("/guard", GuardRoute)
app.route("/attendance/in/", StudentInRoute)

serve(app, () => {
    console.log("server started on port 3000")
})
