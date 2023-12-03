import { EntryData, EntryRepository } from "../repositories/EntryRepository";
import { EntryService } from "./EntryService";

export class EntryServiceImpl implements EntryService{

    private entryRepository: EntryRepository

    constructor(entryRepository: EntryRepository){
        this.entryRepository = entryRepository
    }

    async addRecord(entryData: EntryData): Promise<any> {
        return await this.entryRepository.save(entryData)
    }
    async deleteRecord(id: string): Promise<void> {
        await this.entryRepository.deleteById(id)
    }
}