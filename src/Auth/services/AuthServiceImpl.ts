import { GuardRepository } from "../../Guard/repositories/GuardRepository";
import { AuthData, AuthResponse, AuthService, UnAuthorizedError } from "./AuthService";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { jwtSecretKey } from "../../Guard/services/RegistrationServiceImpl";
import { refreshTokenSecretKey } from "../../Guard/services/RegistrationServiceImpl";

export class AuthServiceImpl implements AuthService{

    private guardRepository: GuardRepository
    
    constructor(guardRepository: GuardRepository){
        this.guardRepository = guardRepository
    }

    async authenticate(authData: AuthData): Promise<AuthResponse> {
        const { email, password } = authData
        const passwordInDB = await this.guardRepository.getPasswordByEmail(email)
        if(!await compare(password, passwordInDB)){
            throw new UnAuthorizedError(`Incorrect email or password`)
        }
        const guard = await this.guardRepository.fingByEmail(email)
        const {firstname, lastname, middlename, ...payload} = guard
        const accessToken = sign(payload, jwtSecretKey, { expiresIn: '10min'})
        const refreshToken = sign(payload, refreshTokenSecretKey, { expiresIn: '8hrs'})
        return {
            accessToken,
            refreshToken
        }
    }
    
    async refresh(refreshToken: string): Promise<AuthResponse> {
        throw new Error("Method not implemented.");
    }
    
}