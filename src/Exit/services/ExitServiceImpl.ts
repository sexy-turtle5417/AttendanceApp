import { EntryRepository } from "../../Entry/repositories/EntryRepository";
import { ExitRepository } from "../repository/ExitRepository";
import { ExitService, StudentExitData } from "./ExitService";

export class ExitServiceImpl implements ExitService{

    private exitRepository: ExitRepository
    private entryRepository: EntryRepository

    constructor(exitRepository: ExitRepository, entryRepository: EntryRepository){
        this.exitRepository = exitRepository
        this.entryRepository = entryRepository
    }

    async addRecord(exitData: StudentExitData): Promise<any> {
        const { studentLrn, guardId } = exitData;
        const studentEntryId = await this.entryRepository.findIdOfLatestEntryByLrn(studentLrn)
        const exit = await this.exitRepository.save({ studentEntryId, guardId }) 
        return exit
    }

    async deleteRecord(id: string): Promise<void> {
        await this.exitRepository.deleteById(id)
    }
}