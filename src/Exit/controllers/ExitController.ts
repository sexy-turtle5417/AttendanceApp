import { Context, Hono } from "hono"
import { ExitService, StudentExitData } from "../services/ExitService"
import { invalidJsonRequestBodyFilter } from "../../middlewares/requestBodyMiddlewares"
import { invaliddEntryDataFilter } from "../../middlewares/entryRouteMiddlewares"
import { MessagingService } from "../../services/MessagingService"

export class ExitController{
    
    private hono: Hono = new Hono()
    private exitService: ExitService
    private messagingService: MessagingService

    constructor(exitService: ExitService, messagingService: MessagingService){
        this.exitService = exitService
        this.messagingService = messagingService
    }
    
    getRoute(): Hono {

        this.hono.use("/add", invalidJsonRequestBodyFilter, invaliddEntryDataFilter)

        this.hono.post("/add", async (c: Context) => {
            const requestBody: StudentExitData = await c.req.json()
            const exit = await this.exitService.addRecord(requestBody).then(async (data) => {
                this.messagingService.sendMessage(data.phoneNumber)
                return data
            })
            return c.json(exit)
        })

        return this.hono
    }
}