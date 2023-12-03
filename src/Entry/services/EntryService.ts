import { EntryData } from "../repositories/EntryRepository";

export interface EntryService{
    addRecord(entryData: EntryData): Promise<any>
    deleteRecord(id: string): Promise<void>
}