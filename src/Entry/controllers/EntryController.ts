import { Context, Hono } from "hono"
import { EntryService } from "../services/EntryService"
import { EntryData, GuardEntryData } from "../repositories/EntryRepository"
import { invalidJsonRequestBodyFilter } from "../../middlewares/requestBodyMiddlewares"
import { jwtFilter, invaliddEntryDataFilter } from "../../middlewares/entryRouteMiddlewares"
import { MessagingService } from "../../services/MessagingService"
import { Payload } from "../../Auth/services/AuthService"

export class EntryController{

    private hono: Hono = new Hono()
    private entryService: EntryService
    private messagingService: MessagingService

    constructor(entryService: EntryService, messagingService: MessagingService){
        this.entryService = entryService
        this.messagingService = messagingService
    }

    getRoute(): Hono {

        this.hono.use("/add", invalidJsonRequestBodyFilter)
        this.hono.use("/add", jwtFilter)

        this.hono.post("/add", async (c: Context) => {
            const requestBody: GuardEntryData = await c.req.json()
            const payload: Payload = c.get('payload')
            const { id } = payload
            const entryData: EntryData = {
                ...requestBody,
                guardId: id
            }
            const entry = await this.entryService.addRecord(entryData).then(async (data) => {
                this.messagingService.sendMessage(data.phoneNumber)
                return data
            })
            return c.json(entry)
        })

        return this.hono
    }
}