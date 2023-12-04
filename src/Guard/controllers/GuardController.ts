import { Context, Hono } from "hono"
import { RegistrationService } from "../services/RegistrationService"
import { GuardData } from "../repositories/GuardRepository"

export class GuardController{

    private hono: Hono = new Hono()
    private registrationService: RegistrationService

    constructor(registrationService: RegistrationService){
        this.registrationService = registrationService
    }

    getRoute(): Hono {
        this.hono.post("/register", async (c: Context) => {
            const requestBody: GuardData = await c.req.json()
            const tokens = await this.registrationService.register(requestBody)
            return c.json(tokens)
        })
        return this.hono
    }

}