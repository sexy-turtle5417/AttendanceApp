import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { StudentRoute } from './routes/StudentRoute'
import { GuardRoute } from './routes/GuardRoute'

const app = new Hono()
app.route("/student", StudentRoute)
app.route("/guard", GuardRoute)

serve(app, () => {
    console.log("server started on port 3000")
})
