import { Context, Hono } from "hono"
import { ExitService, StudentExitData } from "../services/ExitService"
import { invalidJsonRequestBodyFilter } from "../../middlewares/requestBodyMiddlewares"
import { MessagingService } from "../../services/MessagingService"
import { invaliddEntryDataFilter, jwtFilter } from "../../middlewares/entryRouteMiddlewares"
import { GuardEntryData } from "../../Entry/repositories/EntryRepository"
import { ExitData } from "../repository/ExitRepository"
import { Payload } from "../../Auth/services/AuthService"

export class ExitController{
    
    private hono: Hono = new Hono()
    private exitService: ExitService
    private messagingService: MessagingService

    constructor(exitService: ExitService, messagingService: MessagingService){
        this.exitService = exitService
        this.messagingService = messagingService
    }
    
    getRoute(): Hono {

        this.hono.use("/add", invalidJsonRequestBodyFilter)
        this.hono.use("/add", invaliddEntryDataFilter)
        this.hono.use("/add", jwtFilter)

        this.hono.post("/add", async (c: Context) => {
            const requestBody: GuardEntryData = await c.req.json()
            const payload: Payload = c.get('payload')
            const { id } = payload
            const exitData: StudentExitData = {
                ...requestBody,
                guardId: id
            }
            const exit = await this.exitService.addRecord(exitData).then(async (data) => {
                this.messagingService.sendMessage(data.phoneNumber)
                return data
            })
            return c.json(exit)
        })

        return this.hono
    }
}