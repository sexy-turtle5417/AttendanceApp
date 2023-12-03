import { Context, Hono } from "hono"
import { EntryService } from "../services/EntryService"
import { EntryData } from "../repositories/EntryRepository"
import { invalidJsonRequestBodyFilter } from "../../middlewares/requestBodyMiddlewares"
import { invaliddEntryDataFilter } from "./middlewares/entryRouteMiddlewares"

export class EntryController{

    private hono: Hono = new Hono()
    private entryService: EntryService

    constructor(entryService: EntryService){
        this.entryService = entryService
    }

    getRoute(): Hono {

        this.hono.use("/add", invalidJsonRequestBodyFilter, invaliddEntryDataFilter)

        this.hono.post("/add", async (c: Context) => {
            const requestBody: EntryData = await c.req.json()
            const entry = await this.entryService.addRecord(requestBody)
            return c.json(entry)
        })

        return this.hono
    }
}