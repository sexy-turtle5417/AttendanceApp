import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { EntryController } from "./Entry/controllers/EntryController";
import { ExitController } from "./Exit/controllers/ExitController";
import { font } from "ascii-art";
import { EntryServiceImpl } from "./Entry/services/EntryServiceImpl";
import { EntryRepositoryPrismaImpl } from "./Entry/repositories/EntryRepositoryPrismaImpl";
import { PrismaClient } from "@prisma/client";
import { ExitServiceImpl } from "./Exit/services/ExitServiceImpl";
import { ExitRepositoryPrismaImpl } from "./Exit/repository/ExitRepositoryPrismaImpl";

const app = new Hono()

const entryController = new EntryController(new EntryServiceImpl(
    new EntryRepositoryPrismaImpl(
        new PrismaClient()
    )
))

const exitController = new ExitController( new ExitServiceImpl(
    new ExitRepositoryPrismaImpl( new PrismaClient()),
    new EntryRepositoryPrismaImpl( new PrismaClient())
))

app.route("/entry", entryController.getRoute())
app.route("/exit", exitController.getRoute())

serve(app, () => {
    font("Attendance App", "Doom").toPromise().then((title) => {
        console.log(title)
    }).then(() => {
        console.log("server started on port 3000")
    })
})