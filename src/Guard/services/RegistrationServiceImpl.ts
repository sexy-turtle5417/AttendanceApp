import { GuardData, GuardRepository } from "../repositories/GuardRepository";
import { RegistrationResponse, RegistrationService } from "./RegistrationService";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "dotenv"

config()

export const jwtSecretKey: string = String(process.env.JWT_SECRET_KEY)
export const refreshTokenSecretKey: string = String(process.env.REFRESH_TOKEN_SECRET_KEY)

export class RegistrationServiceImpl implements RegistrationService{

    private guardRepository: GuardRepository

    constructor(guardRepisitory: GuardRepository){
        this.guardRepository = guardRepisitory
    }

    async register(guardData: GuardData): Promise<RegistrationResponse> {
        guardData.password = await hash(guardData.password, 10)
        const tokens = await this.guardRepository.save(guardData).then( async (data) => {
            const { password, firstname, lastname, middlename, ...guardPublicInfo} = data
            const accessToken = sign(guardPublicInfo, jwtSecretKey, { expiresIn: '10min'})
            const refreshToken = sign(guardPublicInfo, refreshTokenSecretKey, { expiresIn: '8hrs'})
            return { accessToken, refreshToken }
        });
        return tokens;
    }
}