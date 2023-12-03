import { Entry } from "@prisma/client"

export type EntryData = {
    studentLrn: string,
    guardId: string
}

export class EntryDoesNotExistsError extends Error{
    constructor(message: string){
        super(message)
    }
}

export interface EntryRepository{
    existsById(id: string): Promise<boolean>
    save(data: EntryData): Promise<any>
    deleteById(id: string): Promise<void>
    findIdOfLatestEntryByLrn(studentLrn: string): Promise<string>
}