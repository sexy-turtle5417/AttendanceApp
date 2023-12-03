import { Context, Hono } from "hono"
import { ExitService, StudentExitData } from "../services/ExitService"
import { invalidJsonRequestBodyFilter } from "../../middlewares/requestBodyMiddlewares"
import { invaliddEntryDataFilter } from "../../middlewares/entryRouteMiddlewares"

export class ExitController{
    
    private hono: Hono = new Hono()
    private exitService: ExitService

    constructor(exitService: ExitService){
        this.exitService = exitService
    }
    
    getRoute(): Hono {

        this.hono.use("/add", invalidJsonRequestBodyFilter, invaliddEntryDataFilter)

        this.hono.post("/add", async (c: Context) => {
            const requestBody: StudentExitData = await c.req.json()
            const exit = await this.exitService.addRecord(requestBody)
            return c.json(exit)
        })

        return this.hono
    }
}