import { Context, Hono } from "hono"
import { EntryService } from "../services/EntryService"
import { EntryData } from "../repositories/EntryRepository"
import { invalidJsonRequestBodyFilter } from "../../middlewares/requestBodyMiddlewares"
import { invaliddEntryDataFilter } from "../../middlewares/entryRouteMiddlewares"
import { MessagingService } from "../../services/MessagingService"

export class EntryController{

    private hono: Hono = new Hono()
    private entryService: EntryService
    private messagingService: MessagingService

    constructor(entryService: EntryService, messagingService: MessagingService){
        this.entryService = entryService
        this.messagingService = messagingService
    }

    getRoute(): Hono {

        this.hono.use("/add", invalidJsonRequestBodyFilter, invaliddEntryDataFilter)

        this.hono.post("/add", async (c: Context) => {
            const requestBody: EntryData = await c.req.json()
            const entry = await this.entryService.addRecord(requestBody).then(async (data) => {
                this.messagingService.sendMessage(data.phoneNumber)
                return data
            })
            return c.json(entry)
        })

        return this.hono
    }
}