import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { EntryController } from "./Entry/controllers/EntryController";
import { font } from "ascii-art";
import { EntryServiceImpl } from "./Entry/services/EntryServiceImpl";
import { EntryRepositoryPrismaImpl } from "./Entry/repositories/EntryRepositoryPrismaImpl";
import { PrismaClient } from "@prisma/client";

const app = new Hono()

const entryController = new EntryController(new EntryServiceImpl(
    new EntryRepositoryPrismaImpl(
        new PrismaClient()
    )
))

app.route("/entry", entryController.getRoute())

serve(app, () => {
    font("Attendance App", "Doom").toPromise().then((title) => {
        console.log(title)
    }).then(() => {
        console.log("server started on port 3000")
    })
})