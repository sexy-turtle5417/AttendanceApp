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
import { AttendanceController } from "./Attendance/routes/AttendanceController";
import { AttendanceRepositoryPrismaImpl } from "./Attendance/repositories/AttendanceRepositoryPrismaImpl";
import { MessagingServiceMockImpl } from "./services/MessagingServiceMockImpl";
import { GuardController } from "./Guard/controllers/GuardController";
import { RegistrationServiceImpl } from "./Guard/services/RegistrationServiceImpl";
import { GuardRepositoryPrismaImpl } from "./Guard/repositories/GuardRepositoryPrismaImpl";
import { AuthController } from "./Auth/controllers/AuthController";
import { AuthServiceImpl } from "./Auth/services/AuthServiceImpl";

const app = new Hono()

const entryController = new EntryController(
    new EntryServiceImpl(
        new EntryRepositoryPrismaImpl(new PrismaClient())
    ),
    new MessagingServiceMockImpl()
)

const exitController = new ExitController( 
    new ExitServiceImpl(
        new ExitRepositoryPrismaImpl( new PrismaClient()),
        new EntryRepositoryPrismaImpl( new PrismaClient())
        ),
    new MessagingServiceMockImpl()
)

const attendanceController = new AttendanceController(
    new AttendanceRepositoryPrismaImpl( 
        new EntryRepositoryPrismaImpl( new PrismaClient() ),
        new PrismaClient()
    )
)

const guardController = new GuardController(
    new RegistrationServiceImpl(
        new GuardRepositoryPrismaImpl(new PrismaClient())
    )
)

const authController = new AuthController(
    new AuthServiceImpl(
        new GuardRepositoryPrismaImpl(new PrismaClient())
    )
)

app.route("/entry", entryController.getRoute())
app.route("/exit", exitController.getRoute())
app.route("/attendance", attendanceController.getRoute())
app.route("/guard", guardController.getRoute())
app.route("/auth", authController.getRoute())

serve(app, () => {
    font("Attendance App", "Doom").toPromise().then((title) => {
        console.log(title)
    }).then(() => {
        console.log("server started on port 3000")
    })
})