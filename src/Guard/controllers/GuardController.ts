import { Context, Hono } from "hono"
import { RegistrationService } from "../services/RegistrationService"
import { GuardData } from "../repositories/GuardRepository"
import { jwtFilter } from "../../middlewares/entryRouteMiddlewares"
import { Payload } from "../../Auth/services/AuthService"
import { GuardService } from "../services/GuardService"

export class GuardController{

    private hono: Hono = new Hono()
    private registrationService: RegistrationService
    private guardService: GuardService

    constructor(registrationService: RegistrationService, guardService: GuardService){
        this.registrationService = registrationService
        this.guardService = guardService
    }

    getRoute(): Hono {

        this.hono.use("/details", jwtFilter)

        this.hono.post("/register", async (c: Context) => {
            const requestBody: GuardData = await c.req.json()
            const tokens = await this.registrationService.register(requestBody)
            return c.json(tokens)
        })

        this.hono.get("/details", async (c: Context) => {
            const payload: Payload = c.get('payload')
            console.log(payload)
            const { id } = payload
            const guard = await this.guardService.findGuardById(id)
            return c.json(guard)
        })

        return this.hono
    }

}