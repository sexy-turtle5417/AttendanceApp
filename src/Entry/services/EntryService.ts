import { EntryData, EntryResponseData } from "../repositories/EntryRepository";

export interface EntryService{
    addRecord(entryData: EntryData): Promise<EntryResponseData>
    deleteRecord(id: string): Promise<void>
}