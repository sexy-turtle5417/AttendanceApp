import { GuardPublicInfo } from "../repositories/GuardRepository";

export interface GuardService{
    findGuardById(id: string): Promise<GuardPublicInfo>
}