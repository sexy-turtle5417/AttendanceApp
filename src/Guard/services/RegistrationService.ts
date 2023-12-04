import { GuardData } from "../repositories/GuardRepository";

export type RegistrationResponse = {
    accessToken: string,
    refreshToken: string
}

export interface RegistrationService {
    register(guardData: GuardData): Promise<RegistrationResponse>
}