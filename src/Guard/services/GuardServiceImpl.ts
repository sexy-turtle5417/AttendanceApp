import { GuardPublicInfo, GuardRepository } from "../repositories/GuardRepository";
import { GuardService } from "./GuardService";

export class GuardServiceImpl implements GuardService{

    private guardRepository: GuardRepository

    constructor(guardRepository: GuardRepository){
        this.guardRepository = guardRepository
    }

    async findGuardById(id: string): Promise<GuardPublicInfo> {
        const guard = await this.guardRepository.findById(id)
        return guard;
    }
    
}