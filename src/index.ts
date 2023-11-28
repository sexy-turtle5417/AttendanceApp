import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { StudentRoute } from './routes/StudentRoute'
import { font } from 'ascii-art'

const app = new Hono()
app.route("/student", StudentRoute)

serve(app, () => {
    console.log("server started on port 3000")
})
