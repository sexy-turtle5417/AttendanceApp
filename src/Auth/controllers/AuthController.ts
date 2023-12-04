import { Context, Hono } from "hono";
import { AuthData, AuthService } from "../services/AuthService";

export class AuthController{

    private hono: Hono = new Hono()
    private authService: AuthService

    constructor(authService: AuthService){
        this.authService = authService
    }

    getRoute(): Hono {

        this.hono.post("/login", async (c: Context) => {
            const authData: AuthData = await c.req.json()
            const tokens = await this.authService.authenticate(authData)
            return c.json(tokens)
        })





        return this.hono
    }

}