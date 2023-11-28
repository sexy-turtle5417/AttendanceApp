import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { StudentRoute } from './routes/StudentRoute'

const app = new Hono()
app.route("/student", StudentRoute)

serve(app)
