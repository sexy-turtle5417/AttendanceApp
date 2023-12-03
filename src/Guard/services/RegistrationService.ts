import { GuardData } from "../repositories/GuardRepository";

export type RegistrationResponse = {
    id: string,
    email: string,
    accessToken: string,
    refreshToken: string
}

export interface RegistrationService {
    register(guardData: GuardData): Promise<RegistrationResponse>
}