export type EntryData = {
    studentLrn: string,
    guardId: string
}

export type EntryResponseData = {
    id: string,
    lrn: string,
    email: string,
    phoneNumber: string,
    fullname: string,
    gradeLevel: string,
    sectionName: string,
    timeIn: Date,
    entryCheckedBy: string,
    timeOut: Date | null,
    exitCheckedBy: string | null
}

export class EntryDoesNotExistsError extends Error{
    constructor(message: string){
        super(message)
    }
}

export interface EntryRepository{
    existsById(id: string): Promise<boolean>
    save(data: EntryData): Promise<EntryResponseData>
    deleteById(id: string): Promise<void>
    findIdOfLatestEntryByLrn(studentLrn: string): Promise<string>
}